"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/crm/auth";
import type {
  AutomationActionType,
  AutomationConditionField,
  AutomationConditionOp,
  AutomationTrigger,
  SlaHoursByPriority,
  TicketPriority,
} from "@/lib/crm/types";
import { SLA_HOURS, SLA_RESOLVE_HOURS } from "@/lib/crm/types";
import {
  createAutomationRule,
  deleteAutomationRule,
  saveSlaPolicy,
  setAutomationEnabled,
  updateAutomationRule,
} from "@/lib/crm/workflows";

async function requireAdmin() {
  const agent = await requireAgent();
  if (agent.role !== "admin") {
    redirect("/crm/settings?error=admin");
  }
  return agent;
}

function revalidateWorkflows() {
  revalidatePath("/crm/settings/workflows");
  revalidatePath("/crm/tickets");
  revalidatePath("/crm/tickets/board");
  revalidatePath("/crm/dashboard");
}

function hoursFromForm(
  formData: FormData,
  prefix: string,
  fallback: SlaHoursByPriority,
) {
  const hours = { ...fallback };
  for (const priority of Object.keys(fallback) as TicketPriority[]) {
    const value = Number(formData.get(`${prefix}_${priority}`));
    if (Number.isFinite(value) && value > 0) hours[priority] = value;
  }
  return hours;
}

export async function saveSlaPolicyAction(formData: FormData) {
  await requireAdmin();
  await saveSlaPolicy({
    firstResponseHours: hoursFromForm(formData, "first", SLA_HOURS),
    resolveHours: hoursFromForm(formData, "resolve", SLA_RESOLVE_HOURS),
  });
  revalidateWorkflows();
  redirect("/crm/settings/workflows?ok=sla");
}

const TRIGGERS: AutomationTrigger[] = [
  "ticket_created",
  "ticket_updated",
  "customer_reply",
  "agent_reply",
];
const FIELDS: AutomationConditionField[] = [
  "status",
  "priority",
  "type",
  "source",
  "tag",
  "subject",
  "assignee",
];
const OPS: AutomationConditionOp[] = ["eq", "neq", "contains", "is_empty", "is_set"];
const ACTIONS: AutomationActionType[] = [
  "set_status",
  "set_priority",
  "set_type",
  "set_assignee",
  "add_tag",
  "remove_tag",
];

function parseRuleForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const triggerRaw = String(formData.get("trigger") ?? "ticket_created");
  const trigger: AutomationTrigger = TRIGGERS.includes(triggerRaw as AutomationTrigger)
    ? (triggerRaw as AutomationTrigger)
    : "ticket_created";
  const fieldRaw = String(formData.get("conditionField") ?? "status");
  const field: AutomationConditionField = FIELDS.includes(fieldRaw as AutomationConditionField)
    ? (fieldRaw as AutomationConditionField)
    : "status";
  const opRaw = String(formData.get("conditionOp") ?? "eq");
  const op: AutomationConditionOp = OPS.includes(opRaw as AutomationConditionOp)
    ? (opRaw as AutomationConditionOp)
    : "eq";
  const conditionValue = String(formData.get("conditionValue") ?? "").trim();
  const actionRaw = String(formData.get("actionType") ?? "add_tag");
  const actionType: AutomationActionType = ACTIONS.includes(actionRaw as AutomationActionType)
    ? (actionRaw as AutomationActionType)
    : "add_tag";
  const actionValue = String(formData.get("actionValue") ?? "").trim();
  const enabled = String(formData.get("enabled") ?? "") !== "0";

  const conditions =
    op === "is_empty" || op === "is_set" || conditionValue
      ? [{ field, op, value: conditionValue }]
      : [];
  const actions = actionType ? [{ type: actionType, value: actionValue }] : [];

  return { name, trigger, conditions, actions, enabled };
}

export async function createAutomationRuleAction(formData: FormData) {
  await requireAdmin();
  const parsed = parseRuleForm(formData);
  if (!parsed.name || !parsed.actions.length) {
    redirect("/crm/settings/workflows?error=rule");
  }
  await createAutomationRule(parsed);
  revalidateWorkflows();
  redirect("/crm/settings/workflows?ok=rule");
}

export async function updateAutomationRuleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = parseRuleForm(formData);
  if (!id || !parsed.name || !parsed.actions.length) {
    redirect("/crm/settings/workflows?error=rule");
  }
  await updateAutomationRule(id, parsed);
  revalidateWorkflows();
  redirect("/crm/settings/workflows?ok=updated");
}

export async function toggleAutomationRuleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const enabled = String(formData.get("enabled") ?? "") === "1";
  if (!id) redirect("/crm/settings/workflows?error=rule");
  await setAutomationEnabled(id, enabled);
  revalidateWorkflows();
}

export async function deleteAutomationRuleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/crm/settings/workflows?error=rule");
  await deleteAutomationRule(id);
  revalidateWorkflows();
  redirect("/crm/settings/workflows?ok=deleted");
}
