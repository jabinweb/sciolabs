import Link from "next/link";
import { requirePortalEmail, listPortalTickets } from "@/lib/crm/portal";
import { StatusBadge, PriorityBadge } from "@/components/crm/badges";
import { Button } from "@/components/crm/ui/button";
import { relativeTime, ticketRef } from "@/lib/crm/format";

export const dynamic = "force-dynamic";

export default async function HelpTicketsPage() {
  const email = await requirePortalEmail();
  const tickets = await listPortalTickets(email);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My tickets</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <Button nativeButton={false} render={<Link href="/support/tickets/new" />}>
          New ticket
        </Button>
      </div>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="block rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-card/80"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {ticketRef(ticket.number)}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <p className="mt-2 font-medium">{ticket.subject}</p>
            <p className="text-xs text-muted-foreground">
              Updated {relativeTime(ticket.updatedAt)}
            </p>
          </Link>
        ))}
        {tickets.length === 0 ? (
          <p className="rounded-xl bg-card p-8 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
            No tickets yet.{" "}
            <Link href="/support/tickets/new" className="font-medium text-[#921a1d] hover:underline">
              Submit your first one
            </Link>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
