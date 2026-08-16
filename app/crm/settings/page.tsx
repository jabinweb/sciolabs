import Link from "next/link";
import { Suspense } from "react";
import {
  createAgentAction,
  createCannedResponseAction,
  createKbArticleAction,
  saveAiSettingsAction,
  saveEmailSettingsAction,
  saveFreshdeskSettingsAction,
  saveGeneralSettingsAction,
  saveIngestSettingsAction,
  testConnectionAction,
  updateAgentAction,
} from "@/actions/settings";
import { getSessionAgent } from "@/lib/crm/auth";
import { getSettingsForAdminForm, SETTING_KEYS } from "@/lib/crm/app-settings";
import { listAgents, listCannedResponses, listKbArticles } from "@/lib/crm/queries";
import { Badge } from "@/components/crm/ui/badge";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import { FormSelect } from "@/components/crm/form-select";
import { SmtpFields } from "@/components/crm/smtp-fields";
import { SettingsShell } from "@/components/crm/settings-shell";
import { parseSettingsTab, queryParam } from "@/lib/crm/settings-tabs";
import { mailTransportLabel } from "@/lib/crm/email";
import { Textarea } from "@/components/crm/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";

export const dynamic = "force-dynamic";

function flashDetail(raw?: string | string[]) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.replace(/[\r\n]+/g, " ").trim().slice(0, 160) ?? "";
}

function notice(
  ok?: string | string[],
  error?: string | string[],
  detailRaw?: string | string[],
) {
  const okKey = Array.isArray(ok) ? ok[0] : ok;
  const errKey = Array.isArray(error) ? error[0] : error;
  const detail = flashDetail(detailRaw);
  if (okKey === "agent") return { tone: "ok" as const, text: "Agent created. They can sign in with that email and password." };
  if (okKey === "updated") return { tone: "ok" as const, text: "Agent updated." };
  if (okKey === "macro") return { tone: "ok" as const, text: "Canned response added." };
  if (okKey === "kb") return { tone: "ok" as const, text: "Knowledge article published." };
  if (okKey === "general") return { tone: "ok" as const, text: "General settings saved." };
  if (okKey === "email") return { tone: "ok" as const, text: "Email settings saved. Test the connection next." };
  if (okKey === "ai") return { tone: "ok" as const, text: "AI settings saved. Test Gemini next." };
  if (okKey === "ingest") return { tone: "ok" as const, text: "Ingest key saved. Test the connection next." };
  if (okKey === "freshdesk") return { tone: "ok" as const, text: "Freshdesk settings saved. Test the connection next." };
  if (okKey?.endsWith("test")) {
    return { tone: "ok" as const, text: detail || "Connection succeeded." };
  }
  if (errKey?.endsWith("test") || errKey === "test") {
    return { tone: "err" as const, text: detail || "Connection failed. Save settings, then try again." };
  }
  if (errKey === "admin") return { tone: "err" as const, text: "Only admins can change settings." };
  if (errKey === "exists") return { tone: "err" as const, text: "That email is already an agent." };
  if (errKey === "password") return { tone: "err" as const, text: "Password must be at least 8 characters." };
  if (errKey === "agent") return { tone: "err" as const, text: "Name, email, and an 8+ character password are required." };
  if (errKey === "macro") return { tone: "err" as const, text: "Title and body are required for a canned response." };
  if (errKey === "kb") return { tone: "err" as const, text: "Title, slug, and body are required for a knowledge article." };
  return null;
}

function sourceHint(fromEnv?: boolean) {
  return fromEnv ? (
    <span className="text-xs text-muted-foreground"> Currently using env fallback — save to store in DB.</span>
  ) : null;
}

