import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ensureDb } from "@/lib/crm/db"
import {
  decodePortalSession,
  encodePortalSession,
  PORTAL_COOKIE,
} from "@/lib/crm/portal-session"
import { sessionCookieSecure } from "@/lib/crm/cookie-secure"
import type { TicketPriority, TicketStatus, TicketType } from "@/lib/crm/types"
import { slaDueDatesFor } from "@/lib/crm/sla"
import { runAutomations } from "@/lib/crm/automations"
import {
  notifyAgentsCustomerReply,
  notifyAgentsNewTicket,
  notifyCustomerTicketCreated,
} from "@/lib/crm/email"

export async function getPortalEmail(): Promise<string | null> {
  if (process.env.NEXT_PHASE === "phase-production-build") return null
  await ensureDb()
  const token = (await cookies()).get(PORTAL_COOKIE)?.value
  return decodePortalSession(token)
}

export async function requirePortalEmail(): Promise<string> {
  const email = await getPortalEmail()
  if (!email) redirect("/support/signin")
  return email
}

export async function setPortalCookie(email: string) {
  ;(await cookies()).set(PORTAL_COOKIE, encodePortalSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: await sessionCookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearPortalCookie() {
  ;(await cookies()).delete(PORTAL_COOKIE)
}

export async function findOrCreatePortalContact(opts: { email: string; name?: string }) {
  await ensureDb()
  const email = opts.email.trim().toLowerCase()
  const existing = await prisma.crmContact.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  })
  if (existing) {
    await prisma.crmContact.update({
      where: { id: existing.id },
      data: {
        lastSeenAt: new Date(),
        ...(opts.name?.trim() && opts.name.trim() !== existing.name
          ? { name: opts.name.trim() }
          : {}),
      },
    })
    return existing.id
  }
  const created = await prisma.crmContact.create({
    data: {
      email,
      name: opts.name?.trim() || email,
      tags: ["portal"],
      lastSeenAt: new Date(),
    },
  })
  return created.id
}

export async function createPortalTicket(opts: {
  email: string
  name?: string
  subject: string
  body: string
  type: TicketType
}) {
  const contactId = await findOrCreatePortalContact({
    email: opts.email,
    name: opts.name,
  })
  const createdAt = new Date()
  const dues = await slaDueDatesFor(createdAt, "medium")
  const ticket = await prisma.crmTicket.create({
    data: {
      contactId,
      subject: opts.subject.trim(),
      description: opts.body.trim(),
      status: "open",
      priority: "medium" satisfies TicketPriority,
      type: opts.type,
      source: "portal",
      tags: ["portal"],
      createdAt,
      ...dues,
    },
  })

  await prisma.crmTicketMessage.create({
    data: {
      ticketId: ticket.id,
      authorType: "contact",
      authorId: contactId,
      authorName: opts.name?.trim() || opts.email,
      body: opts.body.trim(),
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
  return ticket
}

export async function listPortalTickets(email: string) {
  await ensureDb()
  const rows = await prisma.crmTicket.findMany({
    where: { contact: { email: { equals: email, mode: "insensitive" } } },
    include: { contact: true },
    orderBy: { updatedAt: "desc" },
    take: 100,
  })

  return rows.map((row) => ({
    id: row.id,
    number: row.number,
    subject: row.subject,
    status: row.status as TicketStatus,
    priority: row.priority as TicketPriority,
    type: row.type as TicketType,
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
    contactName: row.contact?.name ?? null,
    contactEmail: row.contact?.email ?? null,
  }))
}

export async function getPortalTicket(email: string, ticketId: string) {
  await ensureDb()
  const row = await prisma.crmTicket.findFirst({
    where: {
      id: ticketId,
      contact: { email: { equals: email, mode: "insensitive" } },
    },
    include: { contact: true },
  })
  if (!row?.contact) return null

  const messages = await prisma.crmTicketMessage.findMany({
    where: { ticketId, isInternal: false },
    orderBy: { createdAt: "asc" },
  })

  return {
    ticket: {
      id: row.id,
      number: row.number,
      subject: row.subject,
      description: row.description,
      status: row.status as TicketStatus,
      priority: row.priority as TicketPriority,
      type: row.type as TicketType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      contactName: row.contact.name,
      contactEmail: row.contact.email,
      contactId: row.contact.id,
      csatScore: row.csatScore,
      csatComment: row.csatComment,
    },
    messages: messages.map((m) => ({
      id: m.id,
      authorType: m.authorType,
      authorName: m.authorName,
      body: m.body,
      createdAt: m.createdAt,
    })),
  }
}

export async function addPortalReply(opts: { email: string; ticketId: string; body: string }) {
  const detail = await getPortalTicket(opts.email, opts.ticketId)
  if (!detail) throw new Error("Ticket not found")
  if (detail.ticket.status === "closed") {
    throw new Error("This ticket is closed")
  }

  await prisma.crmTicketMessage.create({
    data: {
      ticketId: opts.ticketId,
      authorType: "contact",
      authorId: detail.ticket.contactId,
      authorName: detail.ticket.contactName || opts.email,
      body: opts.body.trim(),
      isInternal: false,
    },
  })

  await prisma.crmTicket.update({
    where: { id: opts.ticketId },
    data: { status: detail.ticket.status },
  })

  await runAutomations("customer_reply", opts.ticketId)

  void notifyAgentsCustomerReply({
    ticketId: opts.ticketId,
    ticketNumber: detail.ticket.number,
    subject: detail.ticket.subject,
    contactEmail: opts.email,
    body: opts.body,
  })
}

export async function setPortalCsat(opts: {
  email: string
  ticketId: string
  score: number
  comment?: string
}) {
  const detail = await getPortalTicket(opts.email, opts.ticketId)
  if (!detail) throw new Error("Ticket not found")
  if (detail.ticket.status !== "resolved" && detail.ticket.status !== "closed") {
    throw new Error("Rate only after the ticket is resolved")
  }
  const score = Math.min(5, Math.max(1, Math.round(opts.score)))
  await prisma.crmTicket.update({
    where: { id: opts.ticketId },
    data: {
      csatScore: score,
      csatComment: opts.comment?.trim() || null,
    },
  })
}

export async function listPublishedArticles(query?: string) {
  await ensureDb()
  const { listKbArticles } = await import("@/lib/crm/queries")
  const articles = await listKbArticles()
  const published = articles.filter((a) => a.published)
  const q = query?.trim().toLowerCase()
  if (!q) return published
  return published.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q),
  )
}

export async function getPublishedArticle(slug: string) {
  const articles = await listPublishedArticles()
  return articles.find((a) => a.slug === slug) ?? null
}
