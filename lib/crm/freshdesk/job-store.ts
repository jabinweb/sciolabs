import { randomUUID } from "node:crypto";

export type MigrateLogLevel = "info" | "warn" | "error" | "success";

export type MigrateLog = {
  id: string;
  at: string;
  level: MigrateLogLevel;
  message: string;
};

export type MigratePhase = "contacts" | "tickets" | "done" | "error";

export type MigrateJob = {
  id: string;
  adminId: string;
  baseUrl: string;
  apiKey: string;
  phase: MigratePhase;
  contactPage: number;
  ticketPage: number;
  ticketCursor: number;
  ticketBuffer: import("./client").FreshdeskTicket[];
  agentEmailById: Map<number, { email: string; name: string }>;
  contactIdByFreshdeskId: Map<number, string>;
  assigneeIdByResponderId: Map<number, string | null>;
  stats: {
    contactsImported: number;
    ticketsImported: number;
    messagesImported: number;
    ticketsCleared: number;
    agentsImported: number;
    errors: number;
    apiCalls: number;
  };
  logs: MigrateLog[];
  createdAt: number;
  updatedAt: number;
};

const globalStore = globalThis as unknown as {
  dbcrmFreshdeskJobs?: Map<string, MigrateJob>;
};

function jobs() {
  if (!globalStore.dbcrmFreshdeskJobs) {
    globalStore.dbcrmFreshdeskJobs = new Map();
  }
  return globalStore.dbcrmFreshdeskJobs;
}

export function createMigrateJob(input: {
  adminId: string;
  baseUrl: string;
  apiKey: string;
}): MigrateJob {
  const job: MigrateJob = {
    id: randomUUID(),
    adminId: input.adminId,
    baseUrl: input.baseUrl,
    apiKey: input.apiKey,
    phase: "contacts",
    contactPage: 1,
    ticketPage: 1,
    ticketCursor: 0,
    ticketBuffer: [],
    agentEmailById: new Map(),
    contactIdByFreshdeskId: new Map(),
    assigneeIdByResponderId: new Map(),
    stats: {
      contactsImported: 0,
      ticketsImported: 0,
      messagesImported: 0,
      ticketsCleared: 0,
      agentsImported: 0,
      errors: 0,
      apiCalls: 0,
    },
    logs: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  appendLog(job, "info", `Migration job ${job.id.slice(0, 8)} created`);
  jobs().set(job.id, job);
  return job;
}

export function getMigrateJob(id: string) {
  return jobs().get(id) ?? null;
}

export function deleteMigrateJob(id: string) {
  jobs().delete(id);
}

export function appendLog(job: MigrateJob, level: MigrateLogLevel, message: string) {
  job.logs.push({
    id: randomUUID(),
    at: new Date().toISOString(),
    level,
    message,
  });
  if (job.logs.length > 500) {
    job.logs = job.logs.slice(-500);
  }
  job.updatedAt = Date.now();
  if (job.adminId === "sync") {
    console.log(`[${level}] ${message}`);
  }
}

export function publicJob(job: MigrateJob) {
  return {
    id: job.id,
    phase: job.phase,
    contactPage: job.contactPage,
    ticketPage: job.ticketPage,
    stats: job.stats,
    logs: job.logs.slice(-80),
    done: job.phase === "done" || job.phase === "error",
  };
}
