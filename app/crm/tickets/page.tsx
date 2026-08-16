import Link from "next/link";
import { TicketFilters } from "@/components/crm/ticket-filters";
import { StatusBadge, PriorityBadge } from "@/components/crm/badges";
import { Button } from "@/components/crm/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/crm/ui/table";
import { TablePagination, TABLE_PAGE_SIZE, parsePage } from "@/components/crm/table-pagination";
import { requireAgent } from "@/lib/crm/auth";
import { countTicketViews, listTickets } from "@/lib/crm/queries";
import { relativeTime, ticketSlaLabel, ticketRef } from "@/lib/crm/format";

export const dynamic = "force-dynamic";

export default async function TicketsPage({
  searchParams,
}: PageProps<"/crm/tickets">) {
  const agent = await requireAgent();
  const params = await searchParams;
  const view = typeof params.view === "string" ? params.view : "all";
  const status = typeof params.status === "string" ? params.status : "all";
  const priority = typeof params.priority === "string" ? params.priority : "all";
  const q = typeof params.q === "string" ? params.q : "";
  const page = parsePage(params.page);
  const [paged, counts] = await Promise.all([
    listTickets({
      view,
      status,
      priority,
      q,
      assigneeId: view === "mine" ? agent.id : undefined,
      page,
      pageSize: TABLE_PAGE_SIZE,
    }),
    countTicketViews(agent.id),
  ]);
  const tickets = Array.isArray(paged) ? paged : (paged.items ?? []);
  const total = Array.isArray(paged) ? paged.length : (paged.total ?? 0);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-sm text-muted-foreground">
            Freshdesk-style queue — filter by view, status, and priority.
          </p>
        </div>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/crm/tickets/board" />} variant="outline">
            Pipeline
          </Button>
          <Button nativeButton={false} render={<Link href="/crm/tickets/new" />}>
            New ticket
          </Button>
        </div>
      </div>

      <div className="shrink-0">
        <TicketFilters view={view} status={status} priority={priority} q={q} counts={counts} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <Table
          className="table-fixed"
          containerClassName="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-[38%]">Ticket</TableHead>
              <TableHead className="w-[20%]">Contact</TableHead>
              <TableHead className="w-[8%]">Status</TableHead>
              <TableHead className="w-[8%]">Priority</TableHead>
              <TableHead className="w-[12%]">Assignee</TableHead>
              <TableHead className="w-[8%]">SLA</TableHead>
              <TableHead className="w-[6%]">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="min-w-0 py-1.5">
                  <Link
                    href={`/crm/tickets/${ticket.id}`}
                    className="flex min-w-0 items-baseline gap-2 hover:underline"
                    title={ticket.subject}
                  >
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {ticketRef(ticket.number)}
                    </span>
                    <span className="truncate font-medium">{ticket.subject}</span>
                  </Link>
                </TableCell>
                <TableCell className="min-w-0 py-1.5">
                  <p
                    className="truncate"
                    title={[ticket.contactName, ticket.contactEmail].filter(Boolean).join(" · ")}
                  >
                    {ticket.contactName ?? ticket.contactEmail ?? "—"}
                  </p>
                </TableCell>
                <TableCell className="min-w-0 py-1.5">
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell className="min-w-0 py-1.5">
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell className="min-w-0 truncate py-1.5">
                  {ticket.assigneeName ?? "Unassigned"}
                </TableCell>
                <TableCell className="min-w-0 truncate py-1.5 text-xs text-muted-foreground">
                  {ticketSlaLabel(ticket)}
                </TableCell>
                <TableCell className="min-w-0 truncate py-1.5 text-muted-foreground">
                  {relativeTime(ticket.updatedAt)}
                </TableCell>
              </TableRow>
            ))}
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No tickets match these filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <TablePagination
          pathname="/crm/tickets"
          searchParams={params}
          page={page}
          total={total}
        />
      </div>
    </div>
  );
}
