import Link from "next/link";
import { Input } from "@/components/crm/ui/input";
import { Button } from "@/components/crm/ui/button";
import { Badge } from "@/components/crm/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/crm/ui/table";
import { listContacts } from "@/lib/crm/queries";
import { relativeTime } from "@/lib/crm/format";
import { TagChips } from "@/components/crm/badges";
import { TablePagination, TABLE_PAGE_SIZE, parsePage } from "@/components/crm/table-pagination";

export const dynamic = "force-dynamic";

export default async function ContactsPage({
  searchParams,
}: PageProps<"/crm/contacts">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const page = parsePage(params.page);
  const paged = await listContacts(q, {
    page,
    pageSize: TABLE_PAGE_SIZE,
  });
  const contacts = Array.isArray(paged) ? paged : (paged.items ?? []);
  const total = Array.isArray(paged) ? paged.length : (paged.total ?? 0);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Website form submissions and support tickets create contacts, matched by email.
          </p>
        </div>
        <form action="/crm/contacts" method="get" className="flex w-full gap-2 sm:max-w-md">
          <Input name="q" defaultValue={q} placeholder="Search name or email" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <Table className="table-fixed" containerClassName="min-h-0 flex-1">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[22%]">Name</TableHead>
              <TableHead className="w-[38%]">Email</TableHead>
              <TableHead className="w-[9%]">License</TableHead>
              <TableHead className="w-[16%]">Tags</TableHead>
              <TableHead className="w-[7%]">Tickets</TableHead>
              <TableHead className="w-[8%]">Last seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="min-w-0">
                  <Link
                    href={`/crm/contacts/${contact.id}`}
                    className="block truncate font-medium hover:underline"
                    title={contact.name ?? undefined}
                  >
                    {contact.name ?? "—"}
                  </Link>
                </TableCell>
                <TableCell className="min-w-0">
                  <span className="block truncate" title={contact.email ?? undefined}>
                    {contact.email ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {contact.licenseTier ? <Badge variant="outline">{contact.licenseTier}</Badge> : "—"}
                </TableCell>
                <TableCell className="min-w-0">
                  <TagChips tags={contact.tags} empty="—" />
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">{contact.ticketCount}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {contact.lastSeenAt ? relativeTime(contact.lastSeenAt) : "—"}
                </TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No contacts yet. Form submissions and tickets create them automatically.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <TablePagination
          pathname="/crm/contacts"
          searchParams={params}
          page={page}
          total={total}
        />
      </div>
    </div>
  );
}
