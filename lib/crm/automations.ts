import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/crm/db";
import { automationRules, tickets } from "@/db/schema";
import { applySlaDues } from "@/lib/crm/sla";
import { isInternalImportTag } from "@/lib/crm/format";
import type {
  AutomationAction,
  AutomationCondition,
  AutomationTrigger,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "@/lib/crm/types";

type TicketSnapshot = {
  id: string;
  status: string;
  priority: string;
  type: string;
  source: string;
  tags: string[];
  subject: string;
  assigneeId: string | null;
};

const TRIGGERS: AutomationTrigger[] = [
  "ticket_created",
  "ticket_updated",
  "customer_reply",
  "agent_reply",
];

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function matchesCondition(ticket: TicketSnapshot, condition: AutomationCondition) {
  const value = (condition.value ?? "").trim().toLowerCase();
  const field = condition.field;
  const op = condition.op ?? "eq";

  const scalar =
    field === "status"
      ? ticket.status
      : field === "priority"
        ? ticket.priority
        : field === "type"
          ? ticket.type
          : field === "source"
            ? ticket.source
            : field === "subject"
              ? ticket.subject
              : field === "assignee"
                ? ticket.assigneeId ?? ""
                : "";

  if (field === "tag") {
    const tags = ticket.tags.map((tag) => tag.toLowerCase());
    if (op === "is_empty") return tags.filter((tag) => !isInternalImportTag(tag)).length === 0;
    if (op === "is_set") return tags.filter((tag) => !isInternalImportTag(tag)).length > 0;
    if (op === "neq") return !tags.includes(value);
    return tags.includes(value);
  }

  const haystack = scalar.toLowerCase();
  if (op === "is_empty") return haystack.length === 0;
  if (op === "is_set") return haystack.length > 0;
  if (op === "contains") return haystack.includes(value);
  if (op === "neq") return haystack !== value;
  return haystack === value;
}

function matchesRule(ticket: TicketSnapshot, conditions: AutomationCondition[]) {
  if (!conditions.length) return true;
  return conditions.every((condition) => matchesCondition(ticket, condition));
}

async function applyActions(ticket: TicketSnapshot, actions: AutomationAction[]) {
  if (!actions.length) return;
  const patch: Partial<typeof tickets.$inferInsert> = { updatedAt: new Date() };
  let tags = [...ticket.tags];
  let priorityChanged = false;

  for (const action of actions) {
    const value = (action.value ?? "").trim();
    if (action.type === "set_status" && ["open", "pending", "resolved", "closed"].includes(value)) {
      patch.status = value as TicketStatus;
      patch.resolvedAt =
        value === "resolved" || value === "closed" ? new Date() : null;
    } else if (action.type === "set_priority" && ["low", "medium", "high", "urgent"].includes(value)) {
      patch.priority = value as TicketPriority;
      priorityChanged = true;
    } else if (
      action.type === "set_type" &&
      ["question", "bug", "feature", "billing", "general"].includes(value)
    ) {
      patch.type = value as TicketType;
    } else if (action.type === "set_assignee") {
      patch.assigneeId = value || null;
    } else if (action.type === "add_tag" && value) {
      tags = Array.from(new Set([...tags, value]));
      patch.tags = tags;
    } else if (action.type === "remove_tag" && value) {
      tags = tags.filter((tag) => tag.toLowerCase() !== value.toLowerCase());
      patch.tags = tags;
    }
  }

  const keys = Object.keys(patch).filter((key) => key !== "updatedAt");
  if (!keys.length) return;

  await db.update(tickets).set(patch).where(eq(tickets.id, ticket.id));
  if (priorityChanged) await applySlaDues(ticket.id);
}

export async function runAutomations(trigger: AutomationTrigger, ticketId: string) {
  if (!TRIGGERS.includes(trigger)) return;
  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, ticketId),
  });
  if (!ticket) return;

  const snapshot: TicketSnapshot = {
    id: ticket.id,
    status: ticket.status,
    priority: ticket.priority,
    type: ticket.type,
    source: ticket.source,
    tags: ticket.tags ?? [],
    subject: ticket.subject,
    assigneeId: ticket.assigneeId,
  };

  const rules = await db
    .select()
    .from(automationRules)
    .where(eq(automationRules.trigger, trigger))
    .orderBy(asc(automationRules.sortOrder), asc(automationRules.createdAt));

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const conditions = parseJsonArray<AutomationCondition>(rule.conditions);
    if (!matchesRule(snapshot, conditions)) continue;
    const actions = parseJsonArray<AutomationAction>(rule.actions);
    await applyActions(snapshot, actions);
    const next = await db.query.tickets.findFirst({
      where: eq(tickets.id, ticketId),
    });
    if (next) {
      snapshot.status = next.status;
      snapshot.priority = next.priority;
      snapshot.type = next.type;
      snapshot.source = next.source;
      snapshot.tags = next.tags ?? [];
      snapshot.subject = next.subject;
      snapshot.assigneeId = next.assigneeId;
    }
  }
}
