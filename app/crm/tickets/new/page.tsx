import Link from "next/link";
import { createTicketAction } from "@/actions/tickets";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import { FormSelect } from "@/components/crm/form-select";
import { Textarea } from "@/components/crm/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function NewTicketPage({
  searchParams,
}: PageProps<"/crm/tickets/new">) {
  const params = await searchParams;
  const error = params.error;
  const email = typeof params.email === "string" ? params.email : "";
  const name = typeof params.name === "string" ? params.name : "";

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/crm/tickets" />}>Tickets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New ticket</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New ticket</h1>
        <p className="text-sm text-muted-foreground">
          Log a conversation that started outside the website — phone, email, or walk-in.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Contact and message</CardTitle>
          <CardDescription>Creates a contact if the email is new, then opens the ticket thread.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTicketAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Contact email</Label>
                <Input id="email" name="email" type="email" required defaultValue={email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={name} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <FormSelect
                  id="type"
                  name="type"
                  defaultValue="general"
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
                <Label htmlFor="priority">Priority</Label>
                <FormSelect
                  id="priority"
                  name="priority"
                  defaultValue="medium"
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ]}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">Message</Label>
              <Textarea id="body" name="body" required rows={6} />
            </div>
            {error ? <p className="text-sm text-destructive">Email, subject, and message are required.</p> : null}
            <Button type="submit">Create ticket</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
