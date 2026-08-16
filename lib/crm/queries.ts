import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, ensureDb } from "./db";
import {
  agents,
  cannedResponses,
  contacts,
  kbArticles,
  ticketMessages,
  tickets,
} from "@/db/schema";
import type {
  Agent,
  AgentRole,
  CannedResponse,
  Contact,
  DashboardStats,
  KbArticle,
  TicketViewCounts,
  Ticket,
  TicketMessage,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "./types";
import { hashPassword } from "./password";
import { isInternalImportTag } from "./format";
import { slaDueDatesFor, applySlaDues } from "./sla";
import { runAutomations } from "./automations";
import {
  notifyAgentsNewTicket,
  notifyCustomerAgentReply,
  notifyCustomerTicketCreated,
} from "./email";

function toAgent(row: typeof agents.$inferSelect): Agent {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role === "admin" ? "admin" : "agent",
    status: row.status === "away" || row.status === "offline" ? row.status : "online",
  };
}

function toTicket(
  row: typeof tickets.$inferSelect,
  extras: {
    contactName: string | null;
    contactEmail: string | null;
    licenseTier: string | null;
    assigneeName: string | null;
  },
): Ticket {
  return {
    id: row.id,
    number: row.number,
    contactId: row.contactId,
    assigneeId: row.assigneeId,
    subject: row.subject,
    description: row.description,
    status: row.status as TicketStatus,
    priority: row.priority as TicketPriority,
    type: row.type as TicketType,
    source: row.source as Ticket["source"],
    tags: row.tags ?? [],
    appFeedbackId: row.appFeedbackId,
    firstResponseAt: row.firstResponseAt,
    resolvedAt: row.resolvedAt,
    firstResponseDueAt: row.firstResponseDueAt,
    resolutionDueAt: row.resolutionDueAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    contactName: extras.contactName,
    contactEmail: extras.contactEmail,
    licenseTier:
      extras.licenseTier === "FULL" || extras.licenseTier === "FREE"
        ? extras.licenseTier
        : null,
    assigneeName: extras.assigneeName,
  };
}

