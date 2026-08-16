import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { AgentRole } from "@/lib/crm/types";

/** Keep NextAuth users in sync so CRM teammates can sign in at /auth/signin. */
export async function upsertSiteStaffUser(opts: {
  email: string;
  name: string;
  password?: string;
  role: AgentRole;
}) {
  const email = opts.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  const data: { name: string; role: string; password?: string } = {
    name: opts.name,
    role: opts.role,
  };
  if (opts.password) {
    data.password = await bcrypt.hash(opts.password, 10);
  }
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data });
    return;
  }
  if (!opts.password) return;
  await prisma.user.create({
    data: { email, ...data },
  });
}
