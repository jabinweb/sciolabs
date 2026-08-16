import NextAuth from "next-auth"
import authConfig from "./authConfig"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth(async function proxy() {
  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/crm/:path*'],
}
