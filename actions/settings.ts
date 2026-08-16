"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/crm/auth";
import {
  createCannedResponse,
  createKbArticle,
  updateAgentProfile,
} from "@/lib/crm/queries";
import { grantDeskAccess } from "@/lib/crm/site-user";
import type { AgentRole } from "@/lib/crm/types";
import {
  CONNECTION_TAB,
  runConnectionTest,
  type ConnectionTarget,
} from "@/lib/crm/connection-tests";

async function requireAdmin() {
  const agent = await requireAgent();
  if (agent.role !== "admin") {
    redirect("/crm/settings?tab=team&error=admin");
  }
  return agent;
}

function settingsRedirect(
  tab: string,
  flash: { ok?: string; error?: string; detail?: string } = {},
): never {
  const params = new URLSearchParams();
  params.set("tab", tab);
  if (flash.ok) params.set("ok", flash.ok);
  if (flash.error) params.set("error", flash.error);
  if (flash.detail) {
    params.set("detail", flash.detail.replace(/[\r\n]+/g, " ").trim().slice(0, 160));
  }
  redirect(`/crm/settings?${params.toString()}`);
}

export async function grantDeskAccessAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "agent");
  const role: AgentRole = roleRaw === "admin" ? "admin" : "agent";

  if (!userId) {
    settingsRedirect("team", { error: "user" });
  }

  try {
    await grantDeskAccess(userId, role);
  } catch (error) {
    console.error("grant desk access failed", error);
    settingsRedirect("team", { error: "user" });
  }

  revalidatePath("/crm/settings");
  settingsRedirect("team", { ok: "granted" });
}

export async function updateAgentAction(formData: FormData) {
  await requireAdmin();
  const agentId = String(formData.get("agentId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "agent");
  const statusRaw = String(formData.get("status") ?? "online");

  if (!agentId || !name) {
    settingsRedirect("team", { error: "agent" });
  }

  const role: AgentRole = roleRaw === "admin" ? "admin" : "agent";
  const status =
    statusRaw === "away" || statusRaw === "offline" ? statusRaw : "online";

  await updateAgentProfile(agentId, { name, role, status });

  revalidatePath("/crm/settings");
  settingsRedirect("team", { ok: "updated" });
}

export async function updateMyStatusAction(formData: FormData) {
  const agent = await requireAgent();
  const statusRaw = String(formData.get("status") ?? "online");
  const status =
    statusRaw === "away" || statusRaw === "offline" ? statusRaw : "online";
  await updateAgentProfile(agent.id, { status });
  revalidatePath("/crm/dashboard");
  revalidatePath("/crm/tickets");
  revalidatePath("/crm/settings");
}

export async function createCannedResponseAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const shortcut = String(formData.get("shortcut") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) settingsRedirect("content", { error: "macro" });

  await createCannedResponse({
    title,
    shortcut: shortcut || null,
    body,
  });
  revalidatePath("/crm/settings");
  settingsRedirect("content", { ok: "macro" });
}

export async function createKbArticleAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  const category = String(formData.get("category") ?? "General").trim() || "General";
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !slug || !body) settingsRedirect("content", { error: "kb" });

  try {
    await createKbArticle({ title, slug, category, body });
  } catch (error) {
    console.error("create kb failed", error);
    settingsRedirect("content", { error: "kb" });
  }
  revalidatePath("/crm/settings");
  revalidatePath("/crm/knowledge");
  revalidatePath("/articles");
  settingsRedirect("content", { ok: "kb" });
}

export async function saveGeneralSettingsAction(formData: FormData) {
  await requireAdmin();
  const { SETTING_KEYS, setAppSettings } = await import("@/lib/crm/app-settings");
  await setAppSettings({
    [SETTING_KEYS.appUrl]: String(formData.get("app_url") ?? ""),
    [SETTING_KEYS.cookieSecure]: String(formData.get("cookie_secure") ?? ""),
  });
  revalidatePath("/crm/settings");
  settingsRedirect("general", { ok: "general" });
}

export async function saveAiSettingsAction(formData: FormData) {
  await requireAdmin();
  const { SETTING_KEYS, setAppSettings } = await import("@/lib/crm/app-settings");
  await setAppSettings({
    [SETTING_KEYS.geminiApiKey]: String(formData.get("gemini_api_key") ?? ""),
    [SETTING_KEYS.geminiModelFallback]: String(formData.get("gemini_model_fallback") ?? ""),
  });
  revalidatePath("/crm/settings");
  settingsRedirect("ai", { ok: "ai" });
}

export async function saveIngestSettingsAction(formData: FormData) {
  await requireAdmin();
  const { SETTING_KEYS, setAppSettings } = await import("@/lib/crm/app-settings");
  await setAppSettings({
    [SETTING_KEYS.ingestKey]: String(formData.get("ingest_key") ?? ""),
  });
  revalidatePath("/crm/settings");
  settingsRedirect("ingest", { ok: "ingest" });
}

export async function saveFreshdeskSettingsAction(formData: FormData) {
  await requireAdmin();
  const { SETTING_KEYS, setAppSettings } = await import("@/lib/crm/app-settings");
  await setAppSettings({
    [SETTING_KEYS.freshdeskUrl]: String(formData.get("freshdesk_url") ?? ""),
    [SETTING_KEYS.freshdeskApiKey]: String(formData.get("freshdesk_api_key") ?? ""),
  });
  revalidatePath("/crm/settings");
  settingsRedirect("freshdesk", { ok: "freshdesk" });
}

export async function saveEmailSettingsAction(formData: FormData) {
  await requireAdmin();
  const { SETTING_KEYS, setAppSettings } = await import("@/lib/crm/app-settings");
  const port = String(formData.get("smtp_port") ?? "").trim() || "587";
  await setAppSettings({
    [SETTING_KEYS.emailFrom]: String(formData.get("email_from") ?? ""),
    [SETTING_KEYS.notifyTo]: String(formData.get("notify_to") ?? ""),
    [SETTING_KEYS.smtpHost]: String(formData.get("smtp_host") ?? ""),
    [SETTING_KEYS.smtpPort]: port,
    [SETTING_KEYS.smtpUser]: String(formData.get("smtp_user") ?? ""),
    [SETTING_KEYS.smtpPass]: String(formData.get("smtp_pass") ?? ""),
    [SETTING_KEYS.smtpSecure]: String(formData.get("smtp_secure") ?? "0"),
    [SETTING_KEYS.resendApiKey]: String(formData.get("resend_api_key") ?? ""),
  });
  revalidatePath("/crm/settings");
  settingsRedirect("email", { ok: "email" });
}

export async function testConnectionAction(formData: FormData) {
  const agent = await requireAdmin();
  const target = String(formData.get("target") ?? "") as ConnectionTarget;
  const tab = CONNECTION_TAB[target] ?? "general";
  if (!CONNECTION_TAB[target]) {
    settingsRedirect("general", { error: "test" });
  }
  const to = String(formData.get("test_to") ?? "").trim() || agent.email;
  try {
    const detail = await runConnectionTest(target, { to });
    settingsRedirect(tab, { ok: `${target}test`, detail });
  } catch (error) {
    console.error("connection test failed", target, error);
    const detail = error instanceof Error ? error.message : "Connection test failed.";
    settingsRedirect(tab, { error: `${target}test`, detail });
  }
}
