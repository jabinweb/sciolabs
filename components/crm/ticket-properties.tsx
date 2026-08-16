"use client";

import { assignToMeAction, updateTicketAction } from "@/actions/tickets";
import type { Agent, Ticket } from "@/lib/crm/types";
import { visibleTags } from "@/lib/crm/format";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import { FormSelect } from "@/components/crm/form-select";

export function TicketProperties({
  ticket,
  agents,
  currentAgentId,
}: {
  ticket: Ticket;
  agents: Agent[];
  currentAgentId: string;
}) {
  return (
    <div className="space-y-4">
      {!ticket.assigneeId || ticket.assigneeId !== currentAgentId ? (
        <form action={assignToMeAction}>
          <input type="hidden" name="ticketId" value={ticket.id} />
          <Button type="submit" className="w-full">
            Pick up ticket
          </Button>
        </form>
      ) : null}

      <form action={updateTicketAction} className="space-y-4">
        <input type="hidden" name="ticketId" value={ticket.id} />
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <FormSelect
            id="status"
            name="status"
            defaultValue={ticket.status}
            options={[
              { value: "open", label: "Open" },
              { value: "pending", label: "Pending" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <FormSelect
            id="priority"
            name="priority"
            defaultValue={ticket.priority}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <FormSelect
            id="type"
            name="type"
            defaultValue={ticket.type}
            options={[
              { value: "question", label: "Question" },
              { value: "bug", label: "Bug" },
              { value: "feature", label: "Feature" },
              { value: "billing", label: "Billing" },
              { value: "general", label: "General" },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="assigneeId">Assignee</Label>
          <FormSelect
            id="assigneeId"
            name="assigneeId"
            defaultValue={ticket.assigneeId ?? ""}
            placeholder="Unassigned"
            options={[
              { value: "", label: "Unassigned" },
              ...agents.map((agent) => ({ value: agent.id, label: agent.name })),
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={visibleTags(ticket.tags).join(", ")}
            placeholder="active-stephen, billing"
          />
        </div>
        <Button type="submit" variant="outline" className="w-full">
          Update properties
        </Button>
      </form>
    </div>
  );
}
