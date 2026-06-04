import Link from "next/link";
import LeadForm from "@/components/blog/LeadForm";
import { SidebarAd } from "@/components/ads/AdSlot";
import RotatingBanner from "@/components/ads/RotatingBanner";
import { CATEGORIES } from "@/lib/categories";
import type { StaticPage } from "@/lib/pages";

interface Props {
  page: StaticPage;
}

export default function StaticPageLayout({ page }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-5">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{page.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Main content */}
        <article>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 pb-4 border-b-2"
              style={{ borderColor: "#3AAFE5" }}>
            {page.title}
          </h1>

          <div
            className="prose-blog max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Footer CTA */}
          <div className="mt-12 p-6 rounded-xl border-2 text-center"
               style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}>
            <h3 className="font-bold text-xl mb-2" style={{ color: "#3AAFE5" }}>
              🎓 Ready to Study Abroad?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get free expert guidance — education loans, scholarships, university selection.
            </p>
            <Link
              href="/loan-portal"
              className="inline-block bg-white border-2 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors"
              style={{ borderColor: "#3AAFE5", color: "#3AAFE5" }}
            >
              Chat with Priya →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <RotatingBanner size="sidebar" interval={5000} />

          <div className="rounded-xl p-5 border"
               style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}>
            <h3 className="font-bold text-lg mb-1" style={{ color: "#3AAFE5" }}>
              🎓 Get Free Guidance
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Our counsellor Priya calls you within 24 hours.
            </p>
            <LeadForm />
          </div>

          <SidebarAd />

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b border-gray-100"
                style={{ color: "#555555" }}>
              Browse Topics
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.filter(c => c.slug !== "latest").map(cat => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`}
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-brand py-0.5 group">
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span className="group-hover:underline">{cat.name}</span>
                    </span>
                    <span className="text-gray-300 group-hover:text-brand">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
