import { NextRequest, NextResponse } from "next/server";

const COOKIE    = "edudhruv_admin_v2";
const PASSWORD  = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";
// Full-access token = password + 2FA verified (or password only if 2FA disabled)
const FULL_TOKEN = btoa(`edudhruv::${PASSWORD}::admin_ok`).replace(/=/g, "");
// Partial token = password OK, 2FA pending — can only access /admin/login
const PWD_TOKEN  = btoa(`edudhruv::${PASSWORD}::pwd_pending`).replace(/=/g, "");

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get(COOKIE)?.value;

    // Reject if no session OR partial session (pwd ok but 2FA pending)
    if (!session || (session !== FULL_TOKEN && session !== PWD_TOKEN)) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    // If only pwd_pending, force them back to login for 2FA step
    if (session === PWD_TOKEN) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("step", "2fa");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
