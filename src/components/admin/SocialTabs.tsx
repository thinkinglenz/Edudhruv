"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/social",           label: "📤 Publish",   exact: true  },
  { href: "/admin/social/analytics", label: "📊 Analytics", exact: false },
];

export default function SocialTabs() {
  const path = usePathname();
  return (
    <div className="border-b border-gray-800 px-6 -mt-2 mb-4">
      <nav className="flex gap-1">
        {TABS.map(t => {
          const active = t.exact ? path === t.href : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                active
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200 border-transparent"
              }`}
              style={active ? { borderColor: "#3AAFE5", color: "#3AAFE5" } : {}}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
