import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionAgent } from "@/lib/crm/auth"

export const dynamic = "force-dynamic"

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value)
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export async function GET(request: Request) {
  const agent = await getSessionAgent()
  if (!agent) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  const rows = await prisma.crmContact.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { tickets: true } } },
  })

  const headers = ["name", "email", "phone", "tags", "tickets", "lastSeenAt", "createdAt"]
  const lines = rows.map((row) =>
    [
      row.name,
      row.email,
      row.phone,
      (row.tags ?? []).join("; "),
      row._count.tickets,
      row.lastSeenAt?.toISOString() ?? "",
      row.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  )
  const csv = `\uFEFF${[headers.join(","), ...lines].join("\n")}`

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contacts.csv"`,
    },
  })
}
