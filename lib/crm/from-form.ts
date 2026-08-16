import { ingestTicket } from "@/lib/crm/queries"

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).filter(Boolean).join(", ")
  }
  if (typeof value === "object") return JSON.stringify(value)
  return String(value).trim()
}

export async function upsertCrmFromForm(input: {
  formName: string
  email?: string
  phone?: string
  source?: string
  data: Record<string, unknown>
}) {
  const name =
    typeof input.data.name === "string"
      ? input.data.name.trim()
      : typeof input.data.fullName === "string"
        ? input.data.fullName.trim()
        : ""
  const email =
    input.email?.trim() ||
    (typeof input.data.email === "string" ? input.data.email.trim() : "")
  const phone =
    input.phone?.trim() ||
    (typeof input.data.phone === "string" ? input.data.phone.trim() : "") ||
    (typeof input.data.whatsapp === "string" ? input.data.whatsapp.trim() : "")

  const skip = new Set(["name", "fullName", "email", "phone", "whatsapp"])
  const details = Object.entries(input.data)
    .map(([key, value]) => {
      if (skip.has(key)) return ""
      const text = stringifyValue(value)
      return text ? `${key}: ${text}` : ""
    })
    .filter(Boolean)

  const body = [
    `Form: ${input.formName}`,
    input.source && `Page source: ${input.source}`,
    phone && `Phone: ${phone}`,
    ...details,
  ]
    .filter(Boolean)
    .join("\n")

  if (!email && !body) return

  await ingestTicket({
    email: email || null,
    name: name || null,
    phone: phone || null,
    message: body || `${input.formName} enquiry`,
    subject: `Website: ${input.formName}`,
    source: "portal",
    type: "question",
    tags: ["website", input.formName],
  })
}
