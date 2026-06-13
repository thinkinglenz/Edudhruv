"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin       = pathname.startsWith("/admin");
  const isLeadMagnet  = pathname.startsWith("/lead-magnets");

  // No site chrome on admin OR lead-magnet pages (print-friendly)
  if (isAdmin || isLeadMagnet) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
