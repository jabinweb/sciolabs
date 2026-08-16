import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("agent"),
  passwordHash: text("password_hash").notNull(),
  status: text("status").notNull().default("online"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    appUserId: uuid("app_user_id").unique(),
    email: text("email"),
    name: text("name"),
    licenseTier: text("license_tier"),
    subscriptionStatus: text("subscription_status"),
    phone: text("phone"),
    tags: text("tags").array().notNull().default([]),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("contacts_app_user_id_idx").on(table.appUserId),
  ],
);

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    number: integer("number").notNull().generatedByDefaultAsIdentity({ startWith: 1001 }),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
    assigneeId: uuid("assignee_id").references(() => agents.id, { onDelete: "set null" }),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    status: text("status").notNull().default("open"),
    priority: text("priority").notNull().default("medium"),
    type: text("type").notNull().default("general"),
    source: text("source").notNull().default("app"),
    tags: text("tags").array().notNull().default([]),
    appFeedbackId: uuid("app_feedback_id").unique(),
    firstResponseAt: timestamp("first_response_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    csatScore: integer("csat_score"),
    csatComment: text("csat_comment"),
    firstResponseDueAt: timestamp("first_response_due_at", { withTimezone: true }),
    resolutionDueAt: timestamp("resolution_due_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("tickets_status_created_idx").on(table.status, table.createdAt),
    index("tickets_assignee_idx").on(table.assigneeId),
    index("tickets_contact_idx").on(table.contactId),
  ],
);

export const ticketMessages = pgTable(
  "ticket_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    authorType: text("author_type").notNull(),
    authorId: uuid("author_id"),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    isInternal: boolean("is_internal").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("ticket_messages_ticket_idx").on(table.ticketId, table.createdAt)],
);

export const cannedResponses = pgTable("canned_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  shortcut: text("shortcut").unique(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const kbArticles = pgTable("kb_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull().default("General"),
  body: text("body").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Admin-managed integration keys (email, ingest, public URL, …). */
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const roadmapItems = pgTable(
  "roadmap_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    status: text("status").notNull().default("considering"),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    voteCount: integer("vote_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("roadmap_items_status_sort_idx").on(table.status, table.sortOrder),
  ],
);

export const roadmapVotes = pgTable(
  "roadmap_votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => roadmapItems.id, { onDelete: "cascade" }),
    voterKey: text("voter_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("roadmap_votes_item_voter_idx").on(table.itemId, table.voterKey),
    index("roadmap_votes_item_idx").on(table.itemId),
  ],
);

export const slaPolicies = pgTable("sla_policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  isDefault: boolean("is_default").notNull().default(true),
  firstResponseHours: text("first_response_hours").notNull(),
  resolveHours: text("resolve_hours").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const automationRules = pgTable(
  "automation_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    enabled: boolean("enabled").notNull().default(true),
    trigger: text("trigger").notNull(),
    conditions: text("conditions").notNull().default("[]"),
    actions: text("actions").notNull().default("[]"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("automation_rules_trigger_idx").on(table.trigger, table.enabled)],
);

export const agentsRelations = relations(agents, ({ many }) => ({
  tickets: many(tickets),
}));

export const contactsRelations = relations(contacts, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  contact: one(contacts, { fields: [tickets.contactId], references: [contacts.id] }),
  assignee: one(agents, { fields: [tickets.assigneeId], references: [agents.id] }),
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketMessages.ticketId], references: [tickets.id] }),
}));

export const roadmapItemsRelations = relations(roadmapItems, ({ many }) => ({
  votes: many(roadmapVotes),
}));

export const roadmapVotesRelations = relations(roadmapVotes, ({ one }) => ({
  item: one(roadmapItems, { fields: [roadmapVotes.itemId], references: [roadmapItems.id] }),
}));

export type AgentRow = typeof agents.$inferSelect;
export type ContactRow = typeof contacts.$inferSelect;
export type TicketRow = typeof tickets.$inferSelect;
export type TicketMessageRow = typeof ticketMessages.$inferSelect;
export type CannedResponseRow = typeof cannedResponses.$inferSelect;
export type KbArticleRow = typeof kbArticles.$inferSelect;
export type RoadmapItemRow = typeof roadmapItems.$inferSelect;
export type RoadmapVoteRow = typeof roadmapVotes.$inferSelect;
export type SlaPolicyRow = typeof slaPolicies.$inferSelect;
export type AutomationRuleRow = typeof automationRules.$inferSelect;
