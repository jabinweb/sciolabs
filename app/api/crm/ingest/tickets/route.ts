import { NextRequest } from "next/server";
import { getSetting, SETTING_KEYS } from "@/lib/crm/app-settings";
import { ingestTicket } from "@/lib/crm/queries";

export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function ingestToken(request: NextRequest) {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export async function GET(request: NextRequest) {
  const expected = await getSetting(SETTING_KEYS.ingestKey);
  const token = ingestToken(request);
  if (!expected || token !== expected) return unauthorized();
  return Response.json({ ok: true });
}

export async function POST(request: NextRequest) {
  const expected = await getSetting(SETTING_KEYS.ingestKey);
  const token = ingestToken(request);
  if (!expected || token !== expected) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.message !== "string") {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const ticket = await ingestTicket({
    appUserId: typeof body.appUserId === "string" ? body.appUserId : null,
    email: typeof body.email === "string" ? body.email : null,
    name: typeof body.name === "string" ? body.name : null,
    licenseTier: body.licenseTier === "FULL" || body.licenseTier === "FREE" ? body.licenseTier : null,
    subscriptionStatus: typeof body.subscriptionStatus === "string" ? body.subscriptionStatus : null,
    feedbackId: typeof body.feedbackId === "string" ? body.feedbackId : null,
    type: typeof body.type === "string" ? body.type : null,
    message: body.message,
    subject: typeof body.subject === "string" ? body.subject : null,
    path: typeof body.path === "string" ? body.path : null,
    source: body.source === "app" || body.source === "email" || body.source === "portal" ? body.source : "feedback",
  });

  return Response.json({ ok: true, id: ticket.id, number: ticket.number });
}
