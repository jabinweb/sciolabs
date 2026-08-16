"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addPortalReply,
  clearPortalCookie,
  createPortalTicket,
  setPortalCookie,
} from "@/lib/crm/portal";
import type { TicketType } from "@/lib/crm/types";

export async function portalLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    redirect("/support/signin?error=1");
  }
  await setPortalCookie(email);
  redirect("/support/tickets");
}

export async function portalLogoutAction() {
  await clearPortalCookie();
  redirect("/support");
}

export async function portalCreateTicketAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "general");
  const type = (
    ["question", "bug", "feature", "billing", "general"].includes(typeRaw)
      ? typeRaw
      : "general"
  ) as TicketType;

  if (!email || !subject || !body) {
    redirect("/support/tickets/new?error=1");
  }

  await setPortalCookie(email);
  const ticket = await createPortalTicket({ email, name, subject, body, type });
  revalidatePath("/support/tickets");
  redirect(`/support/tickets/${ticket.id}?ok=1`);
}

export async function portalReplyAction(formData: FormData) {
  const ticketId = String(formData.get("ticketId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!ticketId || !body || !email) {
    redirect(`/support/tickets/${ticketId}?error=1`);
  }
  try {
    await addPortalReply({ email, ticketId, body });
  } catch {
    redirect(`/support/tickets/${ticketId}?error=1`);
  }
  revalidatePath(`/support/tickets/${ticketId}`);
  revalidatePath("/support/tickets");
  redirect(`/support/tickets/${ticketId}`);
}

export async function portalCsatAction(formData: FormData) {
  const ticketId = String(formData.get("ticketId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const score = Number(formData.get("score") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();
  if (!ticketId || !email || !score) {
    redirect(`/support/tickets/${ticketId}?error=csat`);
  }
  try {
    const { setPortalCsat } = await import("@/lib/crm/portal");
    await setPortalCsat({ email, ticketId, score, comment });
  } catch {
    redirect(`/support/tickets/${ticketId}?error=csat`);
  }
  revalidatePath(`/support/tickets/${ticketId}`);
  redirect(`/support/tickets/${ticketId}?csat=1`);
}
