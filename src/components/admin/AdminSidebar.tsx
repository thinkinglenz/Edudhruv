"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const NAV_SECTIONS = [
  {
    label: "Content",
    items: [
      { href: "/admin",          icon: "⊞",  label: "Dashboard" },
      { href: "/admin/posts",    icon: "📝",  label: "Posts" },
      { href: "/admin/comments", icon: "💬",  label: "Comments" },
      { href: "/admin/banners",  icon: "🖼️",  label: "Banners" },
    ],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/leads",    icon: "👥",  label: "Leads" },
      { href: "/admin/users",    icon: "👤",  label: "Users" },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/admin/marketing", icon: "📣", label: "Marketing" },
      { href: "/admin/social",    icon: "📤", label: "Social Sharing" },
      { href: "/admin/quora",     icon: "✍️", label: "Quora Engine" },
      { href: "/admin/seo",       icon: "🔍", label: "SEO" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/agent",    icon: "🤖",  label: "Blog Agent" },
      { href: "/admin/tools",    icon: "🛠️",  label: "Bulk Tools" },
      { href: "/admin/settings", icon: "⚙️",  label: "Settings & Keys" },
      { href: "/admin/profile",  icon: "👤",  label: "My Profile" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      {/* Logo — text version to avoid JPG white-background patch */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-baseline gap-0.5 mb-1">
          <span className="text-white font-extrabold text-lg tracking-tight">EDU</span>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: "#3AAFE5" }}>DHRUV</span>
          <span className="text-base ml-0.5" style={{ color: "#F5A71A", lineHeight: 1 }}>★</span>
        </div>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-2 mb-1.5">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    style={isActive(item.href) ? { background: "#3AAFE5", color: "#fff" } : {}}
                  >
                    <span className="text-base leading-none w-5 text-center">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: view site + logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <span className="text-base w-5 text-center">🌐</span> View Site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <span className="text-base w-5 text-center">↩</span> Log Out
        </button>
      </div>
    </aside>
  );
}
