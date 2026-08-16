import { prisma } from "@/lib/prisma"
import { ingestTicket } from "@/lib/crm/queries"
import type { TicketType } from "@/lib/crm/types"

export type FormLane = "rec" | "jobs" | "support"

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).filter(Boolean).join(", ")
  }
  if (typeof value === "object") return JSON.stringify(value)
  return String(value).trim()
}

function asRecord(data: unknown): Record<string, unknown> {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>
  }
  return {}
}

export function formLane(formName: string): FormLane {
  const name = formName.trim().toLowerCase()
  if (name.includes("job") || name.includes("career") || name.includes("work-with")) return "jobs"
  if (name.includes("rec") || name.includes("event") || name.includes("famdq")) return "rec"
  return "support"
}

export function formRouting(formName: string): {
  lane: FormLane
  tags: string[]
  type: TicketType
  subjectPrefix: string
} {
  const lane = formLane(formName)
  if (lane === "jobs") {
    return {
      lane,
      tags: ["website", "jobs", formName],
      type: "general",
      subjectPrefix: "Job application",
    }
  }
  if (lane === "rec") {
    return {
      lane,
      tags: ["website", "rec", formName],
      type: "question",
      subjectPrefix: "Events",
    }
  }
  return {
    lane,
    tags: ["website", "support", formName],
    type: "question",
    subjectPrefix: "Support",
  }
}

async function assigneeForLane(lane: FormLane) {
  if (lane === "rec" || lane === "jobs") {
    return prisma.user.findFirst({
      where: { role: "admin" },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })
  }
  return (
    (await prisma.user.findFirst({
      where: { role: "agent" },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })) ??
    prisma.user.findFirst({
      where: { role: "admin" },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })
  )
}

function parseLead(input: {
  formName: string
  email?: string | null
  phone?: string | null
  source?: string | null
  data: Record<string, unknown>
}) {
  const first =
    typeof input.data.firstName === "string" ? input.data.firstName.trim() : ""
  const last = typeof input.data.lastName === "string" ? input.data.lastName.trim() : ""
  const name =
    typeof input.data.name === "string"
      ? input.data.name.trim()
      : typeof input.data.fullName === "string"
        ? input.data.fullName.trim()
        : [first, last].filter(Boolean).join(" ")
  const email = (
    input.email?.trim() ||
    (typeof input.data.email === "string" ? input.data.email.trim() : "")
  ).toLowerCase()
  const phone =
    input.phone?.trim() ||
    (typeof input.data.phone === "string" ? input.data.phone.trim() : "") ||
    (typeof input.data.whatsapp === "string" ? input.data.whatsapp.trim() : "")
  const position = typeof input.data.position === "string" ? input.data.position.trim() : ""

  const skip = new Set([
    "name",
    "fullName",
    "firstName",
    "lastName",
    "email",
    "phone",
    "whatsapp",
  ])
  const details = Object.entries(input.data)
    .map(([key, value]) => {
      if (skip.has(key)) return ""
      const text = stringifyValue(value)
      return text ? `${key}: ${text}` : ""
    })
    .filter(Boolean)

  const body = [
    `Form: ${input.formName}`,
    input.source && `Page source: ${input.source}`,
    phone && `Phone: ${phone}`,
    ...details,
  ]
    .filter(Boolean)
    .join("\n")

  return { name, email, phone, body, position }
}

export async function upsertCrmFromForm(input: {
  formName: string
  email?: string
  phone?: string
  source?: string
  data: Record<string, unknown>
}) {
  const { name, email, phone, body, position } = parseLead(input)
  if (!email && !body) return

  const routing = formRouting(input.formName)
  const assignee = await assigneeForLane(routing.lane)
  const subject = position
    ? `${routing.subjectPrefix}: ${position}`
    : `${routing.subjectPrefix}: ${input.formName}`

  await ingestTicket({
    email: email || null,
    name: name || null,
    phone: phone || null,
    message: body || `${input.formName} enquiry`,
    subject,
    source: "portal",
    type: routing.type,
    tags: routing.tags,
    assigneeId: assignee?.id ?? null,
  })
}

function extraTagsForResponse(formName: string, source?: string | null) {
  return Array.from(
    new Set(
      [...formRouting(formName).tags, "form-response", source].filter(
        (tag): tag is string => Boolean(tag && tag.trim()),
      ),
    ),
  )
}

