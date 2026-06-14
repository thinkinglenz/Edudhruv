import type { Metadata } from "next";
import Link from "next/link";
import { getApprovedStories } from "@/lib/admission-stories";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/admission-stories";

export const metadata: Metadata = {
  title: "Real Admission Stories from Indian Students Abroad — EduDhruv",
  description: "Real admission stories from Indian students who got into MIT, Stanford, Oxford, NUS, ETH Zurich. Profiles, advice, funding sources. Share your own story to inspire others.",
  alternates: { canonical: URL },
};

export const revalidate = 3600;

const FLAGS: Record<string, string> = {
  USA: "🇺🇸", UK: "🇬🇧", Canada: "🇨🇦", Australia: "🇦🇺",
  Germany: "🇩🇪", Singapore: "🇸🇬", Other: "🌍",
};

export default async function AdmissionStoriesPage() {
  const stories = await getApprovedStories(50);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Admission Stories", url: "/admission-stories" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Admission Stories</span>
      </nav>

      <header className="mb-8 text-center max-w-2xl mx-auto">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#FEE2E2", color: "#991B1B" }}>
          ❤️ Real Stories from Real Students
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Admission Stories
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Real stories from Indian students who got into top universities abroad — their profile, prep, struggles, and advice for the next generation.
        </p>
        <Link href="/admission-stories/submit"
              className="inline-flex items-center gap-2 mt-5 bg-brand text-white font-bold px-6 py-3 rounded-xl hover:opacity-90"
              style={{ background: "#3AAFE5" }}>
          📝 Share your story →
        </Link>
      </header>

      {stories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-6xl mb-3">🌱</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Be the first to share!</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-5">
            We're collecting admission stories from Indian students. Submit yours and help inspire the next batch.
          </p>
          <Link href="/admission-stories/submit"
                className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-xl"
                style={{ background: "#3AAFE5" }}>
            📝 Submit your story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {stories.map(s => (
            <Link key={s.id} href={`/admission-stories/${s.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-brand transition-all">
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <span className="text-2xl">{FLAGS[s.country] || "🌍"}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {s.intake_year} · {s.degree}
                </span>
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2 leading-tight line-clamp-2">
                {s.headline}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{s.body.slice(0, 200)}…</p>
              <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                <p>{s.name} · {s.city_india || "India"}</p>
                <p className="text-gray-400 mt-0.5">{s.program} · {s.university}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
