import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req: any) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/api/auth/signin', req.nextUrl))
  }
})

// Optionally, don't invoke Proxy on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
