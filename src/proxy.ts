import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isOnDashboard = pathname.startsWith('/dashboard')
  
  // 1. Auth Protection Logic (from proxy.ts)
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.nextUrl))
  }

  // 2. Set Pathname Header (from middleware.ts)
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
