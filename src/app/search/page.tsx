/**
 * Server-rendered search results page — for shareable URLs + SEO.
 *
 * /search?q=education+loan
 */
import type { Metadata } from "next";
import Link from "next/link";
import { searchSite } from "@/lib/search";
import { breadcrumbSchema } from "@/lib/seo-schemas";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const q = (searchParams.q || "").trim().slice(0, 100);
  if (!q) {
    return {
      title: "Search — EduDhruv",
      description: "Search across 325+ guides, scholarships, calculators and universities for Indian students going abroad.",
      robots: { index: false },
    };
  }
  return {
    title: `Search: ${q} — EduDhruv`,
    description: `Search results for "${q}" across EduDhruv guides, scholarships, calculators and universities.`,
    alternates: { canonical: `https://www.edudhruv.com/search?q=${encodeURIComponent(q)}` },
    robots: { index: false }, // Don't index search pages themselves
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim().slice(0, 200);
  const data = q ? await searchSite(q, 50) : null;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Search", url: "/search" },
    ...(q ? [{ name: q, url: `/search?q=${encodeURIComponent(q)}` }] : []),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Search{q ? `: ${q}` : ""}</span>
      </nav>

      {/* Search form */}
      <form action="/search" method="get" className="mb-8">
        <div className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus-within:border-brand transition-colors">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" name="q" defaultValue={q}
            placeholder="Search posts, scholarships, tools…"
            className="flex-1 text-base bg-transparent text-gray-900 placeholder-gray-400 outline-none border-0"
            autoFocus={!q}
          />
          <button type="submit"
                  className="text-sm font-bold text-white px-4 py-2 rounded-lg"
                  style={{ background: "#3AAFE5" }}>
            Search
          </button>
        </div>
      </form>

      {/* No query */}
      {!q && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Search EduDhruv</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Search across 325+ guides, scholarships, calculators, and universities. Try:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-md mx-auto">
            {["education loan", "MIT scholarship", "study in canada", "EMI calculator", "fully funded oxford", "MBA usa"].map(s => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                    className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-brand-light hover:text-brand transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {q && data && (
        <>
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {data.total > 0
                ? <>Found <span style={{ color: "#3AAFE5" }}>{data.total} results</span> for "{q}"</>
                : <>No results for "{q}"</>}
            </h1>
            <p className="text-xs text-gray-500 mt-1">Searched in {data.durationMs}ms</p>
          </header>

          {data.total === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
              <p className="text-5xl mb-3">🤔</p>
              <p className="text-gray-700 font-semibold mb-2">No matches found</p>
              <p className="text-sm text-gray-500 mb-5">Try shorter or different keywords.</p>
              <Link href="/" className="inline-block text-white text-sm font-bold px-5 py-3 rounded-lg"
                    style={{ background: "#3AAFE5" }}>
                Browse the homepage →
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Quick links */}
              {data.grouped.pages.length > 0 && (
                <Section label="Quick Links" results={data.grouped.pages} />
              )}
              {/* Scholarships */}
              {data.grouped.scholarships.length > 0 && (
                <Section label="100% Funded Scholarships" results={data.grouped.scholarships} />
              )}
              {/* Articles */}
              {data.grouped.posts.length > 0 && (
                <Section label="Articles & Guides" results={data.grouped.posts} />
              )}
              {/* Universities */}
              {data.grouped.universities.length > 0 && (
                <Section label="Universities" results={data.grouped.universities} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Section({ label, results }: { label: string; results: any[] }) {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{label}</h2>
      <div className="space-y-2">
        {results.map((r, i) => (
          <Link key={`${r.type}-${i}`} href={r.url}
                className="block bg-white border border-gray-100 rounded-xl p-4 hover:border-brand hover:shadow-sm transition-all">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 hover:text-brand">{r.title}</h3>
              {r.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
                  {r.badge}
                </span>
              )}
            </div>
            {r.subtitle && <p className="text-xs text-gray-500 mt-0.5 capitalize">{r.subtitle}</p>}
            {r.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.excerpt}</p>}
            <p className="text-[10px] text-gray-400 mt-1 font-mono">{r.url}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
