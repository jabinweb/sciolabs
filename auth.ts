import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,


  // MUST be JWT for Credentials
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { email, password } = loginSchema.parse(credentials)

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as typeof user & { role?: string }

        token.id = u.id
        token.role = u.role
      }

      return token
    },


    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }

      return session
    },

    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === "/") return "/admin"
      if (url.startsWith("/")) return url
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  debug: process.env.NODE_ENV === "development",
})
