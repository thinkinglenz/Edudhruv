import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoryBySlug, getApprovedStories } from "@/lib/admission-stories";
import { breadcrumbSchema } from "@/lib/seo-schemas";

export const revalidate = 3600;

const FLAGS: Record<string, string> = {
  USA: "🇺🇸", UK: "🇬🇧", Canada: "🇨🇦", Australia: "🇦🇺",
  Germany: "🇩🇪", Singapore: "🇸🇬", Other: "🌍",
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = await getStoryBySlug(params.slug);
  if (!s) return {};
  return {
    title: `${s.headline} — Admission Story`,
    description: `${s.name}'s story of getting into ${s.university} (${s.program}, ${s.intake_year}). Read the full journey + advice for future Indian applicants.`,
    alternates: { canonical: `https://www.edudhruv.com/admission-stories/${s.slug}` },
  };
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const s = await getStoryBySlug(params.slug);
  if (!s) notFound();

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Admission Stories", url: "/admission-stories" },
    { name: s.headline, url: `/admission-stories/${s.slug}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.headline,
    datePublished: s.created_at,
    inLanguage: "en-IN",
    author: { "@type": "Person", name: s.name },
    publisher: {
      "@type": "Organization", name: "EduDhruv",
      logo: { "@type": "ImageObject", url: "https://www.edudhruv.com/logo.jpg" },
    },
    isAccessibleForFree: true,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/admission-stories" className="hover:text-brand">Admission Stories</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700 line-clamp-1">{s.headline}</span>
      </nav>

      <article>
        <header className="mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-baseline gap-2 mb-3 flex-wrap">
            <span className="text-2xl">{FLAGS[s.country] || "🌍"}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {s.intake_year} · {s.degree} · {s.country}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            {s.headline}
          </h1>
          <p className="text-sm text-gray-500">
            By <strong className="text-gray-700">{s.name}</strong> · {s.city_india || "India"}
            <span className="mx-2">·</span>
            {s.program} at {s.university}
          </p>
        </header>

        {/* Stats card */}
        <aside className="mb-8 bg-gray-50 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Their profile</p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {s.cgpa        && <Stat label="CGPA" value={s.cgpa.toString()} />}
            {s.gre_score   && <Stat label="GRE" value={s.gre_score.toString()} />}
            {s.gmat_score  && <Stat label="GMAT" value={s.gmat_score.toString()} />}
            {s.ielts_band  && <Stat label="IELTS" value={s.ielts_band.toString()} />}
            {s.toefl_score && <Stat label="TOEFL" value={s.toefl_score.toString()} />}
            {s.work_years !== null && s.work_years !== undefined && <Stat label="Work exp" value={`${s.work_years} yr`} />}
          </dl>
          {s.funding_source && (
            <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
              <strong>💰 Funding:</strong> {s.funding_source}
              {s.scholarship_name && <> · {s.scholarship_name}</>}
            </p>
          )}
        </aside>

        {/* Story body */}
        <div className="prose prose-sm sm:prose-base max-w-none">
          {s.body.split("\n\n").map((p, i) => (
            <p key={i} className="text-gray-800 leading-relaxed mb-4">{p}</p>
          ))}
        </div>

        {/* Advice */}
        {s.advice && (
          <div className="mt-8 p-5 rounded-xl border-l-4" style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3AAFE5" }}>💡 {s.name}'s advice</p>
            <p className="text-sm text-gray-800 leading-relaxed">{s.advice}</p>
          </div>
        )}

        {/* CTA */}
        <section className="my-12 rounded-2xl p-8 text-center text-white"
                 style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
            You got in too?
          </h2>
          <p className="text-white/90 mb-4">Share your story to help future Indian students believe it's possible.</p>
          <Link href="/admission-stories/submit"
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-3 rounded-xl">
            📝 Share my story
          </Link>
        </section>
      </article>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-base font-extrabold text-gray-900">{value}</dd>
    </div>
  );
}
