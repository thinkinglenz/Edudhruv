import { NextRequest, NextResponse } from "next/server";

const COOKIE    = "edudhruv_admin_v1";
const PASSWORD  = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";
// Inline token generation — no imports needed (Edge Runtime safe)
const TOKEN     = btoa(`edudhruv::${PASSWORD}::admin_ok`).replace(/=/g, "");

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get(COOKIE)?.value;

    if (!session || session !== TOKEN) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
