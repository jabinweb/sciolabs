import { db, ensureDb } from "@/lib/crm/db";
import { appSettings } from "@/db/schema";
import { getSetting, SETTING_KEYS } from "@/lib/crm/app-settings";
import { appBaseUrl } from "@/lib/crm/app-url";
import { resolveDatabaseUrl, shouldUseLocalFileDb } from "@/lib/crm/database-url";
import { verifyGeminiConnection } from "@/lib/crm/ai/gemini";
import { sendTestEmail, verifyMailConnection } from "@/lib/crm/email";
import { FreshdeskClient, normalizeFreshdeskApiKey, normalizeFreshdeskBaseUrl } from "@/lib/crm/freshdesk/client";

export type ConnectionTarget =
  | "database"
  | "appurl"
  | "smtp"
  | "email"
  | "gemini"
  | "ingest"
  | "freshdesk";

export const CONNECTION_TAB: Record<ConnectionTarget, string> = {
  database: "general",
  appurl: "general",
  smtp: "email",
  email: "email",
  gemini: "ai",
  ingest: "ingest",
  freshdesk: "freshdesk",
};

export async function runConnectionTest(
  target: ConnectionTarget,
  opts: { to?: string } = {},
): Promise<string> {
  switch (target) {
    case "database":
      return verifyDatabaseConnection();
    case "appurl":
      return verifyAppUrlConnection();
    case "smtp":
      return verifyMailConnection();
    case "email":
      await sendTestEmail(opts.to ?? "");
      return `Test email sent to ${opts.to}`;
    case "gemini":
      return verifyGeminiConnection();
    case "ingest":
      return verifyIngestConnection();
    case "freshdesk":
      return verifyFreshdeskConnection();
    default:
      throw new Error("Unknown connection test.");
  }
}

async function verifyDatabaseConnection() {
  await ensureDb();
  await db.select({ key: appSettings.key }).from(appSettings).limit(1);
  if (shouldUseLocalFileDb()) return "Connected to local PGlite";
  try {
    const host = new URL(resolveDatabaseUrl().replace(/^postgres(ql)?:/i, "http:")).host;
    return `Connected to Postgres at ${host}`;
  } catch {
    return "Connected to Postgres";
  }
}

async function verifyAppUrlConnection() {
  const base = await appBaseUrl();
  const response = await fetch(base, {
    method: "GET",
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (response.status >= 500) {
    throw new Error(`${base} returned ${response.status}.`);
  }
  return `${base} responded (${response.status})`;
}

async function verifyIngestConnection() {
  const key = await getSetting(SETTING_KEYS.ingestKey);
  if (!key) throw new Error("Save an ingest API key first.");

  const publicUrl = (await getSetting(SETTING_KEYS.appUrl)).replace(/\/$/, "");
  if (publicUrl) {
    const remote = await fetch(`${publicUrl}/api/ingest/tickets`, {
      method: "GET",
      headers: { authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (remote.status === 401) {
      throw new Error("Public URL reached ingest but rejected the key. Save the same key the app uses.");
    }
    if (!remote.ok) {
      throw new Error(`Ingest at ${publicUrl} returned ${remote.status}.`);
    }
    return `Ingest accepted the key at ${publicUrl}`;
  }

  return "Ingest API key is saved. Set a public app URL under General to test the live endpoint.";
}

async function verifyFreshdeskConnection() {
  const url =
    (await getSetting(SETTING_KEYS.freshdeskUrl)) ||
    process.env.FRESHDESK_URL ||
    "https://discoverybible.freshdesk.com";
  const apiKey =
    (await getSetting(SETTING_KEYS.freshdeskApiKey)) || process.env.FRESHDESK_API_KEY || "";
  if (!apiKey.trim()) throw new Error("Save a Freshdesk API key first.");
  const baseUrl = normalizeFreshdeskBaseUrl(url);
  const client = new FreshdeskClient(baseUrl, normalizeFreshdeskApiKey(apiKey));
  await client.verify();
  return `Connected to ${baseUrl}`;
}
