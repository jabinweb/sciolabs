import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { Badge } from "@/components/crm/ui/badge";
import { requireAgent } from "@/lib/crm/auth";
import { getDashboardStats, listTickets } from "@/lib/crm/queries";
import { relativeTime, ticketSlaLabel, ticketRef } from "@/lib/crm/format";
import { StatusBadge, PriorityBadge } from "@/components/crm/badges";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const agent = await requireAgent();
  const [stats, recentPage, minePage] = await Promise.all([
    getDashboardStats(),
    listTickets({ view: "open", page: 1, pageSize: 8 }),
    listTickets({ view: "mine", assigneeId: agent.id, page: 1, pageSize: 1 }),
  ]);
  const openRecent = recentPage.items;
  const mineCount = minePage.total;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Freshdesk-style agent home — jump straight into the queues that need work.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard href="/crm/tickets?view=open" title="Open" value={stats.open} hint="Needs a first reply or follow-up" />
        <StatCard href="/crm/tickets?status=pending" title="Pending" value={stats.pending} hint="Waiting on the contact" />
        <StatCard href="/crm/tickets?view=unassigned" title="Unassigned" value={stats.unassigned} hint="No agent yet" />
        <StatCard href="/crm/tickets?view=urgent" title="Urgent" value={stats.urgent} hint="Highest first-response SLA" />
        <StatCard href="/crm/tickets?view=mine" title="My open" value={mineCount} hint="Assigned to you" />
        <StatCard href="/crm/tickets?view=open" title="From the app (24h)" value={stats.fromApp24h} hint="In-app feedback and reader tickets" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open queue</CardTitle>
          <CardDescription>Highest priority first — same list agents work in Tickets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {openRecent.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/crm/tickets/${ticket.id}`}
              className="flex items-start justify-between gap-4 rounded-lg p-3 ring-1 ring-foreground/10 hover:bg-muted/60"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{ticketRef(ticket.number)}</span>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.source === "app" || ticket.source === "feedback" ? (
                    <Badge variant="outline">App</Badge>
                  ) : null}
                </div>
                <p className="mt-1 font-medium wrap-break-word">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground wrap-break-word">
                  {ticket.contactName ?? ticket.contactEmail ?? "Unknown"} ·{" "}
                  {ticketSlaLabel(ticket)}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(ticket.createdAt)}</span>
            </Link>
          ))}
          {openRecent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open tickets. New in-app feedback will land here.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value: number;
  hint: string;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded-xl transition-colors hover:bg-muted/40">
      <Card>
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
