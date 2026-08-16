import Link from "next/link";
import { notFound } from "next/navigation";
import { ReplyBox } from "@/components/crm/reply-box";
import { TicketProperties } from "@/components/crm/ticket-properties";
import { MessageBody } from "@/components/crm/message-body";
import { ConversationPane } from "@/components/crm/conversation-pane";
import { formatDateTime, initials, ticketSlaLabel, ticketRef } from "@/lib/crm/format";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/crm/ui/avatar";
import { Badge } from "@/components/crm/ui/badge";
import { Separator } from "@/components/crm/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";
import { getTicket, listAgents, listCannedResponses, listMessages } from "@/lib/crm/queries";
import { requireAgent } from "@/lib/crm/auth";
import { StatusBadge, PriorityBadge, TagChips } from "@/components/crm/badges";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: PageProps<"/crm/tickets/[id]">) {
  const { id } = await params;
  const agent = await requireAgent();
  const [ticket, messages, macros, agents] = await Promise.all([
    getTicket(id),
    listMessages(id),
    listCannedResponses(),
    listAgents(),
  ]);
  if (!ticket) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0 space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/crm/tickets" />}>Tickets</BreadcrumbLink>
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
            <Badge variant="outline" className="capitalize">
              {ticket.type}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {ticket.source}
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight wrap-break-word">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Opened {formatDateTime(ticket.createdAt)} · {ticketSlaLabel(ticket)}
          </p>
          <div className="mt-3">
            <TagChips tags={ticket.tags} showFreshdesk />
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:grid-rows-[minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <ConversationPane>
            {messages.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ol className="divide-y divide-border">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={cn(
                      "flex gap-3 p-4",
                      message.isInternal && "bg-amber-50/80 dark:bg-amber-950/20",
                      message.authorType === "agent" && !message.isInternal && "bg-muted/30",
                    )}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback>{initials(message.authorName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <p className="text-sm font-medium">{message.authorName}</p>
                        <span className="text-xs capitalize text-muted-foreground">{message.authorType}</span>
                        {message.isInternal ? <Badge variant="secondary">Internal</Badge> : null}
                        <span className="text-xs text-muted-foreground">{formatDateTime(message.createdAt)}</span>
                      </div>
                      <MessageBody body={message.body} />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </ConversationPane>
          <ReplyBox
            ticketId={ticket.id}
            macros={macros}
            assignedToMe={ticket.assigneeId === agent.id}
            className="shrink-0 rounded-none rounded-b-xl ring-0 border-t"
          />
        </div>

        <aside className="min-h-0 space-y-4 overflow-y-auto rounded-xl bg-card p-4 ring-1 ring-foreground/10 max-xl:max-h-[40vh]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact</p>
            {ticket.contactId ? (
              <Link href={`/crm/contacts/${ticket.contactId}`} className="mt-1 block font-medium hover:underline">
                {ticket.contactName ?? ticket.contactEmail}
              </Link>
            ) : (
              <p className="mt-1 font-medium">{ticket.contactName ?? "Unknown"}</p>
            )}
            <p className="text-xs break-all text-muted-foreground">{ticket.contactEmail}</p>
            {ticket.licenseTier ? (
              <Badge variant="outline" className="mt-2">
                {ticket.licenseTier}
              </Badge>
            ) : null}
          </div>
          <Separator />
          <TicketProperties ticket={ticket} agents={agents} currentAgentId={agent.id} />
          <Separator />
          <dl className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between gap-3">
              <dt>Created</dt>
              <dd>{formatDateTime(ticket.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Updated</dt>
              <dd>{formatDateTime(ticket.updatedAt)}</dd>
            </div>
            {ticket.firstResponseDueAt ? (
              <div className="flex justify-between gap-3">
                <dt>First reply due</dt>
                <dd>{formatDateTime(ticket.firstResponseDueAt)}</dd>
              </div>
            ) : null}
            {ticket.resolutionDueAt ? (
              <div className="flex justify-between gap-3">
                <dt>Resolve due</dt>
                <dd>{formatDateTime(ticket.resolutionDueAt)}</dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>
    </div>
  );
}
