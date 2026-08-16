import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { Agent } from "@/lib/crm/types"
import { toAgentFromUser } from "@/lib/crm/site-user"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

export async function getSessionAgent(): Promise<Agent | null> {
  if (isBuildTime) return null
  const session = await auth()
  const email = session?.user?.email
  if (!email) return null

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || (user.role !== "admin" && user.role !== "agent")) return null
  return toAgentFromUser(user)
}

export async function requireAgent(): Promise<Agent> {
  const agent = await getSessionAgent()
  if (!agent) redirect("/auth/signin")
  return agent
}

export const SESSION_COOKIE = "next-auth.session-token"
