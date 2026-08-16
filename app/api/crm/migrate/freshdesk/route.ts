import { NextRequest } from "next/server";
import { getSessionAgent } from "@/lib/crm/auth";
import {
  advanceFreshdeskMigration,
  startFreshdeskMigration,
} from "@/lib/crm/freshdesk/migrate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function requireAdminAgent() {
  const agent = await getSessionAgent();
  if (!agent || agent.role !== "admin") return null;
  return agent;
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminAgent();
  if (!admin) {
    return Response.json({ error: "Admin sign-in required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.action !== "string") {
    return Response.json({ error: "action is required" }, { status: 400 });
  }

  try {
    if (body.action === "start") {
      const { getSetting, SETTING_KEYS } = await import("@/lib/crm/app-settings");
      const url =
        (typeof body.url === "string" ? body.url : "") ||
        (await getSetting(SETTING_KEYS.freshdeskUrl)) ||
        process.env.FRESHDESK_URL ||
        "https://yourcompany.freshdesk.com";
      const apiKey =
        (typeof body.apiKey === "string" ? body.apiKey : "") ||
        (await getSetting(SETTING_KEYS.freshdeskApiKey)) ||
        process.env.FRESHDESK_API_KEY ||
        "";
      const job = await startFreshdeskMigration({
        adminId: admin.id,
        url,
        apiKey,
      });
      return Response.json({ ok: true, job });
    }

    if (body.action === "next") {
      const jobId = typeof body.jobId === "string" ? body.jobId : "";
      if (!jobId) return Response.json({ error: "jobId is required" }, { status: 400 });
      const job = await advanceFreshdeskMigration(jobId, admin.id);
      return Response.json({ ok: true, job });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("freshdesk migrate", error);
    return Response.json({ error: message }, { status: 400 });
  }
}
