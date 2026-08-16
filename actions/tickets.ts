"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/crm/auth";
import {
  addMessage,
  createAgentTicket,
  updateTicketFields,
} from "@/lib/crm/queries";
import type { TicketPriority, TicketStatus, TicketType } from "@/lib/crm/types";

function revalidateTicket(ticketId: string) {
  revalidatePath(`/crm/tickets/${ticketId}`);
  revalidatePath("/crm/tickets");
  revalidatePath("/crm/tickets/board");
  revalidatePath("/crm/dashboard");
}

export async function replyToTicketAction(formData: FormData) {
  const agent = await requireAgent();
  const ticketId = String(formData.get("ticketId") ?? "");
  const body = String(formData.get("body") ?? "");
  const isInternal = String(formData.get("mode") ?? "public") === "internal";
  const afterRaw = String(formData.get("afterStatus") ?? "");
  const afterStatus = ["open", "pending", "resolved", "closed"].includes(afterRaw)
    ? (afterRaw as TicketStatus)
    : undefined;
  const assignToAgent = String(formData.get("assignToMe") ?? "") === "1";

  await addMessage({
    ticketId,
    agent,
    body,
    isInternal,
    afterStatus,
    assignToAgent,
  });
  revalidateTicket(ticketId);
}

export async function updateTicketAction(formData: FormData) {
  const agent = await requireAgent();
  const ticketId = String(formData.get("ticketId") ?? "");
  const status = String(formData.get("status") ?? "") as TicketStatus;
  const priority = String(formData.get("priority") ?? "") as TicketPriority;
  const type = String(formData.get("type") ?? "") as TicketType;
  const assigneeRaw = String(formData.get("assigneeId") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await updateTicketFields(
    ticketId,
    {
      status: ["open", "pending", "resolved", "closed"].includes(status) ? status : undefined,
      priority: ["low", "medium", "high", "urgent"].includes(priority) ? priority : undefined,
      type: ["question", "bug", "feature", "billing", "general"].includes(type) ? type : undefined,
      assigneeId: assigneeRaw === "" ? null : assigneeRaw,
      tags,
    },
    agent,
  );
  revalidateTicket(ticketId);
}

export async function assignToMeAction(formData: FormData) {
  const agent = await requireAgent();
  const ticketId = String(formData.get("ticketId") ?? "");
  await updateTicketFields(ticketId, { assigneeId: agent.id }, agent);
  revalidateTicket(ticketId);
}

export async function moveTicketStatusAction(formData: FormData) {
  const agent = await requireAgent();
  const ticketId = String(formData.get("ticketId") ?? "");
  const statusRaw = String(formData.get("status") ?? "");
  const status = ["open", "pending", "resolved", "closed"].includes(statusRaw)
    ? (statusRaw as TicketStatus)
    : null;
  if (!ticketId || !status) return;
  await updateTicketFields(ticketId, { status }, agent);
  revalidateTicket(ticketId);
}

export async function createTicketAction(formData: FormData) {
  const agent = await requireAgent();
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const type = String(formData.get("type") ?? "general") as TicketType;
  const priority = String(formData.get("priority") ?? "medium") as TicketPriority;
  if (!email || !subject || !body) {
    redirect("/crm/tickets/new?error=1");
  }
  const id = await createAgentTicket({
    agent,
    email,
    name,
    subject,
    body,
    type: ["question", "bug", "feature", "billing", "general"].includes(type) ? type : "general",
    priority: ["low", "medium", "high", "urgent"].includes(priority) ? priority : "medium",
  });
  revalidatePath("/crm/tickets");
  revalidatePath("/crm/tickets/board");
  revalidatePath("/crm/contacts");
  revalidatePath("/crm/dashboard");
  redirect(`/crm/tickets/${id}`);
}
