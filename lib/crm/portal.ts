import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, ensureDb } from "@/lib/crm/db";
import { contacts, ticketMessages, tickets } from "@/db/schema";
import {
  decodePortalSession,
  encodePortalSession,
  PORTAL_COOKIE,
} from "@/lib/crm/portal-session";
import { sessionCookieSecure } from "@/lib/crm/cookie-secure";
import type { TicketPriority, TicketStatus, TicketType } from "@/lib/crm/types";
import { slaDueDatesFor } from "@/lib/crm/sla";
import { runAutomations } from "@/lib/crm/automations";
import {
  notifyAgentsCustomerReply,
  notifyAgentsNewTicket,
  notifyCustomerTicketCreated,
} from "@/lib/crm/email";

export async function getPortalEmail(): Promise<string | null> {
  if (process.env.NEXT_PHASE === "phase-production-build") return null;
  await ensureDb();
  const token = (await cookies()).get(PORTAL_COOKIE)?.value;
  return decodePortalSession(token);
}

export async function requirePortalEmail(): Promise<string> {
  const email = await getPortalEmail();
  if (!email) redirect("/support/signin");
  return email;
}

export async function setPortalCookie(email: string) {
  (await cookies()).set(PORTAL_COOKIE, encodePortalSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: await sessionCookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearPortalCookie() {
  (await cookies()).delete(PORTAL_COOKIE);
}

export async function findOrCreatePortalContact(opts: {
  email: string;
  name?: string;
}) {
  await ensureDb();
  const email = opts.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(contacts)
    .where(sql`lower(${contacts.email}) = ${email}`)
    .limit(1);
  if (existing) {
    if (opts.name?.trim() && opts.name.trim() !== existing.name) {
      await db
        .update(contacts)
        .set({ name: opts.name.trim(), updatedAt: new Date(), lastSeenAt: new Date() })
        .where(eq(contacts.id, existing.id));
    } else {
      await db
        .update(contacts)
        .set({ lastSeenAt: new Date(), updatedAt: new Date() })
        .where(eq(contacts.id, existing.id));
    }
    return existing.id;
  }
  const [created] = await db
    .insert(contacts)
    .values({
      email,
      name: opts.name?.trim() || email,
      tags: ["portal"],
      lastSeenAt: new Date(),
    })
    .returning();
  return created.id;
}

export async function createPortalTicket(opts: {
  email: string;
  name?: string;
  subject: string;
  body: string;
  type: TicketType;
}) {
  const contactId = await findOrCreatePortalContact({
    email: opts.email,
    name: opts.name,
  });
  const createdAt = new Date();
  const dues = await slaDueDatesFor(createdAt, "medium");
  const [ticket] = await db
    .insert(tickets)
    .values({
      contactId,
      subject: opts.subject.trim(),
      description: opts.body.trim(),
      status: "open",
      priority: "medium" satisfies TicketPriority,
      type: opts.type,
      source: "portal",
      tags: ["portal"],
      createdAt,
      ...dues,
    })
    .returning();

  await db.insert(ticketMessages).values({
    ticketId: ticket.id,
    authorType: "contact",
    authorId: contactId,
    authorName: opts.name?.trim() || opts.email,
    body: opts.body.trim(),
    isInternal: false,
  });

  void notifyCustomerTicketCreated({
    to: opts.email,
    ticketId: ticket.id,
    ticketNumber: ticket.number,
    subject: ticket.subject,
  });
  void notifyAgentsNewTicket({
    ticketId: ticket.id,
    ticketNumber: ticket.number,
    subject: ticket.subject,
    contactEmail: opts.email,
    preview: opts.body,
  });

  await runAutomations("ticket_created", ticket.id);

  return ticket;
}

export async function listPortalTickets(email: string) {
  await ensureDb();
  const rows = await db
    .select({
      ticket: tickets,
      contactEmail: contacts.email,
      contactName: contacts.name,
    })
    .from(tickets)
    .innerJoin(contacts, eq(tickets.contactId, contacts.id))
    .where(sql`lower(${contacts.email}) = ${email.toLowerCase()}`)
    .orderBy(desc(tickets.updatedAt))
    .limit(100);

  return rows.map((row) => ({
    id: row.ticket.id,
    number: row.ticket.number,
    subject: row.ticket.subject,
    status: row.ticket.status as TicketStatus,
    priority: row.ticket.priority as TicketPriority,
    type: row.ticket.type as TicketType,
    updatedAt: row.ticket.updatedAt,
    createdAt: row.ticket.createdAt,
    contactName: row.contactName,
    contactEmail: row.contactEmail,
  }));
}

export async function getPortalTicket(email: string, ticketId: string) {
  await ensureDb();
  const [row] = await db
    .select({
      ticket: tickets,
      contactEmail: contacts.email,
      contactName: contacts.name,
      contactId: contacts.id,
    })
    .from(tickets)
    .innerJoin(contacts, eq(tickets.contactId, contacts.id))
    .where(
      and(
        eq(tickets.id, ticketId),
        sql`lower(${contacts.email}) = ${email.toLowerCase()}`,
      ),
    )
    .limit(1);
  if (!row) return null;

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(
      and(eq(ticketMessages.ticketId, ticketId), eq(ticketMessages.isInternal, false)),
    )
    .orderBy(ticketMessages.createdAt);

  return {
    ticket: {
      id: row.ticket.id,
      number: row.ticket.number,
      subject: row.ticket.subject,
      description: row.ticket.description,
      status: row.ticket.status as TicketStatus,
      priority: row.ticket.priority as TicketPriority,
      type: row.ticket.type as TicketType,
      createdAt: row.ticket.createdAt,
      updatedAt: row.ticket.updatedAt,
      contactName: row.contactName,
      contactEmail: row.contactEmail,
      contactId: row.contactId,
      csatScore: row.ticket.csatScore,
      csatComment: row.ticket.csatComment,
    },
    messages: messages.map((m) => ({
      id: m.id,
      authorType: m.authorType,
      authorName: m.authorName,
      body: m.body,
      createdAt: m.createdAt,
    })),
  };
}

export async function addPortalReply(opts: {
  email: string;
  ticketId: string;
  body: string;
}) {
  const detail = await getPortalTicket(opts.email, opts.ticketId);
  if (!detail) throw new Error("Ticket not found");
  if (detail.ticket.status === "closed") {
    throw new Error("This ticket is closed");
  }

  await db.insert(ticketMessages).values({
    ticketId: opts.ticketId,
    authorType: "contact",
    authorId: detail.ticket.contactId,
    authorName: detail.ticket.contactName || opts.email,
    body: opts.body.trim(),
    isInternal: false,
  });

  await db
    .update(tickets)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, opts.ticketId));

  await runAutomations("customer_reply", opts.ticketId);

  void notifyAgentsCustomerReply({
    ticketId: opts.ticketId,
    ticketNumber: detail.ticket.number,
    subject: detail.ticket.subject,
    contactEmail: opts.email,
    body: opts.body,
  });
}

export async function setPortalCsat(opts: {
  email: string;
  ticketId: string;
  score: number;
  comment?: string;
}) {
  const detail = await getPortalTicket(opts.email, opts.ticketId);
  if (!detail) throw new Error("Ticket not found");
  if (detail.ticket.status !== "resolved" && detail.ticket.status !== "closed") {
    throw new Error("Rate only after the ticket is resolved");
  }
  const score = Math.min(5, Math.max(1, Math.round(opts.score)));
  await db
    .update(tickets)
    .set({
      csatScore: score,
      csatComment: opts.comment?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, opts.ticketId));
}

export async function listPublishedArticles(query?: string) {
  await ensureDb();
  const { listKbArticles } = await import("@/lib/crm/queries");
  const articles = await listKbArticles();
  const published = articles.filter((a) => a.published);
  const q = query?.trim().toLowerCase();
  if (!q) return published;
  return published.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q),
  );
}

export async function getPublishedArticle(slug: string) {
  const articles = await listPublishedArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
