import NextAuth from "next-auth"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        console.log('Auth attempt for:', credentials.email)
        
        const { email, password } = loginSchema.parse(credentials)

        const user = await prisma.user.findUnique({
          where: { email }
        })

        console.log('User found:', user ? { id: user.id, email: user.email, role: user.role } : 'null')

        if (!user || !user.password) {
          console.log('User not found or no password')
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        console.log('Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          console.log('Invalid password')
          throw new Error("Invalid credentials")
        }

        console.log('Auth successful for user:', user.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - token:', token, 'user:', user)
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session, 'token:', token)
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - url:', url, 'baseUrl:', baseUrl)
      // After successful login, redirect to admin
      if (url === baseUrl || url === '/') {
        return '/admin'
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return url
      }
      // Allow callback URLs on same origin
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    }
  },
  debug: process.env.NODE_ENV === 'development',
})

