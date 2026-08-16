import Link from "next/link";
import { portalCreateTicketAction } from "@/actions/portal";
import { getPortalEmail } from "@/lib/crm/portal";
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

export const dynamic = "force-dynamic";

export default async function HelpNewTicketPage({
  searchParams,
}: PageProps<"/support/tickets/new">) {
  const email = (await getPortalEmail()) ?? "";
  const error = (await searchParams).error;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contact support</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what happened. We’ll email replies into this portal and the agent desk.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New ticket</CardTitle>
          <CardDescription>
            Already have an account on Discovery Bible? Use the same email so we can match your
            history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={portalCreateTicketAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required defaultValue={email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <FormSelect
                id="type"
                name="type"
                defaultValue="general"
                options={[
                  { value: "question", label: "Question" },
                  { value: "bug", label: "Bug" },
                  { value: "feature", label: "Feature request" },
                  { value: "billing", label: "Billing" },
                  { value: "general", label: "General" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">Message</Label>
              <Textarea id="body" name="body" required rows={7} />
            </div>
            {error ? (
              <p className="text-sm text-destructive">Email, subject, and message are required.</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Submit ticket</Button>
              <Button nativeButton={false} variant="ghost" render={<Link href="/" />}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
