import type { Ticket, TicketPriority, TicketStatus, TicketType } from "./types";
import { SLA_HOURS, SLA_RESOLVE_HOURS } from "./types";

export function ticketRef(number: number) {
  return `#${number}`;
}

/** Import identity tags — keep in the DB, hide from agents. */
export function isInternalImportTag(tag: string) {
  return tag === "freshdesk" || tag.startsWith("freshdesk-ticket:") || /^freshdesk:\d+$/.test(tag);
}

export function visibleTags(tags: string[]) {
  return tags.filter((tag) => !isInternalImportTag(tag));
}

export function isFreshdeskImported(tags: string[]) {
  return tags.some(isInternalImportTag);
}

export function relativeTime(date: Date) {
  const delta = Date.now() - date.getTime();
  const minutes = Math.round(delta / 60000);
  if (Math.abs(minutes) < 1) return "just now";
  if (Math.abs(minutes) < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function slaDeadline(createdAt: Date, priority: TicketPriority) {
  return new Date(createdAt.getTime() + SLA_HOURS[priority] * 60 * 60 * 1000);
}

function remainingLabel(due: Date, breached: string) {
  const remaining = due.getTime() - Date.now();
  if (remaining < 0) return breached;
  const hours = remaining / 3600000;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m left`;
  return `${Math.round(hours)}h left`;
}

export function slaLabel(
  createdAt: Date,
  priority: TicketPriority,
  firstResponseAt: Date | null,
  firstResponseDueAt?: Date | null,
) {
  if (firstResponseAt) return "First reply sent";
  const due = firstResponseDueAt ?? slaDeadline(createdAt, priority);
  return remainingLabel(due, "SLA breached");
}

export function ticketSlaLabel(ticket: Pick<
  Ticket,
  | "createdAt"
  | "priority"
  | "status"
  | "firstResponseAt"
  | "resolvedAt"
  | "firstResponseDueAt"
  | "resolutionDueAt"
>) {
  if (ticket.status === "resolved" || ticket.status === "closed") {
    if (
      ticket.resolutionDueAt &&
      ticket.resolvedAt &&
      ticket.resolvedAt.getTime() > ticket.resolutionDueAt.getTime()
    ) {
      return "Resolved after SLA";
    }
    return ticket.status === "closed" ? "Closed" : "Resolved";
  }
  if (!ticket.firstResponseAt) {
    const due =
      ticket.firstResponseDueAt ?? slaDeadline(ticket.createdAt, ticket.priority);
    return remainingLabel(due, "First-reply SLA breached");
  }
  const due =
    ticket.resolutionDueAt ??
    new Date(
      ticket.createdAt.getTime() + SLA_RESOLVE_HOURS[ticket.priority] * 60 * 60 * 1000,
    );
  return remainingLabel(due, "Resolution SLA breached");
}

export function statusLabel(status: TicketStatus) {
  return status[0].toUpperCase() + status.slice(1);
}

export function typeLabel(type: TicketType) {
  return type[0].toUpperCase() + type.slice(1);
}

export function initials(name: string | null | undefined) {
  const parts = (name ?? "?").trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
