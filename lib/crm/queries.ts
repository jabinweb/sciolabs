import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { ensureDb } from "./db"
import type {
  Agent,
  AgentRole,
  CannedResponse,
  Contact,
  DashboardStats,
  KbArticle,
  TicketViewCounts,
  Ticket,
  TicketMessage,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "./types"
import { listDeskAgentsFromSiteUsers, updateDeskUser } from "./site-user"
import { isInternalImportTag } from "./format"
import { slaDueDatesFor, applySlaDues } from "./sla"
import { runAutomations } from "./automations"
import {
  notifyAgentsNewTicket,
  notifyCustomerAgentReply,
  notifyCustomerTicketCreated,
} from "./email"

type TicketRow = Prisma.CrmTicketGetPayload<{
  include: { contact: true; assignee: true }
}>

function toTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    number: row.number,
    contactId: row.contactId,
    assigneeId: row.assigneeId,
    subject: row.subject,
    description: row.description,
    status: row.status as TicketStatus,
    priority: row.priority as TicketPriority,
    type: row.type as TicketType,
    source: row.source as Ticket["source"],
    tags: row.tags ?? [],
    appFeedbackId: row.appFeedbackId,
    firstResponseAt: row.firstResponseAt,
    resolvedAt: row.resolvedAt,
    firstResponseDueAt: row.firstResponseDueAt,
    resolutionDueAt: row.resolutionDueAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    contactName: row.contact?.name ?? null,
    contactEmail: row.contact?.email ?? null,
    licenseTier:
      row.contact?.licenseTier === "FULL" || row.contact?.licenseTier === "FREE"
        ? row.contact.licenseTier
        : null,
    assigneeName: row.assignee?.name ?? row.assignee?.email ?? null,
  }
}

function toContact(row: {
  id: string
  appUserId: string | null
  email: string | null
  name: string | null
  licenseTier: string | null
  subscriptionStatus: string | null
  phone: string | null
  tags: string[]
  lastSeenAt: Date | null
  createdAt: Date
}): Contact {
  return {
    id: row.id,
    appUserId: row.appUserId,
    email: row.email,
    name: row.name,
    licenseTier: row.licenseTier === "FULL" || row.licenseTier === "FREE" ? row.licenseTier : null,
    subscriptionStatus: row.subscriptionStatus,
    phone: row.phone,
    tags: row.tags ?? [],
    lastSeenAt: row.lastSeenAt,
    createdAt: row.createdAt,
  }
}

const ticketInclude = { contact: true, assignee: true } as const

export async function getDashboardStats(): Promise<DashboardStats> {
  const [row] = await prisma.$queryRaw<
    Array<{
      open: number
      pending: number
      unassigned: number
      urgent: number
      resolvedToday: number
      fromApp24h: number
    }>
  >`
    SELECT
      CAST(COUNT(*) FILTER (WHERE status = 'open') AS INT) AS open,
      CAST(COUNT(*) FILTER (WHERE status = 'pending') AS INT) AS pending,
      CAST(COUNT(*) FILTER (WHERE status IN ('open','pending') AND assignee_id IS NULL) AS INT) AS unassigned,
      CAST(COUNT(*) FILTER (WHERE status IN ('open','pending') AND priority = 'urgent') AS INT) AS urgent,
      CAST(COUNT(*) FILTER (WHERE status = 'resolved' AND resolved_at >= date_trunc('day', now())) AS INT) AS "resolvedToday",
      CAST(COUNT(*) FILTER (WHERE source IN ('portal','app','feedback') AND created_at >= now() - interval '24 hours') AS INT) AS "fromApp24h"
    FROM tickets
  `
  return (
    row ?? {
      open: 0,
      pending: 0,
      unassigned: 0,
      urgent: 0,
      resolvedToday: 0,
      fromApp24h: 0,
    }
  )
}