function toContact(row: typeof contacts.$inferSelect): Contact {
  return {
    id: row.id,
    appUserId: row.appUserId,
    email: row.email,
    name: row.name,
    licenseTier:
      row.licenseTier === "FULL" || row.licenseTier === "FREE" ? row.licenseTier : null,
    subscriptionStatus: row.subscriptionStatus,
    phone: row.phone,
    tags: row.tags ?? [],
    lastSeenAt: row.lastSeenAt,
    createdAt: row.createdAt,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [row] = await db
    .select({
      open: sql<number>`cast(count(*) filter (where ${tickets.status} = 'open') as int)`,
      pending: sql<number>`cast(count(*) filter (where ${tickets.status} = 'pending') as int)`,
      unassigned: sql<number>`cast(count(*) filter (where ${tickets.status} in ('open','pending') and ${tickets.assigneeId} is null) as int)`,
      urgent: sql<number>`cast(count(*) filter (where ${tickets.status} in ('open','pending') and ${tickets.priority} = 'urgent') as int)`,
      resolvedToday: sql<number>`cast(count(*) filter (where ${tickets.status} = 'resolved' and ${tickets.resolvedAt} >= date_trunc('day', now())) as int)`,
      fromApp24h: sql<number>`cast(count(*) filter (where ${tickets.source} in ('app','feedback') and ${tickets.createdAt} >= now() - interval '24 hours') as int)`,
    })
    .from(tickets);

  return (
    row ?? {
      open: 0,
      pending: 0,
      unassigned: 0,
      urgent: 0,
      resolvedToday: 0,
      fromApp24h: 0,
    }
  );
}

export async function countTicketViews(agentId: string): Promise<TicketViewCounts> {
  const [row] = await db
    .select({
      all: sql<number>`cast(count(*) as int)`,
      open: sql<number>`cast(count(*) filter (where ${tickets.status} in ('open','pending')) as int)`,
      mine: sql<number>`cast(count(*) filter (where ${tickets.status} in ('open','pending') and ${tickets.assigneeId} = ${agentId}) as int)`,
      unassigned: sql<number>`cast(count(*) filter (where ${tickets.status} in ('open','pending') and ${tickets.assigneeId} is null) as int)`,
      urgent: sql<number>`cast(count(*) filter (where ${tickets.status} in ('open','pending') and ${tickets.priority} = 'urgent') as int)`,
    })
    .from(tickets);

  return (
    row ?? {
      all: 0,
      open: 0,
      mine: 0,
      unassigned: 0,
      urgent: 0,
    }
  );
}

export async function listTickets(opts: {
  status?: string;
  priority?: string;
  type?: string;
  q?: string;
  view?: string;
  assigneeId?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Ticket[]; total: number }> {
  const status = opts.status && opts.status !== "all" ? opts.status : null;
  const priority = opts.priority && opts.priority !== "all" ? opts.priority : null;
  const type = opts.type && opts.type !== "all" ? opts.type : null;
  const q = opts.q?.trim() ? `%${opts.q.trim()}%` : null;
  const view = opts.view && opts.view !== "all" ? opts.view : null;
  const pageSize = Math.max(1, opts.pageSize ?? 200);
  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * pageSize;

  const filters = [];
  if (status) filters.push(eq(tickets.status, status));
  if (priority) filters.push(eq(tickets.priority, priority));
  if (type) filters.push(eq(tickets.type, type));

  if (view === "mine") {
    if (!opts.assigneeId) return { items: [], total: 0 };
    filters.push(eq(tickets.assigneeId, opts.assigneeId));
    filters.push(or(eq(tickets.status, "open"), eq(tickets.status, "pending"))!);
  } else if (view === "unassigned") {
    filters.push(sql`${tickets.assigneeId} is null`);
    filters.push(or(eq(tickets.status, "open"), eq(tickets.status, "pending"))!);
  } else if (view === "urgent") {
    filters.push(eq(tickets.priority, "urgent"));
    filters.push(or(eq(tickets.status, "open"), eq(tickets.status, "pending"))!);
  } else if (view === "open") {
    filters.push(or(eq(tickets.status, "open"), eq(tickets.status, "pending"))!);
  } else if (opts.assigneeId) {
    filters.push(eq(tickets.assigneeId, opts.assigneeId));
  }

  if (q) {
    filters.push(
      or(
        ilike(tickets.subject, q),
        ilike(tickets.description, q),
        ilike(contacts.name, q),
        ilike(contacts.email, q),
        sql`${tickets.number}::text ilike ${q}`,
        sql`('#' || ${tickets.number}::text) ilike ${q}`,
        sql`('DB-' || ${tickets.number}::text) ilike ${q}`,
        sql`array_to_string(${tickets.tags}, ',') ilike ${q}`,
      ),
    );
  }

  const where = filters.length ? and(...filters) : undefined;
  const priorityOrder = sql`case
    when ${tickets.priority} = 'urgent' then 0
    when ${tickets.priority} = 'high' then 1
    when ${tickets.priority} = 'medium' then 2
    else 3 end`;

  const [countRow] = await db
    .select({ n: sql<number>`cast(count(distinct ${tickets.id}) as int)` })
    .from(tickets)
    .leftJoin(contacts, eq(tickets.contactId, contacts.id))
    .where(where);

  const total = countRow?.n ?? 0;

  const rows = await db
    .select({
      ticket: tickets,
      contactName: contacts.name,
      contactEmail: contacts.email,
      licenseTier: contacts.licenseTier,
      assigneeName: agents.name,
    })
    .from(tickets)
    .leftJoin(contacts, eq(tickets.contactId, contacts.id))
    .leftJoin(agents, eq(tickets.assigneeId, agents.id))
    .where(where)
    .orderBy(priorityOrder, desc(tickets.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    total,
    items: rows.map((row) =>
      toTicket(row.ticket, {
        contactName: row.contactName,
        contactEmail: row.contactEmail,
        licenseTier: row.licenseTier,
        assigneeName: row.assigneeName,
      }),
    ),
  };
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const [row] = await db
    .select({
      ticket: tickets,
      contactName: contacts.name,
      contactEmail: contacts.email,
      licenseTier: contacts.licenseTier,
      assigneeName: agents.name,
    })
    .from(tickets)
    .leftJoin(contacts, eq(tickets.contactId, contacts.id))
    .leftJoin(agents, eq(tickets.assigneeId, agents.id))
    .where(eq(tickets.id, id))
    .limit(1);

  if (!row) return null;
  return toTicket(row.ticket, {
    contactName: row.contactName,
    contactEmail: row.contactEmail,
    licenseTier: row.licenseTier,
    assigneeName: row.assigneeName,
  });
}

export async function listMessages(ticketId: string): Promise<TicketMessage[]> {
  const rows = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticketId))
    .orderBy(ticketMessages.createdAt);

  return rows.map((row) => ({
    id: row.id,
    ticketId: row.ticketId,
    authorType: row.authorType as TicketMessage["authorType"],
    authorId: row.authorId,
    authorName: row.authorName,
    body: row.body,
    isInternal: row.isInternal,
    createdAt: row.createdAt,
  }));
}

export async function listAgents(): Promise<Agent[]> {
  const rows = await db.select().from(agents).orderBy(agents.name);
  return rows.map(toAgent);
}

export async function listCannedResponses(): Promise<CannedResponse[]> {
  const rows = await db.select().from(cannedResponses).orderBy(cannedResponses.title);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    shortcut: row.shortcut,
    body: row.body,
  }));
}

