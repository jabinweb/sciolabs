import nodemailer from "nodemailer";
import { Resend } from "resend";
import { getSetting, SETTING_KEYS } from "@/lib/crm/app-settings";
import { deskTicketUrl, helpTicketUrl } from "@/lib/crm/app-url";

async function fromAddress() {
  return (
    (await getSetting(SETTING_KEYS.emailFrom)) ||
    (await getSetting(SETTING_KEYS.smtpUser)) ||
    "ScioLabs Support <hello@sciolabs.in>"
  );
}

export async function mailTransportLabel() {
  const host = (await getSetting(SETTING_KEYS.smtpHost)).trim();
  if (host) return `SMTP (${host})`;
  if (await getSetting(SETTING_KEYS.resendApiKey)) return "Resend";
  return null;
}

async function smtpTransport() {
  const host = (await getSetting(SETTING_KEYS.smtpHost)).trim();
  if (!host) return null;
  const portRaw = (await getSetting(SETTING_KEYS.smtpPort)).trim();
  const port = Number(portRaw) || 587;
  const user = (await getSetting(SETTING_KEYS.smtpUser)).trim();
  const pass = await getSetting(SETTING_KEYS.smtpPass);
  const secureFlag = (await getSetting(SETTING_KEYS.smtpSecure)).trim();
  const secure = secureFlag === "1" || secureFlag === "true" || port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
  });
}

export async function verifyMailConnection() {
  const smtp = await smtpTransport();
  if (smtp) {
    await smtp.verify();
    const host = (await getSetting(SETTING_KEYS.smtpHost)).trim();
    return `SMTP accepted the login (${host})`;
  }

  const key = await getSetting(SETTING_KEYS.resendApiKey);
  if (!key) {
    throw new Error("Save an SMTP host (or a Resend API key) first.");
  }
  const response = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Resend rejected the API key (${response.status}).`);
  }
  return "Resend accepted the API key";
}

async function resendClient() {
  const key = await getSetting(SETTING_KEYS.resendApiKey);
  if (!key) return null;
  return new Resend(key);
}

async function sendEmail(
  opts: {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
  },
  throwOnError = false,
) {
  const from = await fromAddress();
  const html =
    opts.html ??
    `<pre style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(opts.text)}</pre>`;

  try {
    const smtp = await smtpTransport();
    if (smtp) {
      await smtp.sendMail({
        from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html,
      });
      return;
    }

    const client = await resendClient();
    if (!client) {
      if (throwOnError) {
        throw new Error("Save an SMTP host (or a Resend API key) in Settings → Email first.");
      }
      if (process.env.NODE_ENV !== "production") {
        console.info("[email:skip]", opts.subject, "→", opts.to);
      }
      return;
    }
    await client.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html,
    });
  } catch (error) {
    console.error("[email:fail]", opts.subject, error);
    if (throwOnError) throw error;
  }
}

export async function sendTestEmail(to: string) {
  const address = to.trim();
  if (!address) throw new Error("Enter an email address to send the test to.");
  await sendEmail(
    {
      to: address,
      subject: "ScioLabs CRM — test email",
      text: [
        "This is a test from ScioLabs CRM.",
        "",
        "If you received this, outgoing mail is working.",
        "",
        "— ScioLabs Support",
      ].join("\n"),
    },
    true,
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function ticketLabel(number: number) {
  return `#${number}`;
}

export async function notifyCustomerTicketCreated(opts: {
  to: string;
  ticketId: string;
  ticketNumber: number;
  subject: string;
}) {
  const link = await helpTicketUrl(opts.ticketId);
  const ref = ticketLabel(opts.ticketNumber);
  await sendEmail({
    to: opts.to,
    subject: `We received your request ${ref}: ${opts.subject}`,
    text: [
      `Thanks for contacting ScioLabs support.`,
      ``,
      `Ticket ${ref}: ${opts.subject}`,
      ``,
      `Track updates here:`,
      link,
      ``,
      `— ScioLabs Support`,
    ].join("\n"),
  });
}

export async function notifyCustomerAgentReply(opts: {
  to: string;
  ticketId: string;
  ticketNumber: number;
  subject: string;
  agentName: string;
  body: string;
}) {
  const link = await helpTicketUrl(opts.ticketId);
  const ref = ticketLabel(opts.ticketNumber);
  await sendEmail({
    to: opts.to,
    subject: `Reply on ${ref}: ${opts.subject}`,
    text: [
      `${opts.agentName} replied to your support ticket ${ref}.`,
      ``,
      opts.body.trim(),
      ``,
      `View and reply:`,
      link,
      ``,
      `— ScioLabs Support`,
    ].join("\n"),
  });
}

export async function notifyAgentsNewTicket(opts: {
  ticketId: string;
  ticketNumber: number;
  subject: string;
  contactEmail?: string | null;
  preview: string;
}) {
  const to = await getSetting(SETTING_KEYS.notifyTo);
  if (!to) return;
  const link = await deskTicketUrl(opts.ticketId);
  const ref = ticketLabel(opts.ticketNumber);
  await sendEmail({
    to,
    subject: `New ticket ${ref}: ${opts.subject}`,
    text: [
      `New support ticket ${ref}`,
      `From: ${opts.contactEmail || "unknown"}`,
      `Subject: ${opts.subject}`,
      ``,
      opts.preview.slice(0, 500),
      ``,
      `Open in desk:`,
      link,
    ].join("\n"),
  });
}

export async function notifyAgentsCustomerReply(opts: {
  ticketId: string;
  ticketNumber: number;
  subject: string;
  contactEmail: string;
  body: string;
}) {
  const to = await getSetting(SETTING_KEYS.notifyTo);
  if (!to) return;
  const link = await deskTicketUrl(opts.ticketId);
  const ref = ticketLabel(opts.ticketNumber);
  await sendEmail({
    to,
    subject: `Customer reply on ${ref}: ${opts.subject}`,
    text: [
      `${opts.contactEmail} replied on ${ref}.`,
      ``,
      opts.body.trim(),
      ``,
      `Open in desk:`,
      link,
    ].join("\n"),
  });
}