export async function countTicketViews(agentId: string): Promise<TicketViewCounts> {
  const [row] = await prisma.$queryRaw<
    Array<{
      all: number
      open: number
      mine: number
      unassigned: number
      urgent: number
    }>
  >`
    SELECT
      CAST(COUNT(*) AS INT) AS "all",
      CAST(COUNT(*) FILTER (WHERE status IN ('open','pending')) AS INT) AS open,
      CAST(COUNT(*) FILTER (WHERE status IN ('open','pending') AND assignee_id = ${agentId}) AS INT) AS mine,
      CAST(COUNT(*) FILTER (WHERE status IN ('open','pending') AND assignee_id IS NULL) AS INT) AS unassigned,
      CAST(COUNT(*) FILTER (WHERE status IN ('open','pending') AND priority = 'urgent') AS INT) AS urgent
    FROM tickets
  `
  return row ?? { all: 0, open: 0, mine: 0, unassigned: 0, urgent: 0 }
}

export async function listTickets(opts: {
  status?: string
  priority?: string
  type?: string
  q?: string
  view?: string
  assigneeId?: string | null
  page?: number
  pageSize?: number
}): Promise<{ items: Ticket[]; total: number }> {
  const status = opts.status && opts.status !== "all" ? opts.status : null
  const priority = opts.priority && opts.priority !== "all" ? opts.priority : null
  const type = opts.type && opts.type !== "all" ? opts.type : null
  const q = opts.q?.trim() ?? ""
  const view = opts.view && opts.view !== "all" ? opts.view : null
  const pageSize = Math.max(1, opts.pageSize ?? 200)
  const page = Math.max(1, opts.page ?? 1)

  const and: Prisma.CrmTicketWhereInput[] = []
  if (status) and.push({ status })
  if (priority) and.push({ priority })
  if (type) and.push({ type })

  if (view === "mine") {
    if (!opts.assigneeId) return { items: [], total: 0 }
    and.push({ assigneeId: opts.assigneeId })
    and.push({ status: { in: ["open", "pending"] } })
  } else if (view === "unassigned") {
    and.push({ assigneeId: null })
    and.push({ status: { in: ["open", "pending"] } })
  } else if (view === "urgent") {
    and.push({ priority: "urgent" })
    and.push({ status: { in: ["open", "pending"] } })
  } else if (view === "open") {
    and.push({ status: { in: ["open", "pending"] } })
  } else if (opts.assigneeId) {
    and.push({ assigneeId: opts.assigneeId })
  }

  if (q) {
    const digits = q.replace(/^#/, "")
    const asNumber = Number(digits)
    const or: Prisma.CrmTicketWhereInput[] = [
      { subject: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { contact: { name: { contains: q, mode: "insensitive" } } },
      { contact: { email: { contains: q, mode: "insensitive" } } },
      { tags: { has: q } },
    ]
    if (Number.isFinite(asNumber) && digits.length > 0) {
      or.push({ number: asNumber })
    }
    and.push({ OR: or })
  }

  const where: Prisma.CrmTicketWhereInput = and.length ? { AND: and } : {}
  const [total, rows] = await Promise.all([
    prisma.crmTicket.count({ where }),
    prisma.crmTicket.findMany({
      where,
      include: ticketInclude,
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return { total, items: rows.map(toTicket) }
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const row = await prisma.crmTicket.findUnique({
    where: { id },
    include: ticketInclude,
  })
  return row ? toTicket(row) : null
}

export async function listMessages(ticketId: string): Promise<TicketMessage[]> {
  const rows = await prisma.crmTicketMessage.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
  })
  return rows.map((row) => ({
    id: row.id,
    ticketId: row.ticketId,
    authorType: row.authorType as TicketMessage["authorType"],
    authorId: row.authorId,
    authorName: row.authorName,
    body: row.body,
    isInternal: row.isInternal,
    createdAt: row.createdAt,
  }))
}

export async function listAgents(): Promise<Agent[]> {
  return listDeskAgentsFromSiteUsers()
}

export async function listCannedResponses(): Promise<CannedResponse[]> {
  const rows = await prisma.crmCannedResponse.findMany({ orderBy: { title: "asc" } })
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    shortcut: row.shortcut,
    body: row.body,
  }))
}

export async function listContacts(
  q?: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<{ items: (Contact & { ticketCount: number })[]; total: number }> {
  const query = q?.trim()
  const pageSize = Math.max(1, opts.pageSize ?? 200)
  const page = Math.max(1, opts.page ?? 1)
  const where: Prisma.CrmContactWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      }
    : {}

  const [total, rows] = await Promise.all([
    prisma.crmContact.count({ where }),
    prisma.crmContact.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { tickets: true } } },
    }),
  ])

  return {
    total,
    items: rows.map((row) => ({ ...toContact(row), ticketCount: row._count.tickets })),
  }
}

