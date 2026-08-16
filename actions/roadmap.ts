"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/crm/auth";
import {
  archiveRoadmapItem,
  createRoadmapItem,
  parseRoadmapStatus,
  toggleRoadmapVote,
  updateRoadmapItem,
} from "@/lib/crm/roadmap";

function revalidateRoadmap() {
  revalidatePath("/roadmap");
  revalidatePath("/crm/roadmap");
}

export async function toggleRoadmapVoteAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) return;
  await toggleRoadmapVote(itemId);
  revalidateRoadmap();
}

export async function createRoadmapItemAction(formData: FormData) {
  await requireAgent();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const status = parseRoadmapStatus(String(formData.get("status") ?? "")) ?? "considering";
  const published = String(formData.get("published") ?? "1") === "1";
  const sortOrder = Number(formData.get("sortOrder") ?? "0") || 0;

  if (!title) redirect("/crm/roadmap?error=1");

  await createRoadmapItem({ title, body, status, published, sortOrder });
  revalidateRoadmap();
  redirect("/crm/roadmap?ok=created");
}

export async function updateRoadmapItemAction(formData: FormData) {
  await requireAgent();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const status = parseRoadmapStatus(String(formData.get("status") ?? "")) ?? "considering";
  const published = String(formData.get("published") ?? "1") === "1";
  const sortOrder = Number(formData.get("sortOrder") ?? "0") || 0;

  if (!id || !title) redirect("/crm/roadmap?error=1");

  await updateRoadmapItem(id, { title, body, status, published, sortOrder });
  revalidateRoadmap();
  redirect("/crm/roadmap?ok=updated");
}

export async function archiveRoadmapItemAction(formData: FormData) {
  await requireAgent();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/crm/roadmap?error=1");
  await archiveRoadmapItem(id);
  revalidateRoadmap();
  redirect("/crm/roadmap?ok=archived");
}
