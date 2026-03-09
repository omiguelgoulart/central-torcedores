import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;
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

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as
      | "SUPER_ADMIN"
      | "OPERACIONAL"
      | "PORTARIA"
      | undefined;

    if (role === "PORTARIA" && isLoginPage) {
      const redirectUrl = new URL("/admin/check-in", req.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (role === "PORTARIA" && !isCheckinRoute) {
      const redirectUrl = new URL("/admin/check-in", req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
