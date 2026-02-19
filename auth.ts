import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
    async authorize(credentials) {
      console.log("Auth: authorize called")

      const email = credentials?.email as string
      const password = credentials?.password as string

      if (!email || !password) {
        console.log("Auth: Missing credentials")
        return null
      }

      console.log("Auth: Looking up user:", email)

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        console.log("Auth: User not found or no password")
        return null
      }

      console.log("Auth: Comparing password")

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        console.log("Auth: Invalid password")
        return null
      }

      console.log("Auth: Success for user:", user.email)

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  debug: false,
})