export async function listContacts(
  q?: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<{ items: (Contact & { ticketCount: number })[]; total: number }> {
  const query = q?.trim() ? `%${q.trim()}%` : null;
  const pageSize = Math.max(1, opts.pageSize ?? 200);
  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * pageSize;
  const where = query
    ? or(
        ilike(contacts.name, query),
        ilike(contacts.email, query),
        sql`array_to_string(${contacts.tags}, ',') ilike ${query}`,
      )
    : undefined;

  const [countRow] = await db
    .select({ n: sql<number>`cast(count(*) as int)` })
    .from(contacts)
    .where(where);
  const total = countRow?.n ?? 0;

  const rows = await db
    .select({
      contact: contacts,
      ticketCount: sql<number>`cast(count(${tickets.id}) as int)`,
    })
    .from(contacts)
    .leftJoin(tickets, eq(tickets.contactId, contacts.id))
    .where(where)
    .groupBy(contacts.id)
    .orderBy(desc(contacts.updatedAt))
    .limit(pageSize)
    .offset(offset);

  const list = Array.isArray(rows) ? rows : [];
  return {
    total,
    items: list.map((row) => ({ ...toContact(row.contact), ticketCount: row.ticketCount })),
  };
}

export async function getContact(id: string): Promise<Contact | null> {
  const [row] = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return row ? toContact(row) : null;
}

export async function listTicketsForContact(contactId: string): Promise<Ticket[]> {
  const rows = await db
    .select({
      ticket: tickets,
      contactName: contacts.name,
      contactEmail: contacts.email,
      licenseTier: contacts.licenseTier,
      assigneeName: agents.name,
    })
    .from(tickets)
    .leftJoin(contacts, eq(tickets.contactId, contacts.id))
    .leftJoin(agents, eq(tickets.assigneeId, agents.id))
    .where(eq(tickets.contactId, contactId))
    .orderBy(desc(tickets.createdAt));

  return rows.map((row) =>
    toTicket(row.ticket, {
      contactName: row.contactName,
      contactEmail: row.contactEmail,
      licenseTier: row.licenseTier,
      assigneeName: row.assigneeName,
    }),
  );
}

export async function listKbArticles(): Promise<KbArticle[]> {
  await ensureDb();
  const rows = await db.select().from(kbArticles).orderBy(kbArticles.category, kbArticles.title);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    body: row.body,
    published: row.published,
    updatedAt: row.updatedAt,
  }));
}

