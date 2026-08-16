import { prisma } from "@/lib/prisma"
import type { Agent, AgentRole } from "@/lib/crm/types"

type StaffUser = {
  id: string
  email: string | null
  name: string | null
  role: string
  deskStatus: string
}

export function toAgentFromUser(user: StaffUser): Agent {
  const email = user.email?.trim().toLowerCase() || ""
  return {
    id: user.id,
    email,
    name: user.name?.trim() || email.split("@")[0] || "Agent",
    role: user.role === "admin" ? "admin" : "agent",
    status:
      user.deskStatus === "away" || user.deskStatus === "offline" ? user.deskStatus : "online",
  }
}

export async function listDeskAgentsFromSiteUsers(): Promise<Agent[]> {
  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "agent"] } },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  })
  return users.filter((user) => user.email).map(toAgentFromUser)
}

export async function listSiteUsersWithoutDeskAccess() {
  return prisma.user.findMany({
    where: { role: { notIn: ["admin", "agent"] }, email: { not: "" } },
    select: { id: true, name: true, email: true, role: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  })
}

export async function grantDeskAccess(userId: string, role: AgentRole) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
  if (!user.email) throw new Error("User not found")
  return toAgentFromUser(user)
}

export async function updateDeskUser(
  userId: string,
  fields: { name?: string; role?: AgentRole; status?: Agent["status"] },
) {
  const data: { name?: string; role?: string; deskStatus?: string } = {}
  if (fields.name?.trim()) data.name = fields.name.trim()
  if (fields.role) data.role = fields.role
  if (fields.status) data.deskStatus = fields.status
  if (Object.keys(data).length === 0) return
  await prisma.user.update({ where: { id: userId }, data })
}
