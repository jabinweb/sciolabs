import Link from "next/link";
import { redirect } from "next/navigation";
import { FreshdeskMigrateForm } from "@/components/crm/freshdesk-migrate-form";
import { requireAgent } from "@/lib/crm/auth";
import { getSettingsForAdminForm, SETTING_KEYS } from "@/lib/crm/app-settings";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function MigratePage() {
  const agent = await requireAgent();
  if (agent.role !== "admin") redirect("/crm/settings?tab=team&error=admin");
  const { values, masked, fromEnv } = await getSettingsForAdminForm();
  const defaultUrl =
    values[SETTING_KEYS.freshdeskUrl] ||
    process.env.FRESHDESK_URL ||
    "https://yourcompany.freshdesk.com";
  const hasSavedKey = Boolean(masked[SETTING_KEYS.freshdeskApiKey] || fromEnv[SETTING_KEYS.freshdeskApiKey]);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/crm/settings?tab=freshdesk" />}>Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Freshdesk migration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Migrate from Freshdesk</h1>
        <p className="text-sm text-muted-foreground">
          Import contacts, tickets, and conversations. This wipes existing CRM tickets first.
        </p>
      </div>

      <FreshdeskMigrateForm
        defaultUrl={defaultUrl}
        hasEnvApiKey={hasSavedKey}
      />
    </div>
  );
}
