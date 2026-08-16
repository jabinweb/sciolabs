"use server";

import { requireAgent } from "@/lib/crm/auth";
import { generateSupportText } from "@/lib/crm/ai/gemini";
import { getTicket, listMessages } from "@/lib/crm/queries";
import { listPublishedArticles } from "@/lib/crm/portal";

export async function draftTicketReplyAction(ticketId: string): Promise<{
  ok: true;
  draft: string;
  model: string;
} | { ok: false; error: string }> {
  await requireAgent();
  if (!ticketId) return { ok: false, error: "Missing ticket" };

  try {
    const ticket = await getTicket(ticketId);
    if (!ticket) return { ok: false, error: "Ticket not found" };
    const messages = await listMessages(ticketId);

    const articles = (await listPublishedArticles()).slice(0, 8);
    const kbBlock = articles.length
      ? articles
          .map((a) => `- ${a.title} (${a.category}): ${a.body.slice(0, 280)}`)
          .join("\n")
      : "(No published knowledge articles yet.)";

    const thread = messages
      .filter((m) => !m.isInternal)
      .slice(-12)
      .map((m) => `${m.authorType}/${m.authorName}: ${m.body}`)
      .join("\n\n");

    const systemPrompt = [
      "You are a Discovery Bible support agent assistant.",
      "Draft a polite, accurate public reply the human agent can edit before sending.",
      "Use plain text only. Do not invent product features, license terms, or refunds.",
      "If uncertain, ask one clarifying question.",
      "Keep the draft under 220 words.",
      "Match a warm ministry/support tone without being preachy.",
    ].join(" ");

    const userMessage = [
      `Ticket #${ticket.number}`,
      `Subject: ${ticket.subject}`,
      `Type: ${ticket.type} · Priority: ${ticket.priority} · Status: ${ticket.status}`,
      `Contact: ${ticket.contactName || "Unknown"} <${ticket.contactEmail || "n/a"}>`,
      `License: ${ticket.licenseTier || "unknown"}`,
      "",
      "Description:",
      ticket.description,
      "",
      "Recent public thread:",
      thread || "(no messages yet)",
      "",
      "Relevant knowledge base snippets:",
      kbBlock,
      "",
      "Write the customer-facing reply draft now.",
    ].join("\n");

    const { text, model } = await generateSupportText({ systemPrompt, userMessage });
    return { ok: true, draft: text, model };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI draft failed";
    if (/GEMINI_API_KEY/i.test(message)) {
      return {
        ok: false,
        error: "Add a Gemini API key under Settings → Integrations (or GEMINI_API_KEY).",
      };
    }
    console.error("draftTicketReplyAction", error);
    return { ok: false, error: message.slice(0, 200) };
  }
}
