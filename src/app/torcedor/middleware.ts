import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get("auth")?.value;

    if (!tokenCookie) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
