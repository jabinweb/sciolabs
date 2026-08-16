import { getSetting, SETTING_KEYS } from "@/lib/crm/app-settings";

/** Public base URL for links in emails and redirects (no trailing slash). */
export async function appBaseUrl(): Promise<string> {
  const stored = await getSetting(SETTING_KEYS.appUrl);
  if (stored) return stored.replace(/\/$/, "");
  return "http://localhost:3000";
}

export async function helpTicketUrl(ticketId: string): Promise<string> {
  return `${await appBaseUrl()}/support/tickets/${ticketId}`;
}

export async function deskTicketUrl(ticketId: string): Promise<string> {
  return `${await appBaseUrl()}/crm/tickets/${ticketId}`;
}