function TestRow({
  target,
  label,
  children,
}: {
  target: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      action={testConnectionAction}
      className="flex flex-col gap-3 rounded-lg bg-muted/40 p-4 sm:flex-row sm:items-end"
    >
      <input type="hidden" name="target" value={target} />
      <div className="min-w-0 flex-1 space-y-1.5">
        {children ?? (
          <p className="text-xs text-muted-foreground">Save first, then test this connection.</p>
        )}
      </div>
      <Button type="submit" variant="outline">
        {label}
      </Button>
    </form>
  );
}

export default async function SettingsPage({
  searchParams,
}: PageProps<"/crm/settings">) {
  const params = await searchParams;
  const agent = await getSessionAgent();
  const isAdmin = agent?.role === "admin";
  const tab = parseSettingsTab(queryParam(params, "tab"), isAdmin);
  const [agents, macros, articles, integration, mailLabel] = await Promise.all([
    listAgents(),
    listCannedResponses(),
    listKbArticles(),
    getSettingsForAdminForm(),
    mailTransportLabel(),
  ]);
  const flash = notice(queryParam(params, "ok"), queryParam(params, "error"), queryParam(params, "detail"));
  const { values, masked, fromEnv } = integration;

  const teamPanel = (
    <Card>
      <CardHeader>
        <CardTitle>Agents</CardTitle>
        <CardDescription>
          People who can sign in to this desk. Admins can onboard new teammates with credentials.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((item) => (
          <div key={item.id} className="space-y-3 rounded-lg p-3 ring-1 ring-foreground/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{item.role}</Badge>
                <Badge variant="secondary">{item.status}</Badge>
              </div>
            </div>
            {isAdmin ? (
              <form action={updateAgentAction} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="agentId" value={item.id} />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`name-${item.id}`}>Name</Label>
                  <Input id={`name-${item.id}`} name="name" defaultValue={item.name} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`role-${item.id}`}>Role</Label>
                  <FormSelect
                    id={`role-${item.id}`}
                    name="role"
                    defaultValue={item.role}
                    options={[
                      { value: "agent", label: "Agent" },
                      { value: "admin", label: "Admin" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`status-${item.id}`}>Status</Label>
                  <FormSelect
                    id={`status-${item.id}`}
                    name="status"
                    defaultValue={item.status}
                    options={[
                      { value: "online", label: "Online" },
                      { value: "away", label: "Away" },
                      { value: "offline", label: "Offline" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`password-${item.id}`}>Reset password</Label>
                  <Input
                    id={`password-${item.id}`}
                    name="password"
                    type="password"
                    minLength={8}
                    placeholder="Leave blank to keep current password"
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" variant="outline" className="sm:col-span-2 sm:w-fit">
                  Save agent
                </Button>
              </form>
            ) : null}
          </div>
        ))}

        {isAdmin ? (
          <form action={createAgentAction} className="space-y-3 rounded-lg border border-dashed border-border p-4">
            <div>
              <p className="text-sm font-medium">Onboard agent</p>
              <p className="text-xs text-muted-foreground">
                Creates a login. Share the email and temporary password with them.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-name">Name</Label>
                <Input id="new-name" name="name" required placeholder="Jordan Lee" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-email">Email</Label>
                <Input id="new-email" name="email" type="email" required placeholder="agent@discoverybible.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">Temporary password</Label>
                <Input id="new-password" name="password" type="password" required minLength={8} autoComplete="new-password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-role">Role</Label>
                <FormSelect
                  id="new-role"
                  name="role"
                  defaultValue="agent"
                  options={[
                    { value: "agent", label: "Agent" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
              </div>
            </div>
            <Button type="submit">Create agent login</Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">Ask an admin to onboard additional agents.</p>
        )}
      </CardContent>
    </Card>
  );

  const contentPanel = (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Canned responses</CardTitle>
          <CardDescription>Inserted from the ticket reply box.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {macros.map((macro) => (
            <div key={macro.id}>
              <p className="text-sm font-medium">
                {macro.title}{" "}
                {macro.shortcut ? (
                  <span className="font-mono text-xs text-muted-foreground">{macro.shortcut}</span>
                ) : null}
              </p>
              <p className="text-sm text-muted-foreground">{macro.body}</p>
            </div>
          ))}
          {isAdmin ? (
            <form action={createCannedResponseAction} className="space-y-3 rounded-lg border border-dashed border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="macro-title">Title</Label>
                  <Input id="macro-title" name="title" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="macro-shortcut">Shortcut</Label>
                  <Input id="macro-shortcut" name="shortcut" placeholder="#thanks" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="macro-body">Body</Label>
                <Textarea id="macro-body" name="body" required rows={3} />
              </div>
              <Button type="submit" variant="outline">
                Add canned response
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge</CardTitle>
          <CardDescription>Articles shown on the Knowledge page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {articles.slice(0, 5).map((article) => (
            <div key={article.id}>
              <p className="text-sm font-medium">{article.title}</p>
              <p className="text-xs text-muted-foreground">
                {article.category} · {article.slug}
              </p>
            </div>
          ))}
          {isAdmin ? (
            <form action={createKbArticleAction} className="space-y-3 rounded-lg border border-dashed border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="kb-title">Title</Label>
                  <Input id="kb-title" name="title" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="kb-slug">Slug</Label>
                  <Input id="kb-slug" name="slug" required placeholder="device-limits" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="kb-category">Category</Label>
                  <Input id="kb-category" name="category" defaultValue="General" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kb-body">Body</Label>
                <Textarea id="kb-body" name="body" required rows={4} />
              </div>
              <Button type="submit" variant="outline">
                Publish article
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure the desk in sections. Save each connection, then test it.
          </p>
        </div>
        {isAdmin ? (
          <Button nativeButton={false} render={<Link href="/crm/settings/workflows" />} variant="outline">
            Workflows
          </Button>
        ) : null}
      </div>

      {flash ? (
        <p className={flash.tone === "ok" ? "text-sm text-foreground" : "text-sm text-destructive"}>
          {flash.text}
        </p>
      ) : null}

      <Suspense fallback={null}>
      <SettingsShell
        tab={tab}
        isAdmin={isAdmin}
        panels={{
          general: isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Public URL used in customer emails, plus cookie HTTPS behavior.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={saveGeneralSettingsAction} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="app_url">Public app URL</Label>
                      <Input
                        id="app_url"
                        name="app_url"
                        placeholder="https://crm.example.com"
                        defaultValue={values[SETTING_KEYS.appUrl]}
                      />
                      <p className="text-xs text-muted-foreground">
                        No trailing slash. Used in email links and ingest tests.
                        {sourceHint(fromEnv[SETTING_KEYS.appUrl])}
                      </p>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="cookie_secure">Secure cookies</Label>
                      <FormSelect
                        id="cookie_secure"
                        name="cookie_secure"
                        defaultValue={
                          values[SETTING_KEYS.cookieSecure] === "1" ||
                          values[SETTING_KEYS.cookieSecure] === "true"
                            ? "1"
                            : values[SETTING_KEYS.cookieSecure] === "0" ||
                                values[SETTING_KEYS.cookieSecure] === "false"
                              ? "0"
                              : ""
                        }
                        options={[
                          { value: "", label: "Auto (from public URL)" },
                          { value: "1", label: "Force secure (HTTPS)" },
                          { value: "0", label: "Force off (HTTP sslip.io)" },
                        ]}
                      />
                    </div>
                  </div>
                  <Button type="submit">Save general settings</Button>
                </form>
                <TestRow target="appurl" label="Test public URL">
                  <p className="text-xs text-muted-foreground">
                    Save first. This fetches the public URL from this server.
                  </p>
                </TestRow>
                <TestRow target="database" label="Test database">
                  <p className="text-xs text-muted-foreground">
                    Confirms the CRM can query Postgres (or local PGlite).
                  </p>
                </TestRow>
              </CardContent>
            </Card>
          ) : null,
          email: isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Outgoing mail for ticket confirmations, agent replies, and desk alerts.
                  {mailLabel ? (
                    <>
                      {" "}
                      Currently sending via <span className="font-medium text-foreground">{mailLabel}</span>.
                    </>
                  ) : (
                    <> Not configured yet — mail is skipped until you save SMTP below.</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form action={saveEmailSettingsAction} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="email_from">From address</Label>
                      <Input
                        id="email_from"
                        name="email_from"
                        placeholder="Discovery Bible Support &lt;support@example.com&gt;"
                        defaultValue={values[SETTING_KEYS.emailFrom]}
                      />
                      <p className="text-xs text-muted-foreground">
                        What customers see as the sender. Use the same mailbox as SMTP username if unsure.
                        {sourceHint(fromEnv[SETTING_KEYS.emailFrom])}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="notify_to">Alert agents at</Label>
                      <Input
                        id="notify_to"
                        name="notify_to"
                        type="email"
                        placeholder="support@discoverybible.com"
                        defaultValue={values[SETTING_KEYS.notifyTo]}
                      />
                      <p className="text-xs text-muted-foreground">
                        New tickets and customer replies go here. Leave blank to skip agent alerts.
                        {sourceHint(fromEnv[SETTING_KEYS.notifyTo])}
                      </p>
                    </div>
                  </div>
                  <SmtpFields
                    host={values[SETTING_KEYS.smtpHost]}
                    port={values[SETTING_KEYS.smtpPort]}
                    user={values[SETTING_KEYS.smtpUser]}
                    passPlaceholder={masked[SETTING_KEYS.smtpPass] || ""}
                    secure={values[SETTING_KEYS.smtpSecure]}
                  />
                  {fromEnv[SETTING_KEYS.smtpHost] || fromEnv[SETTING_KEYS.smtpUser] ? (
                    <p className="text-xs text-muted-foreground">
                      SMTP is currently coming from env. Save this form to store it in the database.
                    </p>
                  ) : null}
                  <details className="rounded-lg border border-dashed border-border p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      Optional: Resend instead of SMTP
                    </summary>
                    <div className="mt-3 space-y-1.5">
                      <Label htmlFor="resend_api_key">Resend API key</Label>
                      <Input
                        id="resend_api_key"
                        name="resend_api_key"
                        type="password"
                        autoComplete="off"
                        placeholder={masked[SETTING_KEYS.resendApiKey] || "re_…"}
                      />
                      <p className="text-xs text-muted-foreground">
                        Used only if SMTP host is empty. Leave blank to keep the current key.
                        {sourceHint(fromEnv[SETTING_KEYS.resendApiKey])}
                      </p>
                    </div>
                  </details>
                  <Button type="submit">Save email settings</Button>
                </form>
                <TestRow target="smtp" label="Test SMTP login">
                  <p className="text-xs text-muted-foreground">
                    Save first. Checks host, port, username, and password without sending mail.
                  </p>
                </TestRow>
                <TestRow target="email" label="Send test email">
                  <Label htmlFor="test_to">Send a test to</Label>
                  <Input
                    id="test_to"
                    name="test_to"
                    type="email"
                    placeholder={agent?.email || "you@example.com"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Save first. Blank sends to your agent login ({agent?.email}).
                  </p>
                </TestRow>
              </CardContent>
            </Card>
          ) : null,
          ai: isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>AI</CardTitle>
                <CardDescription>
                  Gemini powers Draft with AI on the ticket reply box. Use the same key as
                  discovery-bible-platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={saveAiSettingsAction} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="gemini_api_key">Gemini API key</Label>
                      <Input
                        id="gemini_api_key"
                        name="gemini_api_key"
                        type="password"
                        autoComplete="off"
                        placeholder={masked[SETTING_KEYS.geminiApiKey] || "AIza…"}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to keep the current key.
                        {sourceHint(fromEnv[SETTING_KEYS.geminiApiKey])}
                      </p>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="gemini_model_fallback">Model fallback</Label>
                      <Input
                        id="gemini_model_fallback"
                        name="gemini_model_fallback"
                        placeholder="gemini-3.1-flash-lite,gemini-2.5-flash,…"
                        defaultValue={values[SETTING_KEYS.geminiModelFallback]}
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional comma-separated chain. The first model is used for the connection test.
                        {sourceHint(fromEnv[SETTING_KEYS.geminiModelFallback])}
                      </p>
                    </div>
                  </div>
                  <Button type="submit">Save AI settings</Button>
                </form>
                <TestRow target="gemini" label="Test Gemini">
                  <p className="text-xs text-muted-foreground">
                    Save first. Sends a short ping to the first model in the fallback list.
                  </p>
                </TestRow>
              </CardContent>
            </Card>
          ) : null,
          ingest: isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>App ingest</CardTitle>
                <CardDescription>
                  Discovery Bible posts feedback to{" "}
                  <code className="font-mono text-xs">POST /api/ingest/tickets</code> with this Bearer token.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={saveIngestSettingsAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ingest_key">Ingest API key</Label>
                    <Input
                      id="ingest_key"
                      name="ingest_key"
                      type="password"
                      autoComplete="off"
                      placeholder={masked[SETTING_KEYS.ingestKey] || "Set a long random key"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to keep the current key.
                      {sourceHint(fromEnv[SETTING_KEYS.ingestKey])}
                    </p>
                  </div>
                  <Button type="submit">Save ingest key</Button>
                </form>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    On the Discovery Bible app set{" "}
                    <code className="font-mono text-xs">CRM_INGEST_URL</code> to this desk’s ingest URL and match
                    the saved key.
                  </p>
                  <p>
                    Local example:{" "}
                    <code className="font-mono text-xs">http://localhost:3000/api/ingest/tickets</code>
                  </p>
                </div>
                <TestRow target="ingest" label="Test ingest key">
                  <p className="text-xs text-muted-foreground">
                    Save first. If a public app URL is set, this calls GET /api/ingest/tickets with the key.
                  </p>
                </TestRow>
              </CardContent>
            </Card>
          ) : null,
          freshdesk: isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>Freshdesk</CardTitle>
                <CardDescription>
                  Saved credentials for import. Test the API key here, then run the migration when you are ready.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={saveFreshdeskSettingsAction} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="freshdesk_url">Freshdesk URL</Label>
                      <Input
                        id="freshdesk_url"
                        name="freshdesk_url"
                        placeholder="https://yourcompany.freshdesk.com"
                        defaultValue={values[SETTING_KEYS.freshdeskUrl]}
                      />
                      {sourceHint(fromEnv[SETTING_KEYS.freshdeskUrl])}
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="freshdesk_api_key">API key</Label>
                      <Input
                        id="freshdesk_api_key"
                        name="freshdesk_api_key"
                        type="password"
                        autoComplete="off"
                        placeholder={masked[SETTING_KEYS.freshdeskApiKey] || "From Freshdesk → Profile → API Key"}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to keep the current key.
                        {sourceHint(fromEnv[SETTING_KEYS.freshdeskApiKey])}
                      </p>
                    </div>
                  </div>
                  <Button type="submit">Save Freshdesk settings</Button>
                </form>
                <TestRow target="freshdesk" label="Test Freshdesk">
                  <p className="text-xs text-muted-foreground">
                    Save first. Lists one ticket from the Freshdesk API to confirm the key.
                  </p>
                </TestRow>
                <Button nativeButton={false} render={<Link href="/crm/settings/migrate" />} variant="outline">
                  Open migration
                </Button>
              </CardContent>
            </Card>
          ) : null,
          team: teamPanel,
          content: contentPanel,
        }}
      />
      </Suspense>
    </div>
  );
}
