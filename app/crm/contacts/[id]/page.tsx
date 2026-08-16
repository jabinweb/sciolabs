import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/crm/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { StatusBadge, PriorityBadge, TagChips } from "@/components/crm/badges";
import { Button } from "@/components/crm/ui/button";
import { getContact, listTicketsForContact } from "@/lib/crm/queries";
import { listFormResponsesForContact } from "@/lib/crm/from-form";
import { relativeTime, ticketRef } from "@/lib/crm/format";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({
  params,
}: PageProps<"/crm/contacts/[id]">) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) notFound();
  const [tickets, forms] = await Promise.all([
    listTicketsForContact(id),
    listFormResponsesForContact({ email: contact.email, phone: contact.phone }),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/crm/contacts" />}>Contacts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{contact.name ?? contact.email}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact</p>
          <h1 className="text-2xl font-semibold tracking-tight">{contact.name ?? contact.email}</h1>
          <p className="text-sm text-muted-foreground">{contact.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {contact.licenseTier ? <Badge variant="outline">{contact.licenseTier}</Badge> : null}
            {contact.subscriptionStatus ? (
              <Badge variant="secondary">{contact.subscriptionStatus}</Badge>
            ) : null}
            {contact.appUserId ? <Badge variant="outline">App user</Badge> : null}
            <TagChips tags={contact.tags} showFreshdesk />
          </div>
        </div>
        {contact.email ? (
          <Button
            nativeButton={false}
            render={
              <Link
                href={`/crm/tickets/new?email=${encodeURIComponent(contact.email)}&name=${encodeURIComponent(contact.name ?? "")}`}
              />
            }
          >
            New ticket
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Every conversation linked to this contact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/crm/tickets/${ticket.id}`}
              className="flex items-start justify-between gap-4 rounded-lg p-3 ring-1 ring-foreground/10 hover:bg-muted/60"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">{ticketRef(ticket.number)}</p>
                <p className="font-medium wrap-break-word">{ticket.subject}</p>
                <div className="mt-1 flex gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{relativeTime(ticket.createdAt)}</span>
            </Link>
          ))}
          {tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form submissions</CardTitle>
          <CardDescription>Website forms matched to this contact by email or phone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {forms.map((form) => (
            <div key={form.id} className="rounded-lg p-3 ring-1 ring-foreground/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{form.formName}</p>
                  {form.source ? (
                    <p className="text-xs text-muted-foreground">{form.source}</p>
                  ) : null}
                </div>
                <span className="text-xs text-muted-foreground">{relativeTime(form.createdAt)}</span>
              </div>
              {form.fields.length ? (
                <dl className="mt-2 grid gap-1 text-sm">
                  {form.fields.map((field) => (
                    <div key={field.key} className="grid gap-0.5 sm:grid-cols-[8rem_1fr]">
                      <dt className="text-muted-foreground">{field.key}</dt>
                      <dd className="min-w-0 wrap-break-word">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
          {forms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No form submissions on file.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
