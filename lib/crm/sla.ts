import { prisma } from "@/lib/prisma"
import type { SlaHoursByPriority, SlaPolicy, TicketPriority } from "@/lib/crm/types"
import { SLA_HOURS, SLA_RESOLVE_HOURS } from "@/lib/crm/types"

const PRIORITIES: TicketPriority[] = ["urgent", "high", "medium", "low"]

export function parseSlaHours(
  raw: string | null | undefined,
  fallback: SlaHoursByPriority,
): SlaHoursByPriority {
  const hours = { ...fallback }
  if (!raw?.trim()) return hours
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    for (const priority of PRIORITIES) {
      const value = Number(parsed[priority])
      if (Number.isFinite(value) && value > 0) hours[priority] = value
    }
  } catch {
    // keep fallback
  }
  return hours
}

export function stringifySlaHours(hours: SlaHoursByPriority) {
  return JSON.stringify(hours)
}

let cachedPolicy: SlaPolicy | null = null

export function clearSlaPolicyCache() {
  cachedPolicy = null
}

export async function getSlaPolicy(): Promise<SlaPolicy> {
  if (cachedPolicy) return cachedPolicy
  const row = await prisma.crmSlaPolicy.findFirst()
  cachedPolicy = {
    id: row?.id ?? "default",
    name: row?.name ?? "Default",
    firstResponseHours: parseSlaHours(row?.firstResponseHours, SLA_HOURS),
    resolveHours: parseSlaHours(row?.resolveHours, SLA_RESOLVE_HOURS),
  }
  return cachedPolicy
}

export function slaDueDates(
  createdAt: Date,
  priority: TicketPriority,
  policy: Pick<SlaPolicy, "firstResponseHours" | "resolveHours">,
) {
  const firstHours = policy.firstResponseHours[priority] ?? SLA_HOURS[priority]
  const resolveHours = policy.resolveHours[priority] ?? SLA_RESOLVE_HOURS[priority]
  return {
    firstResponseDueAt: new Date(createdAt.getTime() + firstHours * 60 * 60 * 1000),
    resolutionDueAt: new Date(createdAt.getTime() + resolveHours * 60 * 60 * 1000),
  }
}

export async function slaDueDatesFor(createdAt: Date, priority: TicketPriority) {
  return slaDueDates(createdAt, priority, await getSlaPolicy())
}

export async function applySlaDues(ticketId: string) {
  const current = await prisma.crmTicket.findUnique({
    where: { id: ticketId },
    select: { createdAt: true, priority: true },
  })
  if (!current) return
  const dues = await slaDueDatesFor(current.createdAt, current.priority as TicketPriority)
  await prisma.crmTicket.update({ where: { id: ticketId }, data: dues })
}
