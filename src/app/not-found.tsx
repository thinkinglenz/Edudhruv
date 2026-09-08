import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — EduDhruv",
  description: "That page moved or no longer exists. Explore our study-abroad guides, education loans, scholarships and free tools instead.",
  robots: { index: false, follow: true },
};

const POPULAR = [
  { href: "/best-education-loans", label: "💰 Best Education Loans", desc: "Compare lenders for study abroad" },
  { href: "/scholarships", label: "🎓 Scholarships", desc: "Funded scholarships for Indian students" },
  { href: "/tools/education-loan-emi-calculator", label: "🧮 EMI Calculator", desc: "Work out your loan repayment" },
  { href: "/study-in/uk", label: "🇬🇧 Study in the UK", desc: "Costs, visas, universities" },
  { href: "/latest", label: "📰 Latest Guides", desc: "Newest study-abroad articles" },
  { href: "/free-counselling", label: "💬 Free Counselling", desc: "Get a callback in 24 hours" },
];

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
      <p className="text-6xl font-extrabold mb-3" style={{ color: "#3AAFE5" }}>404</p>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
        This page moved or doesn't exist
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        No worries — the guide you're after is probably one click away. Here's where
        most students go next:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-10">
        {POPULAR.map((p) => (
          <Link key={p.href} href={p.href}
                className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-brand hover:shadow-sm transition">
            <span className="font-bold text-gray-900">{p.label}</span>
            <span className="block text-sm text-gray-500 mt-0.5">{p.desc}</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-xl text-white" style={{ background: "#3AAFE5" }}>
          ← Back to Home
        </Link>
        <Link href="/search" className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-xl border-2" style={{ borderColor: "#3AAFE5", color: "#3AAFE5" }}>
          🔍 Search the site
        </Link>
      </div>
    </div>
  );
}
