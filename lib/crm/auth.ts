import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db, ensureDb } from "@/lib/crm/db"
import { agents } from "@/db/schema"
import type { Agent } from "@/lib/crm/types"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

function toAgent(row: typeof agents.$inferSelect): Agent {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role === "admin" ? "admin" : "agent",
    status: row.status === "away" || row.status === "offline" ? row.status : "online",
  }
}

export async function getSessionAgent(): Promise<Agent | null> {
  if (isBuildTime) return null
  const session = await auth()
  const email = session?.user?.email
  const role = session?.user?.role
  if (!email || (role !== "admin" && role !== "agent")) return null

  await ensureDb()

  let row = await db.query.agents.findFirst({
    where: eq(agents.email, email),
  })

  if (!row) {
    const [created] = await db
      .insert(agents)
      .values({
        email,
        name: session.user.name?.trim() || email.split("@")[0] || "Agent",
        role: role === "admin" ? "admin" : "agent",
        passwordHash: "nextauth",
        status: "online",
      })
      .returning()
    row = created
  }

  return row ? toAgent(row) : null
}

export async function requireAgent(): Promise<Agent> {
  const agent = await getSessionAgent()
  if (!agent) redirect("/auth/signin")
  return agent
}

export const SESSION_COOKIE = "next-auth.session-token"
