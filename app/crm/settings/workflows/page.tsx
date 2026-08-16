import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createAutomationRuleAction,
  deleteAutomationRuleAction,
  saveSlaPolicyAction,
  toggleAutomationRuleAction,
  updateAutomationRuleAction,
} from "@/actions/workflows";
import { requireAgent } from "@/lib/crm/auth";
import { listAgents } from "@/lib/crm/queries";
import { getWorkflowSlaPolicy, listAutomationRules } from "@/lib/crm/workflows";
import type { AutomationRule, TicketPriority } from "@/lib/crm/types";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import { FormSelect } from "@/components/crm/form-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";

export const dynamic = "force-dynamic";

const PRIORITIES: TicketPriority[] = ["urgent", "high", "medium", "low"];

const TRIGGER_OPTIONS = [
  { value: "ticket_created", label: "Ticket created" },
  { value: "ticket_updated", label: "Ticket updated" },
  { value: "customer_reply", label: "Customer reply" },
  { value: "agent_reply", label: "Agent reply" },
];

const FIELD_OPTIONS = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "type", label: "Type" },
  { value: "source", label: "Source" },
  { value: "tag", label: "Tag" },
  { value: "subject", label: "Subject" },
  { value: "assignee", label: "Assignee" },
];

const OP_OPTIONS = [
  { value: "eq", label: "is" },
  { value: "neq", label: "is not" },
  { value: "contains", label: "contains" },
  { value: "is_empty", label: "is empty" },
  { value: "is_set", label: "is set" },
];

const ACTION_OPTIONS = [
  { value: "set_status", label: "Set status" },
  { value: "set_priority", label: "Set priority" },
  { value: "set_type", label: "Set type" },
  { value: "set_assignee", label: "Set assignee" },
  { value: "add_tag", label: "Add tag" },
  { value: "remove_tag", label: "Remove tag" },
];

function notice(ok?: string | string[], error?: string | string[]) {
  const okKey = Array.isArray(ok) ? ok[0] : ok;
  const errKey = Array.isArray(error) ? error[0] : error;
  if (okKey === "sla") return { tone: "ok" as const, text: "SLA hours saved. New tickets and priority changes use the new targets." };
  if (okKey === "rule") return { tone: "ok" as const, text: "Automation rule added." };
  if (okKey === "updated") return { tone: "ok" as const, text: "Automation rule updated." };
  if (okKey === "deleted") return { tone: "ok" as const, text: "Automation rule deleted." };
  if (errKey === "admin") return { tone: "err" as const, text: "Only admins can change workflows." };
  if (errKey === "rule") return { tone: "err" as const, text: "Name and an action are required." };
  return null;
}

