import Link from "next/link";
import { notFound } from "next/navigation";
import { portalCsatAction, portalReplyAction } from "@/actions/portal";
import { getPortalTicket, requirePortalEmail } from "@/lib/crm/portal";
import { StatusBadge, PriorityBadge } from "@/components/crm/badges";
import { Button } from "@/components/crm/ui/button";
import { Textarea } from "@/components/crm/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/crm/ui/avatar";
import { formatDateTime, initials, ticketRef } from "@/lib/crm/format";
import { MessageBody } from "@/components/crm/message-body";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function HelpTicketDetailPage({
  params,
  searchParams,
}: PageProps<"/support/tickets/[id]">) {
  const email = await requirePortalEmail();
  const { id } = await params;
  const detail = await getPortalTicket(email, id);
  if (!detail) notFound();
  const { ticket, messages } = detail;
  const paramsSearch = await searchParams;
  const ok = paramsSearch.ok;
  const error = paramsSearch.error;
  const csatOk = paramsSearch.csat;
  const canRate =
    (ticket.status === "resolved" || ticket.status === "closed") && !ticket.csatScore;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/support/tickets" />}>My tickets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ticketRef(ticket.number)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{ticketRef(ticket.number)}</span>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ticket.subject}</h1>
        {ok ? (
          <p className="mt-2 text-sm text-emerald-700">Ticket submitted. Our team will follow up here.</p>
        ) : null}
        {csatOk ? (
          <p className="mt-2 text-sm text-emerald-700">Thanks for rating this conversation.</p>
        ) : null}
        {ticket.csatScore ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Your rating: {ticket.csatScore}/5
            {ticket.csatComment ? ` — ${ticket.csatComment}` : ""}
          </p>
        ) : null}
      </div>

      <ol className="space-y-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        {messages.map((message) => (
          <li key={message.id} className="flex gap-3">
            <Avatar className="size-8">
              <AvatarFallback>{initials(message.authorName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{message.authorName}</p>
                <span className="text-xs text-muted-foreground capitalize">{message.authorType}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(message.createdAt)}
                </span>
              </div>
              <MessageBody body={message.body} />
            </div>
          </li>
        ))}
      </ol>

      {canRate ? (
        <form action={portalCsatAction} className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <input type="hidden" name="ticketId" value={ticket.id} />
          <input type="hidden" name="email" value={email} />
          <p className="text-sm font-medium">How was this support experience?</p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <label key={score} className="flex cursor-pointer items-center gap-1 text-sm">
                <input type="radio" name="score" value={score} required />
                {score}
              </label>
            ))}
          </div>
          <Textarea name="comment" rows={2} placeholder="Optional comment" />
          {error === "csat" ? (
            <p className="text-sm text-destructive">Could not save that rating.</p>
          ) : null}
          <Button type="submit" variant="outline">
            Submit rating
          </Button>
        </form>
      ) : null}

      {ticket.status === "closed" ? (
        <p className="text-sm text-muted-foreground">This ticket is closed.</p>
      ) : (
        <form action={portalReplyAction} className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <input type="hidden" name="ticketId" value={ticket.id} />
          <input type="hidden" name="email" value={email} />
          <Textarea name="body" required rows={4} placeholder="Add a reply…" />
          {error && error !== "csat" ? (
            <p className="text-sm text-destructive">Could not send that reply.</p>
          ) : null}
          <Button type="submit">Send reply</Button>
        </form>
      )}
    </div>
  );
}