export async function findAgentByEmail(email: string) {
  await ensureDb();
  const [row] = await db
    .select()
    .from(agents)
    .where(sql`lower(${agents.email}) = ${email.toLowerCase()}`)
    .limit(1);
  if (!row) return null;
  return { ...toAgent(row), passwordHash: row.passwordHash };
}

export type IngestTicketInput = {
  appUserId?: string | null;
  email?: string | null;
  name?: string | null;
  licenseTier?: "FREE" | "FULL" | null;
  subscriptionStatus?: string | null;
  feedbackId?: string | null;
  type?: string | null;
  message: string;
  subject?: string | null;
  path?: string | null;
  source?: Ticket["source"];
};

function mapFeedbackType(type: string | null | undefined): {
  type: TicketType;
  priority: TicketPriority;
} {
  if (type === "bug") return { type: "bug", priority: "high" };
  if (type === "feature") return { type: "feature", priority: "medium" };
  if (type === "billing") return { type: "billing", priority: "high" };
  if (type === "question") return { type: "question", priority: "medium" };
  return { type: "general", priority: "medium" };
}

export async function ingestTicket(input: IngestTicketInput) {
  await ensureDb();
  const message = input.message.trim();
  if (message.length < 1) throw new Error("Message is required");

  if (input.feedbackId) {
    const existing = await db.query.tickets.findFirst({
      where: eq(tickets.appFeedbackId, input.feedbackId),
      columns: { id: true, number: true },
    });
    if (existing) return existing;
  }

  let contactId: string | null = null;
  if (input.appUserId) {
    const found = await db.query.contacts.findFirst({
      where: eq(contacts.appUserId, input.appUserId),
    });
    contactId = found?.id ?? null;
  }
  if (!contactId && input.email) {
    const [found] = await db
      .select()
      .from(contacts)
      .where(sql`lower(${contacts.email}) = ${input.email.toLowerCase()}`)
      .limit(1);
    contactId = found?.id ?? null;
  }

  const license =
    input.licenseTier === "FULL" || input.licenseTier === "FREE" ? input.licenseTier : null;

  if (contactId) {
    const patch: Partial<typeof contacts.$inferInsert> = {
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    };
    if (input.email) patch.email = input.email;
    if (input.name) patch.name = input.name;
    if (license) patch.licenseTier = license;
    if (input.subscriptionStatus) patch.subscriptionStatus = input.subscriptionStatus;
    await db.update(contacts).set(patch).where(eq(contacts.id, contactId));
  } else if (input.email || input.appUserId) {
    const [created] = await db
      .insert(contacts)
      .values({
        appUserId: input.appUserId ?? null,
        email: input.email ?? null,
        name: input.name ?? null,
        licenseTier: license,
        subscriptionStatus: input.subscriptionStatus ?? null,
        lastSeenAt: new Date(),
        tags: ["app"],
      })
      .returning();
    contactId = created.id;
  }

  const mapped = mapFeedbackType(input.type);
  const subject =
    input.subject?.trim() ||
    (input.path ? `${mapped.type} from ${input.path}` : message.slice(0, 80));
  const source = input.source ?? "feedback";
  const contactName = input.name?.trim() || input.email || "App user";
  const createdAt = new Date();
  const dues = await slaDueDatesFor(createdAt, mapped.priority);

  const [ticket] = await db
    .insert(tickets)
    .values({
      contactId,
      subject,
      description: message,
      status: "open",
      priority: mapped.priority,
      type: mapped.type,
      source,
      tags: input.path ? [input.path] : [],
      appFeedbackId: input.feedbackId ?? null,
      createdAt,
      ...dues,
    })
    .returning();

  await db.insert(ticketMessages).values({
    ticketId: ticket.id,
    authorType: "contact",
    authorId: contactId,
    authorName: contactName,
    body: message,
    isInternal: false,
  });

  if (input.email) {
    void notifyCustomerTicketCreated({
      to: input.email,
      ticketId: ticket.id,
      ticketNumber: ticket.number,
      subject: ticket.subject,
    });
  }
  void notifyAgentsNewTicket({
    ticketId: ticket.id,
    ticketNumber: ticket.number,
    subject: ticket.subject,
    contactEmail: input.email,
    preview: message,
  });

  await runAutomations("ticket_created", ticket.id);

  return ticket;
}

