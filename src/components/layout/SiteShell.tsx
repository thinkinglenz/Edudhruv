"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin       = pathname.startsWith("/admin");
  const isLeadMagnet  = pathname.startsWith("/lead-magnets");
  const isEmbed       = pathname.startsWith("/embed");

  // No site chrome on admin, lead-magnet (print-friendly), or embed
  // (widgets shown inside an <iframe> on OTHER sites — chrome-free).
  if (isAdmin || isLeadMagnet || isEmbed) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
