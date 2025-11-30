import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;
  const role = req.cookies.get("adminRole")?.value as
    | "SUPER_ADMIN"
    | "OPERACIONAL"
    | "PORTARIA"
    | undefined;

  const isLoginPage = pathname === "/admin/login";
  const isCheckinRoute = pathname.startsWith("/admin/check-in");

  if (!token) {
    if (!isLoginPage) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (role === "PORTARIA" && isLoginPage) {
    const redirectUrl = new URL("/admin/check-in", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (role === "PORTARIA" && !isCheckinRoute) {
    const redirectUrl = new URL("/admin/check-in", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