export async function addMessage(opts: {
  ticketId: string;
  agent: Agent;
  body: string;
  isInternal: boolean;
  afterStatus?: TicketStatus;
  assignToAgent?: boolean;
}) {
  const body = opts.body.trim();
  if (body.length < 1) throw new Error("Reply cannot be empty");

  await db.insert(ticketMessages).values({
    ticketId: opts.ticketId,
    authorType: "agent",
    authorId: opts.agent.id,
    authorName: opts.agent.name,
    body,
    isInternal: opts.isInternal,
  });

  const current = await db.query.tickets.findFirst({
    where: eq(tickets.id, opts.ticketId),
  });
  if (!current) return;

  const patch: Partial<typeof tickets.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (!opts.isInternal) {
    patch.firstResponseAt = current.firstResponseAt ?? new Date();
    const nextStatus =
      opts.afterStatus ??
      (current.status === "open" ? "pending" : (current.status as TicketStatus));
    patch.status = nextStatus;
    patch.resolvedAt =
      nextStatus === "resolved" || nextStatus === "closed" ? new Date() : null;
  } else if (opts.afterStatus) {
    patch.status = opts.afterStatus;
    patch.resolvedAt =
      opts.afterStatus === "resolved" || opts.afterStatus === "closed"
        ? new Date()
        : null;
  }

  if (opts.assignToAgent && !current.assigneeId) {
    patch.assigneeId = opts.agent.id;
  }

  await db.update(tickets).set(patch).where(eq(tickets.id, opts.ticketId));

  if (!opts.isInternal) {
    await runAutomations("agent_reply", opts.ticketId);
  }

  if (!opts.isInternal && current.contactId) {
    const [contact] = await db
      .select({ email: contacts.email })
      .from(contacts)
      .where(eq(contacts.id, current.contactId))
      .limit(1);
    if (contact?.email) {
      void notifyCustomerAgentReply({
        to: contact.email,
        ticketId: current.id,
        ticketNumber: current.number,
        subject: current.subject,
        agentName: opts.agent.name,
        body,
      });
    }
  }
}

export async function updateTicketFields(
  ticketId: string,
  fields: {
    status?: TicketStatus;
    priority?: TicketPriority;
    type?: TicketType;
    assigneeId?: string | null;
    tags?: string[];
  },
  actor?: Agent,
) {
  const current = await db.query.tickets.findFirst({
    where: eq(tickets.id, ticketId),
  });
  const patch: Partial<typeof tickets.$inferInsert> = { updatedAt: new Date() };
  if (fields.status) {
    patch.status = fields.status;
    patch.resolvedAt =
      fields.status === "resolved" || fields.status === "closed" ? new Date() : null;
  }
  if (fields.priority) patch.priority = fields.priority;
  if (fields.type) patch.type = fields.type;
  if (fields.assigneeId !== undefined) patch.assigneeId = fields.assigneeId;
  if (fields.tags) {
    const internal = (current?.tags ?? []).filter(isInternalImportTag);
    patch.tags = Array.from(
      new Set([...internal, ...fields.tags.filter((tag) => !isInternalImportTag(tag))]),
    );
  }
  await db.update(tickets).set(patch).where(eq(tickets.id, ticketId));

  if (fields.priority && fields.priority !== current?.priority) {
    await applySlaDues(ticketId);
  }
  await runAutomations("ticket_updated", ticketId);

  if (actor && current) {
    const notes: string[] = [];
    if (fields.status && fields.status !== current.status) {
      notes.push(`Status → ${fields.status}`);
    }
    if (fields.priority && fields.priority !== current.priority) {
      notes.push(`Priority → ${fields.priority}`);
    }
    if (fields.type && fields.type !== current.type) {
      notes.push(`Type → ${fields.type}`);
    }
    if (fields.assigneeId !== undefined && fields.assigneeId !== current.assigneeId) {
      notes.push(fields.assigneeId ? "Assignee updated" : "Unassigned");
    }
    if (notes.length) {
      await db.insert(ticketMessages).values({
        ticketId,
        authorType: "system",
        authorId: actor.id,
        authorName: "System",
        body: notes.join(" · "),
        isInternal: true,
      });
    }
  }
}

