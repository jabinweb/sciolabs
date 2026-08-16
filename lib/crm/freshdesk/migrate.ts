import { randomBytes } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { db, ensureDb } from "@/lib/crm/db";
import { agents, contacts, ticketMessages, tickets } from "@/db/schema";
import type { TicketPriority, TicketStatus, TicketType } from "@/lib/crm/types";
import { slaDueDatesFor } from "@/lib/crm/sla";
import { hashPassword } from "@/lib/crm/password";
import { cleanMessageText, htmlToText } from "@/lib/crm/message-body";
import {
  FreshdeskApiError,
  FreshdeskClient,
  normalizeFreshdeskApiKey,
  normalizeFreshdeskBaseUrl,
  type FreshdeskAgent,
  type FreshdeskContact,
  type FreshdeskConversation,
  type FreshdeskTicket,
} from "./client";
import {
  appendLog,
  createMigrateJob,
  getMigrateJob,
  publicJob,
  type MigrateJob,
} from "./job-store";

const CONTACT_PAGE_SIZE = 100;
const TICKET_PAGE_SIZE = 100;
/** Tickets processed per UI batch request (each needs conversation fetches). */
const TICKETS_PER_BATCH = 15;
const TICKET_CONCURRENCY = 6;

function mapStatus(status: number): TicketStatus {
  if (status === 3) return "pending";
  if (status === 4) return "resolved";
  if (status === 5) return "closed";
  return "open";
}

function mapPriority(priority: number): TicketPriority {
  if (priority === 1) return "low";
  if (priority === 3) return "high";
  if (priority === 4) return "urgent";
  return "medium";
}

function mapType(type: string | null): TicketType {
  const value = (type ?? "").toLowerCase();
  if (value.includes("bug")) return "bug";
  if (value.includes("feature")) return "feature";
  if (value.includes("billing") || value.includes("payment")) return "billing";
  if (value.includes("question") || value.includes("how")) return "question";
  return "general";
}

function ticketBody(ticket: FreshdeskTicket) {
  const text =
    (ticket.description ? htmlToText(ticket.description) : "") ||
    cleanMessageText(ticket.description_text ?? "");
  return text || ticket.subject || `Freshdesk ticket #${ticket.id}`;
}

async function mapPool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>) {
  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, Math.max(1, items.length)) }, async () => {
    for (;;) {
      const current = index;
      index += 1;
      if (current >= items.length) return;
      await fn(items[current]);
    }
  });
  await Promise.all(workers);
}

function conversationBody(item: FreshdeskConversation) {
  return (
    (item.body ? htmlToText(item.body) : "") ||
    cleanMessageText(item.body_text ?? "") ||
    "(empty message)"
  );
}

export async function clearExistingTickets(job: MigrateJob) {
  await ensureDb();
  const [{ n }] = await db.select({ n: sql<number>`cast(count(*) as int)` }).from(tickets);
  await db.delete(ticketMessages);
  await db.delete(tickets);
  job.stats.ticketsCleared = n ?? 0;
  appendLog(
    job,
    "warn",
    `Cleared ${job.stats.ticketsCleared} existing ticket(s) and all ticket messages`,
  );
}

async function upsertContactFromFreshdesk(job: MigrateJob, contact: FreshdeskContact) {
  const email = contact.email?.trim().toLowerCase() || null;
  const name = contact.name?.trim() || email || `Freshdesk contact ${contact.id}`;
  const phone = contact.phone || contact.mobile || null;
  const tag = `freshdesk:${contact.id}`;
  const importedTags = (contact.tags ?? []).filter(Boolean);

  if (email) {
    const [existing] = await db
      .select()
      .from(contacts)
      .where(sql`lower(${contacts.email}) = ${email}`)
      .limit(1);
    if (existing) {
      const tags = Array.from(new Set([...(existing.tags ?? []), ...importedTags, tag, "freshdesk"]));
      await db
        .update(contacts)
        .set({
          name: contact.name?.trim() || existing.name,
          phone: phone ?? existing.phone,
          tags,
          updatedAt: new Date(),
        })
        .where(eq(contacts.id, existing.id));
      job.contactIdByFreshdeskId.set(contact.id, existing.id);
      return existing.id;
    }
  }

  const [created] = await db
    .insert(contacts)
    .values({
      email,
      name,
      phone,
      tags: Array.from(new Set([...importedTags, "freshdesk", tag])),
      createdAt: new Date(contact.created_at),
      updatedAt: new Date(contact.updated_at),
    })
    .returning();
  job.contactIdByFreshdeskId.set(contact.id, created.id);
  return created.id;
}