export async function importContactsFromFormResponses() {
  const responses = await prisma.formResponse.findMany({
    orderBy: { createdAt: "asc" },
  })

  let created = 0
  let updated = 0
  let skipped = 0

  for (const row of responses) {
    const lead = parseLead({
      formName: row.formName,
      email: row.email,
      phone: row.phone,
      source: row.source,
      data: asRecord(row.data),
    })
    if (!lead.email && !lead.phone) {
      skipped += 1
      continue
    }

    const existing = lead.email
      ? await prisma.crmContact.findFirst({
          where: { email: { equals: lead.email, mode: "insensitive" } },
        })
      : await prisma.crmContact.findFirst({
          where: { phone: lead.phone },
        })

    const extraTags = extraTagsForResponse(row.formName, row.source)

    if (existing) {
      const tags = Array.from(new Set([...(existing.tags ?? []), ...extraTags]))
      await prisma.crmContact.update({
        where: { id: existing.id },
        data: {
          name: lead.name || existing.name,
          email: lead.email || existing.email,
          phone: lead.phone || existing.phone,
          tags,
          lastSeenAt:
            existing.lastSeenAt && existing.lastSeenAt > row.createdAt
              ? existing.lastSeenAt
              : row.createdAt,
        },
      })
      updated += 1
      continue
    }

    await prisma.crmContact.create({
      data: {
        email: lead.email || null,
        name: lead.name || lead.email || lead.phone || "Form contact",
        phone: lead.phone || null,
        tags: extraTags,
        lastSeenAt: row.createdAt,
        createdAt: row.createdAt,
      },
    })
    created += 1
  }

  return { created, updated, skipped, total: responses.length }
}

export async function listFormResponsesForContact(opts: {
  email?: string | null
  phone?: string | null
}) {
  const or: Array<{ email?: { equals: string; mode: "insensitive" }; phone?: string }> = []
  if (opts.email?.trim()) {
    or.push({ email: { equals: opts.email.trim(), mode: "insensitive" } })
  }
  if (opts.phone?.trim()) {
    or.push({ phone: opts.phone.trim() })
  }
  if (!or.length) return []

  const rows = await prisma.formResponse.findMany({
    where: { OR: or },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return rows.map((row) => {
    const data = asRecord(row.data)
    const fields = Object.entries(data)
      .map(([key, value]) => ({ key, value: stringifyValue(value) }))
      .filter((field) => field.value)
    return {
      id: row.id,
      formName: row.formName,
      source: row.source,
      createdAt: row.createdAt,
      fields,
    }
  })
}

export async function mergeDuplicateContactsByEmail() {
  const contacts = await prisma.crmContact.findMany({
    where: { email: { not: null } },
    orderBy: { createdAt: "asc" },
  })
  const groups = new Map<string, typeof contacts>()
  for (const contact of contacts) {
    const key = contact.email?.trim().toLowerCase()
    if (!key) continue
    const list = groups.get(key) ?? []
    list.push(contact)
    groups.set(key, list)
  }

  let merged = 0
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const [keep, ...dupes] = group
    const tags = new Set(keep.tags ?? [])
    let name = keep.name
    let phone = keep.phone
    let appUserId = keep.appUserId
    let lastSeenAt = keep.lastSeenAt

    for (const dupe of dupes) {
      for (const tag of dupe.tags ?? []) tags.add(tag)
      if (!name && dupe.name) name = dupe.name
      if (!phone && dupe.phone) phone = dupe.phone
      if (!appUserId && dupe.appUserId) appUserId = dupe.appUserId
      if (dupe.lastSeenAt && (!lastSeenAt || dupe.lastSeenAt > lastSeenAt)) {
        lastSeenAt = dupe.lastSeenAt
      }
      await prisma.crmTicket.updateMany({
        where: { contactId: dupe.id },
        data: { contactId: keep.id },
      })
      await prisma.crmContact.delete({ where: { id: dupe.id } })
      merged += 1
    }

    await prisma.crmContact.update({
      where: { id: keep.id },
      data: {
        name,
        phone,
        appUserId,
        tags: Array.from(tags),
        lastSeenAt,
      },
    })
  }

  return { merged }
}
