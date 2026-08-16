import { getSetting, SETTING_KEYS } from "@/lib/crm/app-settings";

/** Sync fallback for middleware / edge-adjacent paths that cannot await DB. */
export function sessionCookieSecureSync() {
  const override = process.env.CRM_COOKIE_SECURE?.trim().toLowerCase();
  if (override === "1" || override === "true") return true;
  if (override === "0" || override === "false") return false;
  const appUrl =
    process.env.APP_URL?.trim() ||
    process.env.COOLIFY_URL?.trim() ||
    "";
  if (/^https:\/\//i.test(appUrl)) return true;
  return false;
}

export async function sessionCookieSecure() {
  // Local `next dev` is HTTP — Secure cookies are never sent and cause auth loops.
  if (process.env.NODE_ENV !== "production") return false;

  const stored = (await getSetting(SETTING_KEYS.cookieSecure)).toLowerCase();
  if (stored === "1" || stored === "true") return true;
  if (stored === "0" || stored === "false") return false;
  const appUrl = await getSetting(SETTING_KEYS.appUrl);
  if (/^https:\/\//i.test(appUrl)) return true;
  return sessionCookieSecureSync();
}
