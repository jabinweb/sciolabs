"use client";

import { moveTicketStatusAction } from "@/actions/tickets";
import { FormSelect } from "@/components/crm/form-select";
import type { TicketStatus } from "@/lib/crm/types";

export function PipelineCardMove({
  ticketId,
  status,
}: {
  ticketId: string;
  status: TicketStatus;
}) {
  return (
    <form action={moveTicketStatusAction} className="mt-2">
      <input type="hidden" name="ticketId" value={ticketId} />
      <FormSelect
        name="status"
        defaultValue={status}
        triggerClassName="h-8 text-xs"
        onValueChange={() => {
          queueMicrotask(() => {
            const active = document.activeElement as HTMLElement | null;
            active?.closest("form")?.requestSubmit();
          });
        }}
        options={[
          { value: "open", label: "Move to open" },
          { value: "pending", label: "Move to pending" },
          { value: "resolved", label: "Move to resolved" },
          { value: "closed", label: "Move to closed" },
        ]}
      />
    </form>
  );
}
