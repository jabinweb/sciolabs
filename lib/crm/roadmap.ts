import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { db, ensureDb } from "@/lib/crm/db";
import { roadmapItems, roadmapVotes } from "@/db/schema";
import { getPortalEmail } from "@/lib/crm/portal";
import { sessionCookieSecure } from "@/lib/crm/cookie-secure";
import type { RoadmapItem, RoadmapStatus } from "@/lib/crm/types";

export const ROADMAP_STATUSES: { value: RoadmapStatus; label: string }[] = [
  { value: "considering", label: "Under consideration" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "shipped", label: "Shipped" },
];

export const ROADMAP_VOTER_COOKIE = "sciolabs_roadmap_voter";

const STATUS_SET = new Set<RoadmapStatus>([
  "considering",
  "planned",
  "in_progress",
  "shipped",
]);

export function parseRoadmapStatus(raw: string): RoadmapStatus | null {
  return STATUS_SET.has(raw as RoadmapStatus) ? (raw as RoadmapStatus) : null;
}

function mapItem(
  row: typeof roadmapItems.$inferSelect,
  votedIds: Set<string>,
): RoadmapItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    status: (STATUS_SET.has(row.status as RoadmapStatus)
      ? row.status
      : "considering") as RoadmapStatus,
    published: row.published,
    sortOrder: row.sortOrder,
    voteCount: row.voteCount,
    votedByMe: votedIds.has(row.id),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getOrCreateRoadmapVoterKey(): Promise<string> {
  const email = await getPortalEmail();
  if (email) return `email:${email.trim().toLowerCase()}`;

  const jar = await cookies();
  const existing = jar.get(ROADMAP_VOTER_COOKIE)?.value?.trim();
  if (existing && existing.length >= 8) return `anon:${existing}`;

  const id = crypto.randomUUID();
  jar.set(ROADMAP_VOTER_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: await sessionCookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return `anon:${id}`;
}

export async function peekRoadmapVoterKey(): Promise<string | null> {
  const email = await getPortalEmail();
  if (email) return `email:${email.trim().toLowerCase()}`;
  const existing = (await cookies()).get(ROADMAP_VOTER_COOKIE)?.value?.trim();
  if (existing && existing.length >= 8) return `anon:${existing}`;
  return null;
}

async function votedItemIds(voterKey: string | null, itemIds: string[]) {
  if (!voterKey || itemIds.length === 0) return new Set<string>();
  const rows = await db
    .select({ itemId: roadmapVotes.itemId })
    .from(roadmapVotes)
    .where(
      and(eq(roadmapVotes.voterKey, voterKey), inArray(roadmapVotes.itemId, itemIds)),
    );
  return new Set(rows.map((r) => r.itemId));
}

export async function listPublishedRoadmapItems(): Promise<RoadmapItem[]> {
  await ensureDb();
  const rows = await db
    .select()
    .from(roadmapItems)
    .where(eq(roadmapItems.published, true))
    .orderBy(asc(roadmapItems.sortOrder), desc(roadmapItems.voteCount), asc(roadmapItems.title));
  const voterKey = await peekRoadmapVoterKey();
  const voted = await votedItemIds(
    voterKey,
    rows.map((r) => r.id),
  );
  return rows.map((r) => mapItem(r, voted));
}

export async function listAllRoadmapItems(): Promise<RoadmapItem[]> {
  await ensureDb();
  const rows = await db
    .select()
    .from(roadmapItems)
    .orderBy(asc(roadmapItems.status), asc(roadmapItems.sortOrder), desc(roadmapItems.voteCount));
  return rows.map((r) => mapItem(r, new Set()));
}

export async function createRoadmapItem(opts: {
  title: string;
  body: string;
  status: RoadmapStatus;
  published: boolean;
  sortOrder?: number;
}) {
  await ensureDb();
  const [row] = await db
    .insert(roadmapItems)
    .values({
      title: opts.title,
      body: opts.body,
      status: opts.status,
      published: opts.published,
      sortOrder: opts.sortOrder ?? 0,
      voteCount: 0,
    })
    .returning();
  return mapItem(row, new Set());
}

export async function updateRoadmapItem(
  id: string,
  opts: {
    title: string;
    body: string;
    status: RoadmapStatus;
    published: boolean;
    sortOrder: number;
  },
) {
  await ensureDb();
  const [row] = await db
    .update(roadmapItems)
    .set({
      title: opts.title,
      body: opts.body,
      status: opts.status,
      published: opts.published,
      sortOrder: opts.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(roadmapItems.id, id))
    .returning();
  return row ? mapItem(row, new Set()) : null;
}

/** Soft-hide from public by unpublishing (keeps votes for history). */
export async function archiveRoadmapItem(id: string) {
  await ensureDb();
  await db
    .update(roadmapItems)
    .set({ published: false, updatedAt: new Date() })
    .where(eq(roadmapItems.id, id));
}

export async function toggleRoadmapVote(itemId: string): Promise<{ voted: boolean; voteCount: number }> {
  await ensureDb();
  const voterKey = await getOrCreateRoadmapVoterKey();

  const [existing] = await db
    .select({ id: roadmapVotes.id })
    .from(roadmapVotes)
    .where(and(eq(roadmapVotes.itemId, itemId), eq(roadmapVotes.voterKey, voterKey)))
    .limit(1);

  if (existing) {
    await db.delete(roadmapVotes).where(eq(roadmapVotes.id, existing.id));
    const [updated] = await db
      .update(roadmapItems)
      .set({
        voteCount: sql`GREATEST(${roadmapItems.voteCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(roadmapItems.id, itemId))
      .returning();
    return { voted: false, voteCount: updated?.voteCount ?? 0 };
  }

  await db.insert(roadmapVotes).values({ itemId, voterKey });
  const [updated] = await db
    .update(roadmapItems)
    .set({
      voteCount: sql`${roadmapItems.voteCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(roadmapItems.id, itemId))
    .returning();
  return { voted: true, voteCount: updated?.voteCount ?? 1 };
}
