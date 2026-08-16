export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketType = "question" | "bug" | "feature" | "billing" | "general";
export type TicketSource = "app" | "email" | "portal" | "feedback";
export type AgentRole = "admin" | "agent";

export type Agent = {
  id: string;
  email: string;
  name: string;
  role: AgentRole;
  status: "online" | "away" | "offline";
};

export type Contact = {
  id: string;
  appUserId: string | null;
  email: string | null;
  name: string | null;
  licenseTier: "FREE" | "FULL" | null;
  subscriptionStatus: string | null;
  phone: string | null;
  tags: string[];
  lastSeenAt: Date | null;
  createdAt: Date;
};

export type Ticket = {
  id: string;
  number: number;
  contactId: string | null;
  assigneeId: string | null;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  source: TicketSource;
  tags: string[];
  appFeedbackId: string | null;
  firstResponseAt: Date | null;
  resolvedAt: Date | null;
  firstResponseDueAt: Date | null;
  resolutionDueAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  contactName: string | null;
  contactEmail: string | null;
  licenseTier: "FREE" | "FULL" | null;
  assigneeName: string | null;
};

export type TicketMessage = {
  id: string;
  ticketId: string;
  authorType: "agent" | "contact" | "system";
  authorId: string | null;
  authorName: string;
  body: string;
  isInternal: boolean;
  createdAt: Date;
};

export type CannedResponse = {
  id: string;
  title: string;
  shortcut: string | null;
  body: string;
};

export type KbArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  body: string;
  published: boolean;
  updatedAt: Date;
};

export type DashboardStats = {
  open: number;
  pending: number;
  unassigned: number;
  urgent: number;
  resolvedToday: number;
  fromApp24h: number;
};

export type TicketViewCounts = {
  all: number;
  open: number;
  mine: number;
  unassigned: number;
  urgent: number;
};

export const SLA_HOURS: Record<TicketPriority, number> = {
  urgent: 1,
  high: 4,
  medium: 8,
  low: 24,
};

export const SLA_RESOLVE_HOURS: Record<TicketPriority, number> = {
  urgent: 4,
  high: 16,
  medium: 48,
  low: 72,
};

export type SlaHoursByPriority = Record<TicketPriority, number>;

export type SlaPolicy = {
  id: string;
  name: string;
  firstResponseHours: SlaHoursByPriority;
  resolveHours: SlaHoursByPriority;
};

export type AutomationTrigger =
  | "ticket_created"
  | "ticket_updated"
  | "customer_reply"
  | "agent_reply";

export type AutomationConditionField =
  | "status"
  | "priority"
  | "type"
  | "source"
  | "tag"
  | "subject"
  | "assignee";

export type AutomationConditionOp = "eq" | "neq" | "contains" | "is_empty" | "is_set";

export type AutomationCondition = {
  field: AutomationConditionField;
  op: AutomationConditionOp;
  value: string;
};

export type AutomationActionType =
  | "set_status"
  | "set_priority"
  | "set_type"
  | "set_assignee"
  | "add_tag"
  | "remove_tag";

export type AutomationAction = {
  type: AutomationActionType;
  value: string;
};

export type AutomationRule = {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  sortOrder: number;
};