export default async function WorkflowsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const agent = await requireAgent();
  if (agent.role !== "admin") redirect("/crm/settings?error=admin");
  const params = await searchParams;
  const [policy, rules, agents] = await Promise.all([
    getWorkflowSlaPolicy(),
    listAutomationRules(),
    listAgents(),
  ]);
  const flash = notice(params.ok, params.error);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/crm/settings" />}>Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workflows</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Workflows</h1>
        <p className="text-sm text-muted-foreground">
          First-response and resolution SLAs, plus automation rules that run when tickets are created, updated, or replied to.
        </p>
      </div>

      {flash ? (
        <p
          className={
            flash.tone === "ok"
              ? "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
          }
        >
          {flash.text}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>SLA hours</CardTitle>
          <CardDescription>
            Targets are measured from ticket creation. Changing priority recalculates due times. Existing tickets keep their current due dates until priority changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSlaPolicyAction} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Priority</th>
                    <th className="pb-2 font-medium">First reply (hours)</th>
                    <th className="pb-2 font-medium">Resolve (hours)</th>
                  </tr>
                </thead>
                <tbody>
                  {PRIORITIES.map((priority) => (
                    <tr key={priority}>
                      <td className="py-1.5 capitalize">{priority}</td>
                      <td className="py-1.5 pr-3">
                        <Input
                          name={`first_${priority}`}
                          type="number"
                          min={0.25}
                          step={0.25}
                          defaultValue={policy.firstResponseHours[priority]}
                          required
                        />
                      </td>
                      <td className="py-1.5">
                        <Input
                          name={`resolve_${priority}`}
                          type="number"
                          min={0.25}
                          step={0.25}
                          defaultValue={policy.resolveHours[priority]}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="submit">Save SLA</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add automation</CardTitle>
          <CardDescription>
            If the condition matches, the action runs. Leave the condition value blank and use “is empty” / “is set”, or skip the value for “always”.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RuleForm agents={agents} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} agents={agents} />
        ))}
        {rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">No automation rules yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function RuleForm({
  rule,
  agents,
}: {
  rule?: AutomationRule;
  agents: { id: string; name: string }[];
}) {
  const condition = rule?.conditions[0];
  const action = rule?.actions[0];
  const actionFn = rule ? updateAutomationRuleAction : createAutomationRuleAction;
  return (
    <form action={actionFn} className="grid gap-3 sm:grid-cols-2">
      {rule ? <input type="hidden" name="id" value={rule.id} /> : null}
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={rule ? `name-${rule.id}` : "name"}>Name</Label>
        <Input
          id={rule ? `name-${rule.id}` : "name"}
          name="name"
          defaultValue={rule?.name ?? ""}
          placeholder="Reopen on customer reply"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>When</Label>
        <FormSelect
          name="trigger"
          defaultValue={rule?.trigger ?? "ticket_created"}
          options={TRIGGER_OPTIONS}
        />
      </div>
      <div className="space-y-1.5">
        <Label>If field</Label>
        <FormSelect
          name="conditionField"
          defaultValue={condition?.field ?? "status"}
          options={FIELD_OPTIONS}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Operator</Label>
        <FormSelect
          name="conditionOp"
          defaultValue={condition?.op ?? "eq"}
          options={OP_OPTIONS}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Condition value</Label>
        <Input
          name="conditionValue"
          defaultValue={condition?.value ?? ""}
          placeholder="pending, billing, …"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Then</Label>
        <FormSelect
          name="actionType"
          defaultValue={action?.type ?? "add_tag"}
          options={ACTION_OPTIONS}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Action value</Label>
        <Input
          name="actionValue"
          defaultValue={action?.value ?? ""}
          placeholder="open, urgent, billing, or an agent id"
          list={rule ? `agents-${rule.id}` : "agents-new"}
        />
        <datalist id={rule ? `agents-${rule.id}` : "agents-new"}>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </datalist>
      </div>
      {rule ? <input type="hidden" name="enabled" value={rule.enabled ? "1" : "0"} /> : null}
      <div className="sm:col-span-2">
        <Button type="submit" variant={rule ? "outline" : "default"}>
          {rule ? "Save rule" : "Add rule"}
        </Button>
      </div>
    </form>
  );
}

function RuleCard({
  rule,
  agents,
}: {
  rule: AutomationRule;
  agents: { id: string; name: string }[];
}) {
  const condition = rule.conditions[0];
  const action = rule.actions[0];
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{rule.name}</CardTitle>
          <CardDescription>
            {TRIGGER_OPTIONS.find((option) => option.value === rule.trigger)?.label}
            {condition
              ? ` · if ${condition.field} ${condition.op} ${condition.value || "—"}`
              : " · always"}
            {action ? ` · ${action.type.replaceAll("_", " ")} ${action.value}` : ""}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <form action={toggleAutomationRuleAction}>
            <input type="hidden" name="id" value={rule.id} />
            <input type="hidden" name="enabled" value={rule.enabled ? "0" : "1"} />
            <Button type="submit" variant="outline" size="sm">
              {rule.enabled ? "Disable" : "Enable"}
            </Button>
          </form>
          <form action={deleteAutomationRuleAction}>
            <input type="hidden" name="id" value={rule.id} />
            <Button type="submit" variant="ghost" size="sm">
              Delete
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        <RuleForm rule={rule} agents={agents} />
      </CardContent>
    </Card>
  );
}
