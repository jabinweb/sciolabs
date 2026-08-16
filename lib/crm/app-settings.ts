import { eq } from "drizzle-orm";
import { db, ensureDb } from "@/lib/crm/db";
import { appSettings } from "@/db/schema";

export const SETTING_KEYS = {
  appUrl: "app_url",
  ingestKey: "ingest_key",
  resendApiKey: "resend_api_key",
  emailFrom: "email_from",
  notifyTo: "notify_to",
  smtpHost: "smtp_host",
  smtpPort: "smtp_port",
  smtpUser: "smtp_user",
  smtpPass: "smtp_pass",
  smtpSecure: "smtp_secure",
  cookieSecure: "cookie_secure",
  geminiApiKey: "gemini_api_key",
  geminiModelFallback: "gemini_model_fallback",
  freshdeskUrl: "freshdesk_url",
  freshdeskApiKey: "freshdesk_api_key",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export type AppSettingsMap = Record<SettingKey, string>;

const SECRET_KEYS = new Set<SettingKey>([
  SETTING_KEYS.ingestKey,
  SETTING_KEYS.resendApiKey,
  SETTING_KEYS.smtpPass,
  SETTING_KEYS.geminiApiKey,
  SETTING_KEYS.freshdeskApiKey,
]);

const ENV_FALLBACK: Record<SettingKey, string[]> = {
  app_url: ["APP_URL", "COOLIFY_URL", "NEXT_PUBLIC_APP_URL"],
  ingest_key: ["CRM_INGEST_KEY"],
  resend_api_key: ["RESEND_API_KEY"],
  email_from: ["EMAIL_FROM", "CRM_EMAIL_FROM"],
  notify_to: ["CRM_NOTIFY_TO", "CRM_ADMIN_EMAIL"],
  smtp_host: ["SMTP_HOST"],
  smtp_port: ["SMTP_PORT"],
  smtp_user: ["SMTP_USER", "SMTP_USERNAME"],
  smtp_pass: ["SMTP_PASS", "SMTP_PASSWORD"],
  smtp_secure: ["SMTP_SECURE"],
  cookie_secure: ["CRM_COOKIE_SECURE"],
  gemini_api_key: ["GEMINI_API_KEY"],
  gemini_model_fallback: ["GEMINI_MODEL_FALLBACK"],
  freshdesk_url: ["FRESHDESK_URL"],
  freshdesk_api_key: ["FRESHDESK_API_KEY"],
};

function envFallback(key: SettingKey): string {
  for (const name of ENV_FALLBACK[key]) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export async function getSetting(key: SettingKey): Promise<string> {
  await ensureDb();
  try {
    const [row] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, key))
      .limit(1);
    const stored = row?.value?.trim() ?? "";
    if (stored) return stored;
  } catch {
    // Table may not exist yet on first boot before patch — fall through to env.
  }
  return envFallback(key);
}

export async function getAppSettings(): Promise<AppSettingsMap> {
  await ensureDb();
  const map = {} as AppSettingsMap;
  for (const key of Object.values(SETTING_KEYS)) {
    map[key] = envFallback(key);
  }
  try {
    const rows = await db.select().from(appSettings);
    for (const row of rows) {
      if ((Object.values(SETTING_KEYS) as string[]).includes(row.key) && row.value.trim()) {
        map[row.key as SettingKey] = row.value;
      }
    }
  } catch {
    // ignore until table exists
  }
  return map;
}

export async function setAppSettings(values: Partial<AppSettingsMap>) {
  await ensureDb();
  const now = new Date();
  for (const [key, raw] of Object.entries(values) as [SettingKey, string | undefined][]) {
    if (raw === undefined) continue;
    // Empty secret fields mean “leave unchanged”
    if (SECRET_KEYS.has(key) && raw.trim() === "") continue;
    const value = raw.trim();
    await db
      .insert(appSettings)
      .values({ key, value, updatedAt: now })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value, updatedAt: now },
      });
  }
}

export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function isSecretSetting(key: SettingKey): boolean {
  return SECRET_KEYS.has(key);
}

/** Form display: show masked placeholder for secrets that already have a value. */
export async function getSettingsForAdminForm(): Promise<{
  values: AppSettingsMap;
  masked: Partial<Record<SettingKey, string>>;
  fromEnv: Partial<Record<SettingKey, boolean>>;
}> {
  const values = await getAppSettings();
  const masked: Partial<Record<SettingKey, string>> = {};
  const fromEnv: Partial<Record<SettingKey, boolean>> = {};

  await ensureDb();
  let storedKeys = new Set<string>();
  try {
    const rows = await db.select({ key: appSettings.key, value: appSettings.value }).from(appSettings);
    storedKeys = new Set(rows.filter((r) => r.value.trim()).map((r) => r.key));
  } catch {
    storedKeys = new Set();
  }

  for (const key of Object.values(SETTING_KEYS)) {
    fromEnv[key] = !storedKeys.has(key) && Boolean(envFallback(key));
    if (SECRET_KEYS.has(key) && values[key]) {
      masked[key] = maskSecret(values[key]);
    }
  }

  return { values, masked, fromEnv };
}
