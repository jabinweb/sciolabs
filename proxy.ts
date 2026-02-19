import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  console.log('Proxy: Path', request.nextUrl.pathname)
  
  // Just allow requests to pass through - authentication will be handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}