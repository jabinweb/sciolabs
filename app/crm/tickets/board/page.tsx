import Link from "next/link";
import { PipelineCardMove } from "@/components/crm/pipeline-card-move";
import { StatusBadge, PriorityBadge } from "@/components/crm/badges";
import { requireAgent } from "@/lib/crm/auth";
import { listTickets } from "@/lib/crm/queries";
import { ticketSlaLabel, ticketRef } from "@/lib/crm/format";
import type { TicketStatus } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

const COLUMNS: { status: TicketStatus; hint: string }[] = [
  { status: "open", hint: "Needs a reply" },
  { status: "pending", hint: "Waiting on the contact" },
  { status: "resolved", hint: "Recently resolved" },
  { status: "closed", hint: "Done" },
];

export default async function TicketBoardPage() {
  await requireAgent();
  const columns = await Promise.all(
    COLUMNS.map(async (column) => {
      const pageSize = column.status === "open" || column.status === "pending" ? 60 : 30;
      const result = await listTickets({ status: column.status, page: 1, pageSize });
      return { ...column, ...result };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Move tickets across statuses. Open and pending show the latest 60; resolved and closed show 30.
          </p>
        </div>
        <Link href="/crm/tickets" className="text-sm text-muted-foreground hover:underline">
          List view
        </Link>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <section key={column.status} className="min-w-0 rounded-xl bg-card ring-1 ring-foreground/10">
            <header className="flex items-baseline justify-between gap-2 border-b px-3 py-2">
              <div>
                <h2 className="text-sm font-medium capitalize">{column.status}</h2>
                <p className="text-xs text-muted-foreground">{column.hint}</p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">{column.total}</span>
            </header>
            <ul className="max-h-[calc(100vh-14rem)] space-y-2 overflow-y-auto p-2">
              {column.items.map((ticket) => (
                <li key={ticket.id} className="rounded-lg p-3 ring-1 ring-foreground/10">
                  <Link href={`/crm/tickets/${ticket.id}`} className="block hover:underline">
                    <p className="font-mono text-[11px] text-muted-foreground">{ticketRef(ticket.number)}</p>
                    <p className="mt-0.5 text-sm font-medium wrap-break-word">{ticket.subject}</p>
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground wrap-break-word">
                    {ticket.contactName ?? ticket.contactEmail ?? "Unknown"} · {ticketSlaLabel(ticket)}
                  </p>
                  <PipelineCardMove ticketId={ticket.id} status={ticket.status} />
                </li>
              ))}
              {column.items.length === 0 ? (
                <li className="px-2 py-6 text-center text-xs text-muted-foreground">No tickets</li>
              ) : null}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
