export const SETTINGS_TABS = [
  { id: "general", label: "General", adminOnly: true },
  { id: "email", label: "Email", adminOnly: true },
  { id: "ai", label: "AI", adminOnly: true },
  { id: "ingest", label: "Ingest", adminOnly: true },
  { id: "freshdesk", label: "Freshdesk", adminOnly: true },
  { id: "team", label: "Team", adminOnly: false },
  { id: "content", label: "Content", adminOnly: false },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export function parseSettingsTab(
  raw: string | string[] | undefined | null,
  isAdmin: boolean,
): SettingsTabId {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const allowed = SETTINGS_TABS.filter((tab) => isAdmin || !tab.adminOnly).map((tab) => tab.id);
  if (value && allowed.includes(value as SettingsTabId)) return value as SettingsTabId;
  return isAdmin ? "general" : "team";
}

export function queryParam(params: object, key: string): string | undefined {
  const value = (params as Record<string, unknown>)[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}
