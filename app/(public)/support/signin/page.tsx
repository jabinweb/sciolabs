import { portalLoginAction } from "@/actions/portal";
import { getPortalEmail } from "@/lib/crm/portal";
import { redirect } from "next/navigation";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";

export const dynamic = "force-dynamic";

export default async function HelpLoginPage({
  searchParams,
}: PageProps<"/support/signin">) {
  const email = await getPortalEmail();
  if (email) redirect("/support/tickets");
  const error = (await searchParams).error;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Check your tickets</CardTitle>
        <CardDescription>
          Enter the email you used when contacting support. No password — we’ll open your ticket
          history for this browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={portalLoginAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          {error ? (
            <p className="text-sm text-destructive">Enter a valid email address.</p>
          ) : null}
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
