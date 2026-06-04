"use client";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Admin layout — wraps every page under /admin.
 *
 * Defense in depth against indexing:
 *   1. robots.txt — Disallow: /admin/  (in src/app/robots.ts)
 *   2. HTTP header — X-Robots-Tag: noindex, nofollow, noarchive  (in next.config.js)
 *   3. HTML <meta name="robots" content="noindex,nofollow"> below
 *   4. Middleware auth — unauthed users redirected to /admin/login
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  // <meta> in layouts gets hoisted to <head> in Next.js 14
  const noIndexMeta = (
    <>
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      <meta name="googlebot" content="noindex, nofollow" />
      <meta name="bingbot" content="noindex, nofollow" />
    </>
  );

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {noIndexMeta}
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {noIndexMeta}
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