async function resolveContactId(
  job: MigrateJob,
  client: FreshdeskClient,
  requesterId: number | null,
) {
  if (!requesterId) return null;
  const cached = job.contactIdByFreshdeskId.get(requesterId);
  if (cached) return cached;
  try {
    job.stats.apiCalls += 1;
    const contact = await client.getContact(requesterId);
    return await upsertContactFromFreshdesk(job, contact);
  } catch (error) {
    job.stats.errors += 1;
    appendLog(
      job,
      "warn",
      `Could not load Freshdesk contact ${requesterId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

async function upsertCrmAgentFromFreshdesk(job: MigrateJob, agent: FreshdeskAgent) {
  const email = (agent.contact?.email || agent.email || "").trim().toLowerCase();
  const name = (agent.contact?.name || email || `Agent ${agent.id}`).trim();
  if (!email) return null;

  job.agentEmailById.set(agent.id, { email, name });

  const [existing] = await db
    .select()
    .from(agents)
    .where(sql`lower(${agents.email}) = ${email}`)
    .limit(1);
  if (existing) {
    if (name && name !== existing.name) {
      await db.update(agents).set({ name }).where(eq(agents.id, existing.id));
    }
    return existing.id;
  }

  const [created] = await db
    .insert(agents)
    .values({
      email,
      name,
      role: "agent",
      passwordHash: hashPassword(randomBytes(32).toString("hex")),
      status: "offline",
    })
    .returning();
  job.stats.agentsImported += 1;
  return created.id;
}

async function loadAgentMap(job: MigrateJob, client: FreshdeskClient) {
  try {
    job.stats.apiCalls += 1;
    const list = await client.listAgents(1, 100);
    let created = 0;
    for (const agent of list) {
      const before = job.stats.agentsImported;
      await upsertCrmAgentFromFreshdesk(job, agent);
      if (job.stats.agentsImported > before) created += 1;
    }
    appendLog(
      job,
      "info",
      `Loaded ${job.agentEmailById.size} Freshdesk agent(s); created ${created} CRM login(s) (passwords cannot be imported — set them in Settings)`,
    );
  } catch (error) {
    appendLog(
      job,
      "warn",
      `Could not list Freshdesk agents (assignees may be blank): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function resolveAssigneeId(job: MigrateJob, responderId: number | null) {
  if (!responderId) return null;
  const mapped = job.agentEmailById.get(responderId);
  if (!mapped?.email) return null;
  const cached = job.assigneeIdByResponderId.get(responderId);
  if (cached !== undefined) return cached;
  const [row] = await db
    .select({ id: agents.id })
    .from(agents)
    .where(sql`lower(${agents.email}) = ${mapped.email}`)
    .limit(1);
  const id = row?.id ?? null;
  job.assigneeIdByResponderId.set(responderId, id);
  return id;
}

async function importOneTicket(job: MigrateJob, client: FreshdeskClient, ticket: FreshdeskTicket) {
  const [already] = await db
    .select({ id: tickets.id })
    .from(tickets)
    .where(eq(tickets.number, ticket.id))
    .limit(1);
  if (already) return "skipped";

  const contactId = await resolveContactId(job, client, ticket.requester_id);
  const assigneeId = await resolveAssigneeId(job, ticket.responder_id);
  const description = ticketBody(ticket);
  const createdAt = new Date(ticket.created_at);
  const updatedAt = new Date(ticket.updated_at);
  const status = mapStatus(ticket.status);
  const priority = mapPriority(ticket.priority);
  const tags = Array.from(
    new Set([...(ticket.tags ?? []), "freshdesk", `freshdesk-ticket:${ticket.id}`]),
  );
  const dues = await slaDueDatesFor(createdAt, priority);

  const [created] = await db
    .insert(tickets)
    .values({
      number: ticket.id,
      contactId,
      assigneeId,
      subject: (ticket.subject || `Freshdesk #${ticket.id}`).slice(0, 500),
      description,
      status,
      priority,
      type: mapType(ticket.type),
      source: "email",
      tags,
      firstResponseAt: null,
      resolvedAt: status === "resolved" || status === "closed" ? updatedAt : null,
      createdAt,
      updatedAt,
      ...dues,
    })
    .returning();

  let contactName = "Contact";
  if (contactId) {
    const [row] = await db
      .select({ name: contacts.name })
      .from(contacts)
      .where(eq(contacts.id, contactId))
      .limit(1);
    contactName = row?.name || "Contact";
  }

  const messageRows: (typeof ticketMessages.$inferInsert)[] = [
    {
      ticketId: created.id,
      authorType: "contact",
      authorId: contactId,
      authorName: contactName,
      body: description,
      isInternal: false,
      createdAt,
    },
  ];

  let page = 1;
  let firstAgentReplyAt: Date | null = null;
  for (;;) {
    job.stats.apiCalls += 1;
    const conversations = await client.listConversations(ticket.id, page, 100);
    if (!conversations.length) break;

    for (const item of conversations) {
      const body = conversationBody(item);
      const at = new Date(item.created_at);
      const isAgent = !item.incoming;
      if (isAgent && !item.private && !firstAgentReplyAt) firstAgentReplyAt = at;

      const agentInfo = item.user_id ? job.agentEmailById.get(item.user_id) : null;
      messageRows.push({
        ticketId: created.id,
        authorType: item.private ? "agent" : isAgent ? "agent" : "contact",
        authorId: null,
        authorName: agentInfo?.name || (isAgent ? "Freshdesk agent" : contactName),
        body,
        isInternal: Boolean(item.private),
        createdAt: at,
      });
    }

    if (conversations.length < 100) break;
    page += 1;
  }

  const chunk = 80;
  for (let i = 0; i < messageRows.length; i += chunk) {
    await db.insert(ticketMessages).values(messageRows.slice(i, i + chunk));
  }
  job.stats.messagesImported += messageRows.length;

  if (firstAgentReplyAt) {
    await db
      .update(tickets)
      .set({ firstResponseAt: firstAgentReplyAt })
      .where(eq(tickets.id, created.id));
  }
  return "imported";
}

async function runContactsBatch(job: MigrateJob, client: FreshdeskClient) {
  job.stats.apiCalls += 1;
  const page = await client.listContacts(job.contactPage, CONTACT_PAGE_SIZE);
  if (!page.length) {
    appendLog(job, "success", "Contacts import finished");
    job.phase = "tickets";
    job.ticketPage = 1;
    job.ticketCursor = 0;
    job.ticketBuffer = [];
    return;
  }

  for (const contact of page) {
    try {
      await upsertContactFromFreshdesk(job, contact);
      job.stats.contactsImported += 1;
    } catch (error) {
      job.stats.errors += 1;
      appendLog(
        job,
        "error",
        `Contact ${contact.id} failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  appendLog(
    job,
    "info",
    `Imported contacts page ${job.contactPage} (${page.length} row(s), total ${job.stats.contactsImported})`,
  );
  job.contactPage += 1;
  if (page.length < CONTACT_PAGE_SIZE) {
    appendLog(job, "success", "Contacts import finished");
    job.phase = "tickets";
  }
}

async function runTicketsBatch(job: MigrateJob, client: FreshdeskClient) {
  if (job.ticketCursor >= job.ticketBuffer.length) {
    job.stats.apiCalls += 1;
    const page = await client.listTickets(job.ticketPage, TICKET_PAGE_SIZE);
    job.ticketBuffer = page;
    job.ticketCursor = 0;
    if (!page.length) {
      job.phase = "done";
      appendLog(
        job,
        "success",
        `Migration complete — ${job.stats.ticketsImported} tickets, ${job.stats.messagesImported} messages, ${job.stats.contactsImported} contacts, ${job.stats.errors} error(s)`,
      );
      return;
    }
    appendLog(job, "info", `Fetched tickets page ${job.ticketPage} (${page.length} ticket(s))`);
    job.ticketPage += 1;
  }

  const slice = job.ticketBuffer.slice(job.ticketCursor, job.ticketCursor + TICKETS_PER_BATCH);
  await mapPool(slice, TICKET_CONCURRENCY, async (ticket) => {
    try {
      const result = await importOneTicket(job, client, ticket);
      if (result === "imported") {
        job.stats.ticketsImported += 1;
        appendLog(job, "info", `Imported ticket #${ticket.id}: ${(ticket.subject || "").slice(0, 80)}`);
      }
    } catch (error) {
      job.stats.errors += 1;
      const message = error instanceof Error ? error.message : String(error);
      appendLog(job, "error", `Ticket #${ticket.id} failed: ${message}`);
      if (error instanceof FreshdeskApiError && error.status === 429) {
        appendLog(job, "warn", "Rate limited — next batch will retry with backoff");
      }
    }
  });
  job.ticketCursor += slice.length;

  if (
    job.ticketCursor >= job.ticketBuffer.length &&
    job.ticketBuffer.length < TICKET_PAGE_SIZE
  ) {
    job.phase = "done";
    appendLog(
      job,
      "success",
      `Migration complete — ${job.stats.ticketsImported} tickets, ${job.stats.messagesImported} messages, ${job.stats.contactsImported} contacts, ${job.stats.errors} error(s)`,
    );
  }
}

export async function startFreshdeskMigration(input: {
  adminId: string;
  url: string;
  apiKey: string;
}) {
  const baseUrl = normalizeFreshdeskBaseUrl(
    input.url || process.env.FRESHDESK_URL || "https://discoverybible.freshdesk.com",
  );
  const apiKey = normalizeFreshdeskApiKey(
    input.apiKey || process.env.FRESHDESK_API_KEY || "",
  );
  if (!apiKey) {
    throw new Error("Freshdesk API key is required (set FRESHDESK_API_KEY in .env or paste it here)");
  }

  const client = new FreshdeskClient(baseUrl, apiKey);
  await client.verify();

  const job = createMigrateJob({ adminId: input.adminId, baseUrl, apiKey });
  appendLog(job, "info", `Connected to ${baseUrl}`);
  await clearExistingTickets(job);
  await loadAgentMap(job, client);
  appendLog(job, "info", "Starting contact import…");
  return publicJob(job);
}

export async function advanceFreshdeskMigration(jobId: string, adminId: string) {
  const job = getMigrateJob(jobId);
  if (!job) throw new Error("Migration job not found or expired — start again");
  if (job.adminId !== adminId) throw new Error("Unauthorized migration job");
  if (job.phase === "done" || job.phase === "error") return publicJob(job);

  const client = new FreshdeskClient(job.baseUrl, job.apiKey);
  try {
    if (job.phase === "contacts") {
      await runContactsBatch(job, client);
    } else if (job.phase === "tickets") {
      await runTicketsBatch(job, client);
    }
  } catch (error) {
    job.stats.errors += 1;
    const message = error instanceof Error ? error.message : String(error);
    appendLog(job, "error", `Batch failed: ${message}`);
    if (error instanceof FreshdeskApiError && error.status === 401) {
      job.phase = "error";
      appendLog(job, "error", "Freshdesk rejected the API key — migration stopped");
    }
  }

  return publicJob(job);
}

export async function remapFreshdeskTicketNumbers() {
  await ensureDb();
  const rows = await db.select({ id: tickets.id, number: tickets.number, tags: tickets.tags }).from(tickets);
  let updated = 0;
  for (const row of rows) {
    const tag = (row.tags ?? []).find((t) => t.startsWith("freshdesk-ticket:"));
    if (!tag) continue;
    const fdId = Number(tag.slice("freshdesk-ticket:".length));
    if (!Number.isFinite(fdId) || row.number === fdId) continue;
    await db.update(tickets).set({ number: fdId, updatedAt: new Date() }).where(eq(tickets.id, row.id));
    updated += 1;
  }
  try {
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('tickets', 'number'), (SELECT COALESCE(MAX(number), 1001) FROM tickets))`,
    );
  } catch {
    // PGlite / identity sequence name may differ
  }
  return updated;
}

/** Pull every Freshdesk contact/ticket; skip rows already imported. Uses env key if args omitted. */
export async function syncAllFromFreshdesk(input?: { url?: string; apiKey?: string }) {
  await ensureDb();
  const remapped = await remapFreshdeskTicketNumbers();
  const baseUrl = normalizeFreshdeskBaseUrl(
    input?.url || process.env.FRESHDESK_URL || "https://discoverybible.freshdesk.com",
  );
  const apiKey = normalizeFreshdeskApiKey(input?.apiKey || process.env.FRESHDESK_API_KEY || "");
  if (!apiKey) throw new Error("FRESHDESK_API_KEY is required");

  const client = new FreshdeskClient(baseUrl, apiKey);
  await client.verify();

  const job = createMigrateJob({ adminId: "sync", baseUrl, apiKey });
  appendLog(job, "info", `Syncing from ${baseUrl} (remapped ${remapped} ticket number(s))`);
  await loadAgentMap(job, client);

  for (let page = 1; page < 500; page++) {
    job.stats.apiCalls += 1;
    const batch = await client.listContacts(page, CONTACT_PAGE_SIZE);
    if (!batch.length) break;
    await mapPool(batch, 8, async (contact) => {
      try {
        await upsertContactFromFreshdesk(job, contact);
        job.stats.contactsImported += 1;
      } catch (error) {
        job.stats.errors += 1;
        appendLog(
          job,
          "error",
          `Contact ${contact.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });
    appendLog(job, "info", `Contacts page ${page}: ${batch.length} (running ${job.stats.contactsImported})`);
    if (batch.length < CONTACT_PAGE_SIZE) break;
  }

  for (let page = 1; page < 500; page++) {
    job.stats.apiCalls += 1;
    const batch = await client.listTickets(page, TICKET_PAGE_SIZE);
    if (!batch.length) break;
    const existing = new Set(
      (
        await db
          .select({ number: tickets.number })
          .from(tickets)
          .where(inArray(tickets.number, batch.map((ticket) => ticket.id)))
      ).map((row) => row.number),
    );
    const pending = batch.filter((ticket) => !existing.has(ticket.id));
    appendLog(
      job,
      "info",
      `Tickets page ${page}: ${batch.length} listed, ${pending.length} new, ${existing.size} already imported`,
    );
    const started = Date.now();
    await mapPool(pending, TICKET_CONCURRENCY, async (ticket) => {
      try {
        const result = await importOneTicket(job, client, ticket);
        if (result === "imported") job.stats.ticketsImported += 1;
      } catch (error) {
        job.stats.errors += 1;
        appendLog(
          job,
          "error",
          `Ticket #${ticket.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });
    const elapsed = Math.max(1, (Date.now() - started) / 1000);
    appendLog(
      job,
      "info",
      `Page ${page} done in ${elapsed.toFixed(1)}s (${(pending.length / elapsed).toFixed(1)} tickets/s, total imported ${job.stats.ticketsImported})`,
    );
    if (batch.length < TICKET_PAGE_SIZE) break;
  }

  job.phase = "done";
  appendLog(
    job,
    "success",
    `Sync complete — ${job.stats.ticketsImported} tickets processed, ${job.stats.contactsImported} contacts, ${job.stats.errors} error(s)`,
  );
  return { remapped, job: publicJob(job) };
}

/** Create CRM agent logins from Freshdesk (email + name only) and map ticket assignees. */
export async function importFreshdeskAgentsFromEnv() {
  await ensureDb();
  const baseUrl = normalizeFreshdeskBaseUrl(
    process.env.FRESHDESK_URL || "https://discoverybible.freshdesk.com",
  );
  const apiKey = normalizeFreshdeskApiKey(process.env.FRESHDESK_API_KEY || "");
  if (!apiKey) throw new Error("FRESHDESK_API_KEY is required");

  const client = new FreshdeskClient(baseUrl, apiKey);
  await client.verify();
  const job = createMigrateJob({ adminId: "sync", baseUrl, apiKey });
  await loadAgentMap(job, client);

  let assigneesUpdated = 0;
  for (let page = 1; page < 50; page++) {
    job.stats.apiCalls += 1;
    const batch = await client.listTickets(page, 100);
    for (const ticket of batch) {
      const assigneeId = await resolveAssigneeId(job, ticket.responder_id);
      if (!assigneeId) continue;
      const tag = `freshdesk-ticket:${ticket.id}`;
      const [row] = await db
        .select({ id: tickets.id, assigneeId: tickets.assigneeId })
        .from(tickets)
        .where(sql`${tag} = any(${tickets.tags})`)
        .limit(1);
      if (row && row.assigneeId !== assigneeId) {
        await db
          .update(tickets)
          .set({ assigneeId, updatedAt: new Date() })
          .where(eq(tickets.id, row.id));
        assigneesUpdated += 1;
      }
    }
    if (batch.length < 100) break;
  }

  return {
    freshdeskAgents: job.agentEmailById.size,
    crmLoginsCreated: job.stats.agentsImported,
    assigneesUpdated,
    agents: [...job.agentEmailById.values()].map((a) => a.email),
  };
}
