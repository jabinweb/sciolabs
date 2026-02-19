import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // allow auth routes
  if (pathname.startsWith("/auth")) return

  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return Response.redirect(new URL("/auth/signin", req.url))
    }

    if (req.auth.user.role !== "admin") {
      return Response.redirect(new URL("/", req.url))
    }
  }
})

export const config = {
  matcher: ["/admin/:path*"],
}