export async function getContact(id: string): Promise<Contact | null> {
  const row = await prisma.crmContact.findUnique({ where: { id } })
  return row ? toContact(row) : null
}

export async function listTicketsForContact(contactId: string): Promise<Ticket[]> {
  const rows = await prisma.crmTicket.findMany({
    where: { contactId },
    include: ticketInclude,
    orderBy: { createdAt: "desc" },
  })
  return rows.map(toTicket)
}

export async function listKbArticles(): Promise<KbArticle[]> {
  await ensureDb()
  const rows = await prisma.crmKbArticle.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
  })
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    body: row.body,
    published: row.published,
    updatedAt: row.updatedAt,
  }))
}

export type IngestTicketInput = {
  appUserId?: string | null
  email?: string | null
  name?: string | null
  licenseTier?: "FREE" | "FULL" | null
  subscriptionStatus?: string | null
  feedbackId?: string | null
  type?: string | null
  message: string
  subject?: string | null
  path?: string | null
  source?: Ticket["source"]
  tags?: string[]
  phone?: string | null
}

function mapFeedbackType(type: string | null | undefined): {
  type: TicketType
  priority: TicketPriority
} {
  if (type === "bug") return { type: "bug", priority: "high" }
  if (type === "feature") return { type: "feature", priority: "medium" }
  if (type === "billing") return { type: "billing", priority: "high" }
  if (type === "question") return { type: "question", priority: "medium" }
  return { type: "general", priority: "medium" }
}

export async function ingestTicket(input: IngestTicketInput) {
  await ensureDb()
  const message = input.message.trim()
  if (message.length < 1) throw new Error("Message is required")

  if (input.feedbackId) {
    const existing = await prisma.crmTicket.findUnique({
      where: { appFeedbackId: input.feedbackId },
      select: { id: true, number: true },
    })
    if (existing) return existing
  }

  let contactId: string | null = null
  if (input.appUserId) {
    const found = await prisma.crmContact.findUnique({ where: { appUserId: input.appUserId } })
    contactId = found?.id ?? null
  }
  if (!contactId && input.email) {
    const found = await prisma.crmContact.findFirst({
      where: { email: { equals: input.email, mode: "insensitive" } },
    })
    contactId = found?.id ?? null
  }

  const license =
    input.licenseTier === "FULL" || input.licenseTier === "FREE" ? input.licenseTier : null

  if (contactId) {
    await prisma.crmContact.update({
      where: { id: contactId },
      data: {
        lastSeenAt: new Date(),
        ...(input.email ? { email: input.email } : {}),
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(license ? { licenseTier: license } : {}),
        ...(input.subscriptionStatus ? { subscriptionStatus: input.subscriptionStatus } : {}),
      },
    })
  } else if (input.email || input.appUserId) {
    const created = await prisma.crmContact.create({
      data: {
        appUserId: input.appUserId ?? null,
        email: input.email ?? null,
        name: input.name ?? null,
        phone: input.phone ?? null,
        licenseTier: license,
        subscriptionStatus: input.subscriptionStatus ?? null,
        lastSeenAt: new Date(),
        tags: input.tags?.length ? input.tags : ["website"],
      },
    })
    contactId = created.id
  }

  const mapped = mapFeedbackType(input.type)
  const subject =
    input.subject?.trim() ||
    (input.path ? `${mapped.type} from ${input.path}` : message.slice(0, 80))
  const source = input.source ?? "feedback"
  const contactName = input.name?.trim() || input.email || "App user"
  const createdAt = new Date()
  const dues = await slaDueDatesFor(createdAt, mapped.priority)

  const ticket = await prisma.crmTicket.create({
    data: {
      contactId,
      subject,
      description: message,
      status: "open",
      priority: mapped.priority,
      type: mapped.type,
      source,
      tags: [...(input.path ? [input.path] : []), ...(input.tags ?? [])],
      appFeedbackId: input.feedbackId ?? null,
      createdAt,
      ...dues,
    },
  })

  await prisma.crmTicketMessage.create({
    data: {
      ticketId: ticket.id,
      authorType: "contact",
      authorId: contactId,
      authorName: contactName,
      body: message,
      isInternal: false,
    },
  })

  if (input.email) {
    void notifyCustomerTicketCreated({
      to: input.email,
      ticketId: ticket.id,
      ticketNumber: ticket.number,
      subject: ticket.subject,
    })
  }
  void notifyAgentsNewTicket({
    ticketId: ticket.id,
    ticketNumber: ticket.number,
    subject: ticket.subject,
    contactEmail: input.email,
    preview: message,
  })

  await runAutomations("ticket_created", ticket.id)
  return ticket
}