export async function createAgentTicket(opts: {
  agent: Agent;
  email: string;
  name?: string;
  subject: string;
  body: string;
  type: TicketType;
  priority: TicketPriority;
}) {
  let contactId: string | null = null;
  const [found] = await db
    .select()
    .from(contacts)
    .where(sql`lower(${contacts.email}) = ${opts.email.toLowerCase()}`)
    .limit(1);
  contactId = found?.id ?? null;
  if (!contactId) {
    const [created] = await db
      .insert(contacts)
      .values({
        email: opts.email,
        name: opts.name || opts.email,
        tags: ["manual"],
      })
      .returning();
    contactId = created.id;
  }

  const createdAt = new Date();
  const dues = await slaDueDatesFor(createdAt, opts.priority);

  const [ticket] = await db
    .insert(tickets)
    .values({
      contactId,
      assigneeId: opts.agent.id,
      subject: opts.subject,
      description: opts.body,
      status: "open",
      priority: opts.priority,
      type: opts.type,
      source: "portal",
      createdAt,
      ...dues,
    })
    .returning();

  await db.insert(ticketMessages).values({
    ticketId: ticket.id,
    authorType: "contact",
    authorId: contactId,
    authorName: opts.name || opts.email,
    body: opts.body,
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

  return ticket.id;
}

export async function countOpenTickets() {
  const [row] = await db
    .select({ n: count() })
    .from(tickets)
    .where(or(eq(tickets.status, "open"), eq(tickets.status, "pending")));
  return row?.n ?? 0;
}

export async function createAgent(opts: {
  email: string;
  name: string;
  password: string;
  role: AgentRole;
}) {
  await ensureDb();
  const email = opts.email.trim().toLowerCase();
  const [created] = await db
    .insert(agents)
    .values({
      email,
      name: opts.name.trim(),
      role: opts.role,
      passwordHash: hashPassword(opts.password),
      status: "online",
    })
    .returning();
  return toAgent(created);
}

export async function updateAgentProfile(
  agentId: string,
  fields: {
    name?: string;
    role?: AgentRole;
    status?: Agent["status"];
  },
) {
  await ensureDb();
  const patch: Partial<typeof agents.$inferInsert> = {};
  if (fields.name?.trim()) patch.name = fields.name.trim();
  if (fields.role) patch.role = fields.role;
  if (fields.status) patch.status = fields.status;
  if (Object.keys(patch).length === 0) return;
  await db.update(agents).set(patch).where(eq(agents.id, agentId));
}

export async function setAgentPassword(agentId: string, password: string) {
  await ensureDb();
  await db
    .update(agents)
    .set({ passwordHash: hashPassword(password) })
    .where(eq(agents.id, agentId));
}

export async function createCannedResponse(opts: {
  title: string;
  shortcut: string | null;
  body: string;
}) {
  await ensureDb();
  const [row] = await db
    .insert(cannedResponses)
    .values({
      title: opts.title,
      shortcut: opts.shortcut,
      body: opts.body,
    })
    .returning();
  return {
    id: row.id,
    title: row.title,
    shortcut: row.shortcut,
    body: row.body,
  };
}

export async function createKbArticle(opts: {
  title: string;
  slug: string;
  category: string;
  body: string;
}) {
  await ensureDb();
  const [row] = await db
    .insert(kbArticles)
    .values({
      title: opts.title,
      slug: opts.slug,
      category: opts.category,
      body: opts.body,
      published: true,
    })
    .returning();
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    body: row.body,
    published: row.published,
    updatedAt: row.updatedAt,
  };
}
