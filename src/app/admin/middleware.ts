// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const token = req.cookies.get("adminToken")?.value

  if (pathname === "/admin/login") {
    if (token) {
      const dashboardUrl = new URL("/admin", req.url)
      return NextResponse.redirect(dashboardUrl)
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
