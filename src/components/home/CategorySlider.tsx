"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const ALL = { slug: "all", name: "All Topics", icon: "🌐" };

export default function CategorySlider({ active = "all" }: { active?: string }) {
  const items = [ALL, ...CATEGORIES];

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Scrollable row — hides scrollbar visually */}
        <div
          className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((cat) => {
            const isActive = cat.slug === active;
            const href = cat.slug === "all" ? "/" : `/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={href}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-gray-600 bg-gray-100 hover:bg-brand-light hover:text-brand"
                }`}
                style={isActive ? { background: "#3AAFE5", color: "#fff" } : {}}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