export async function addMessage(opts: {
  ticketId: string
  agent: Agent
  body: string
  isInternal: boolean
  afterStatus?: TicketStatus
  assignToAgent?: boolean
}) {
  const body = opts.body.trim()
  if (body.length < 1) throw new Error("Reply cannot be empty")

  await prisma.crmTicketMessage.create({
    data: {
      ticketId: opts.ticketId,
      authorType: "agent",
      authorId: opts.agent.id,
      authorName: opts.agent.name,
      body,
      isInternal: opts.isInternal,
    },
  })

  const current = await prisma.crmTicket.findUnique({ where: { id: opts.ticketId } })
  if (!current) return

  const data: Prisma.CrmTicketUpdateInput = {}

  if (!opts.isInternal) {
    data.firstResponseAt = current.firstResponseAt ?? new Date()
    const nextStatus =
      opts.afterStatus ??
      (current.status === "open" ? "pending" : (current.status as TicketStatus))
    data.status = nextStatus
    data.resolvedAt = nextStatus === "resolved" || nextStatus === "closed" ? new Date() : null
  } else if (opts.afterStatus) {
    data.status = opts.afterStatus
    data.resolvedAt =
      opts.afterStatus === "resolved" || opts.afterStatus === "closed" ? new Date() : null
  }

  if (opts.assignToAgent && !current.assigneeId) {
    data.assignee = { connect: { id: opts.agent.id } }
  }

  await prisma.crmTicket.update({ where: { id: opts.ticketId }, data })

  if (!opts.isInternal) {
    await runAutomations("agent_reply", opts.ticketId)
  }

  if (!opts.isInternal && current.contactId) {
    const contact = await prisma.crmContact.findUnique({
      where: { id: current.contactId },
      select: { email: true },
    })
    if (contact?.email) {
      void notifyCustomerAgentReply({
        to: contact.email,
        ticketId: current.id,
        ticketNumber: current.number,
        subject: current.subject,
        agentName: opts.agent.name,
        body,
      })
    }
  }
}

