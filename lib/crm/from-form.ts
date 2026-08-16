import { ingestTicket } from "@/lib/crm/queries"

export async function upsertCrmFromForm(input: {
  formName: string
  email?: string
  phone?: string
  source?: string
  data: Record<string, unknown>
}) {
  const name =
    typeof input.data.name === "string" ? input.data.name.trim() : ""
  const email =
    input.email?.trim() ||
    (typeof input.data.email === "string" ? input.data.email.trim() : "")
  const phone =
    input.phone?.trim() ||
    (typeof input.data.phone === "string" ? input.data.phone.trim() : "")
  const interests = Array.isArray(input.data.interests)
    ? input.data.interests.map(String).join(", ")
    : ""
  const message =
    typeof input.data.message === "string" ? input.data.message.trim() : ""

  const body = [
    interests && `Interests: ${interests}`,
    phone && `Phone: ${phone}`,
    typeof input.data.city === "string" && input.data.city.trim()
      ? `City: ${input.data.city}`
      : "",
    typeof input.data.organisation === "string" && input.data.organisation.trim()
      ? `Organisation: ${input.data.organisation}`
      : "",
    message,
  ]
    .filter(Boolean)
    .join("\n")

  if (!email && !body) return

  await ingestTicket({
    email: email || null,
    name: name || null,
    message: body || `${input.formName} enquiry`,
    subject: `Website: ${input.formName}`,
    source: "portal",
    type: "question",
  })
}
