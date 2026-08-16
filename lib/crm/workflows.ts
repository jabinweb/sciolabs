import { asc, eq } from "drizzle-orm";
import { db, ensureDb } from "@/lib/crm/db";
import { automationRules, slaPolicies } from "@/db/schema";
import { parseSlaHours, stringifySlaHours, clearSlaPolicyCache } from "@/lib/crm/sla";
import type {
  AutomationAction,
  AutomationCondition,
  AutomationRule,
  AutomationTrigger,
  SlaHoursByPriority,
  SlaPolicy,
} from "@/lib/crm/types";
import { SLA_HOURS, SLA_RESOLVE_HOURS } from "@/lib/crm/types";

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function toRule(row: typeof automationRules.$inferSelect): AutomationRule {
  const trigger = row.trigger as AutomationTrigger;
  return {
    id: row.id,
    name: row.name,
    enabled: row.enabled,
    trigger:
      trigger === "ticket_updated" ||
      trigger === "customer_reply" ||
      trigger === "agent_reply"
        ? trigger
        : "ticket_created",
    conditions: parseJsonArray<AutomationCondition>(row.conditions),
    actions: parseJsonArray<AutomationAction>(row.actions),
    sortOrder: row.sortOrder,
  };
}

export async function getWorkflowSlaPolicy(): Promise<SlaPolicy> {
  await ensureDb();
  const [row] = await db.select().from(slaPolicies).limit(1);
  return {
    id: row?.id ?? "default",
    name: row?.name ?? "Default",
    firstResponseHours: parseSlaHours(row?.firstResponseHours, SLA_HOURS),
    resolveHours: parseSlaHours(row?.resolveHours, SLA_RESOLVE_HOURS),
  };
}

export async function saveSlaPolicy(opts: {
  firstResponseHours: SlaHoursByPriority;
  resolveHours: SlaHoursByPriority;
}) {
  await ensureDb();
  const [existing] = await db.select({ id: slaPolicies.id }).from(slaPolicies).limit(1);
  const values = {
    name: "Default",
    isDefault: true,
    firstResponseHours: stringifySlaHours(opts.firstResponseHours),
    resolveHours: stringifySlaHours(opts.resolveHours),
    updatedAt: new Date(),
  };
  if (existing) {
    await db.update(slaPolicies).set(values).where(eq(slaPolicies.id, existing.id));
    clearSlaPolicyCache();
    return;
  }
  await db.insert(slaPolicies).values(values);
  clearSlaPolicyCache();
}

export async function listAutomationRules(): Promise<AutomationRule[]> {
  await ensureDb();
  const rows = await db
    .select()
    .from(automationRules)
    .orderBy(asc(automationRules.sortOrder), asc(automationRules.createdAt));
  return rows.map(toRule);
}

export async function createAutomationRule(opts: {
  name: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled?: boolean;
}) {
  await ensureDb();
  await db.insert(automationRules).values({
    name: opts.name,
    trigger: opts.trigger,
    conditions: JSON.stringify(opts.conditions),
    actions: JSON.stringify(opts.actions),
    enabled: opts.enabled ?? true,
    sortOrder: Date.now() % 1_000_000,
  });
}

export async function updateAutomationRule(
  id: string,
  opts: {
    name: string;
    trigger: AutomationTrigger;
    conditions: AutomationCondition[];
    actions: AutomationAction[];
    enabled: boolean;
  },
) {
  await ensureDb();
  await db
    .update(automationRules)
    .set({
      name: opts.name,
      trigger: opts.trigger,
      conditions: JSON.stringify(opts.conditions),
      actions: JSON.stringify(opts.actions),
      enabled: opts.enabled,
      updatedAt: new Date(),
    })
    .where(eq(automationRules.id, id));
}

export async function deleteAutomationRule(id: string) {
  await ensureDb();
  await db.delete(automationRules).where(eq(automationRules.id, id));
}

export async function setAutomationEnabled(id: string, enabled: boolean) {
  await ensureDb();
  await db
    .update(automationRules)
    .set({ enabled, updatedAt: new Date() })
    .where(eq(automationRules.id, id));
}