export async function updateTicketFields(
  ticketId: string,
  fields: {
    status?: TicketStatus
    priority?: TicketPriority
    type?: TicketType
    assigneeId?: string | null
    tags?: string[]
  },
  actor?: Agent,
) {
  const current = await prisma.crmTicket.findUnique({ where: { id: ticketId } })
  const data: Prisma.CrmTicketUpdateInput = {}
  if (fields.status) {
    data.status = fields.status
    data.resolvedAt =
      fields.status === "resolved" || fields.status === "closed" ? new Date() : null
  }
  if (fields.priority) data.priority = fields.priority
  if (fields.type) data.type = fields.type
  if (fields.assigneeId !== undefined) {
    data.assignee = fields.assigneeId
      ? { connect: { id: fields.assigneeId } }
      : { disconnect: true }
  }
  if (fields.tags) {
    const internal = (current?.tags ?? []).filter(isInternalImportTag)
    data.tags = Array.from(
      new Set([...internal, ...fields.tags.filter((tag) => !isInternalImportTag(tag))]),
    )
  }
  await prisma.crmTicket.update({ where: { id: ticketId }, data })

  if (fields.priority && fields.priority !== current?.priority) {
    await applySlaDues(ticketId)
  }
  await runAutomations("ticket_updated", ticketId)

  if (actor && current) {
    const notes: string[] = []
    if (fields.status && fields.status !== current.status) {
      notes.push(`Status → ${fields.status}`)
    }
    if (fields.priority && fields.priority !== current.priority) {
      notes.push(`Priority → ${fields.priority}`)
    }
    if (fields.type && fields.type !== current.type) {
      notes.push(`Type → ${fields.type}`)
    }
    if (fields.assigneeId !== undefined && fields.assigneeId !== current.assigneeId) {
      notes.push(fields.assigneeId ? "Assignee updated" : "Unassigned")
    }
    if (notes.length) {
      await prisma.crmTicketMessage.create({
        data: {
          ticketId,
          authorType: "system",
          authorId: actor.id,
          authorName: "System",
          body: notes.join(" · "),
          isInternal: true,
        },
      })
    }
  }
}

export async function createAgentTicket(opts: {
  agent: Agent
  email: string
  name?: string
  subject: string
  body: string
  type: TicketType
  priority: TicketPriority
}) {
  let contact = await prisma.crmContact.findFirst({
    where: { email: { equals: opts.email, mode: "insensitive" } },
  })
  if (!contact) {
    contact = await prisma.crmContact.create({
      data: {
        email: opts.email,
        name: opts.name || opts.email,
        tags: ["manual"],
      },
    })
  }

  const createdAt = new Date()
  const dues = await slaDueDatesFor(createdAt, opts.priority)

  const ticket = await prisma.crmTicket.create({
    data: {
      contactId: contact.id,
      assigneeId: opts.agent.id,
      subject: opts.subject,
      description: opts.body,
      status: "open",
      priority: opts.priority,
      type: opts.type,
      source: "portal",
      createdAt,
      ...dues,
    },
  })

  await prisma.crmTicketMessage.create({
    data: {
      ticketId: ticket.id,
      authorType: "contact",
      authorId: contact.id,
      authorName: opts.name || opts.email,
      body: opts.body,
      isInternal: false,
    },
  })

  void notifyCustomerTicketCreated({
    to: opts.email,
    ticketId: ticket.id,
    ticketNumber: ticket.number,
    subject: ticket.subject,
  })
  void notifyAgentsNewTicket({
    ticketId: ticket.id,
    ticketNumber: ticket.number,
    subject: ticket.subject,
    contactEmail: opts.email,
    preview: opts.body,
  })

  await runAutomations("ticket_created", ticket.id)
  return ticket.id
}

export async function countOpenTickets() {
  return prisma.crmTicket.count({
    where: { status: { in: ["open", "pending"] } },
  })
}

export async function updateAgentProfile(
  agentId: string,
  fields: {
    name?: string
    role?: AgentRole
    status?: Agent["status"]
  },
) {
  await updateDeskUser(agentId, fields)
}

export async function createCannedResponse(opts: {
  title: string
  shortcut: string | null
  body: string
}) {
  await ensureDb()
  const row = await prisma.crmCannedResponse.create({
    data: {
      title: opts.title,
      shortcut: opts.shortcut,
      body: opts.body,
    },
  })
  return {
    id: row.id,
    title: row.title,
    shortcut: row.shortcut,
    body: row.body,
  }
}

export async function createKbArticle(opts: {
  title: string
  slug: string
  category: string
  body: string
}) {
  await ensureDb()
  const row = await prisma.crmKbArticle.create({
    data: {
      title: opts.title,
      slug: opts.slug,
      category: opts.category,
      body: opts.body,
      published: true,
    },
  })
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    body: row.body,
    published: row.published,
    updatedAt: row.updatedAt,
  }
}
