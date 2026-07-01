import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Adapter } from "next-auth/adapters"
import { prisma } from "@/lib/prisma"
import authConfig from "./authConfig"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.AUTH_SECRET,
  providers: [...authConfig.providers],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user.email) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { updatedAt: new Date() },
          })
        } catch {
          // User may not exist yet for OAuth flows; credentials users always exist
        }
      }
      return true
    },
  },
})
