"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAgent } from "@/lib/crm/auth"
import { importContactsFromFormResponses, mergeDuplicateContactsByEmail } from "@/lib/crm/from-form"

export async function importFormResponseContactsAction() {
  await requireAgent()
  const result = await importContactsFromFormResponses()
  revalidatePath("/crm/contacts")
  const params = new URLSearchParams()
  params.set("imported", String(result.created))
  params.set("updated", String(result.updated))
  params.set("skipped", String(result.skipped))
  redirect(`/crm/contacts?${params.toString()}`)
}

export async function mergeDuplicateContactsAction() {
  await requireAgent()
  const result = await mergeDuplicateContactsByEmail()
  revalidatePath("/crm/contacts")
  redirect(`/crm/contacts?merged=${result.merged}`)
}
