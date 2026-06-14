/**
 * Test prep pages — /test-prep/{gre|gmat|ielts}
 *
 * Each targets ~50k-200k searches/mo across queries like:
 *   "what is GRE", "GRE syllabus", "GRE for Indian students"
 *   "GMAT focus edition", "GMAT scoring"
 *   "IELTS bands", "IELTS academic vs general"
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TESTS, getTestBySlug, LAST_REVIEWED, type TestPrep } from "@/lib/test-prep-data";
import AffiliateDisclosure from "@/components/blog/AffiliateDisclosure";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { breadcrumbSchema } from "@/lib/seo-schemas";

export const revalidate = 86400;

export async function generateStaticParams() {
  return TESTS.map(t => ({ test: t.slug }));
}

export async function generateMetadata({ params }: { params: { test: string } }): Promise<Metadata> {
  const t = getTestBySlug(params.test);
  if (!t) return {};
  const url = `https://www.edudhruv.com/test-prep/${t.slug}`;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: t.metaTitle, description: t.metaDescription, url, type: "article" },
  };
}

function buildSchemas(t: TestPrep, url: string) {
  const breadcrumb = breadcrumbSchema([
    { name: "Home",     url: "/" },
    { name: "Test Prep", url: "/test-prep" },
    { name: t.test,     url: `/test-prep/${t.slug}` },
  ]);

  const article = {
    "@context": "https://schema.org",
    "@type":   "Article",
    headline:  t.metaTitle,
    description: t.metaDescription,
    datePublished: LAST_REVIEWED,
    dateModified:  LAST_REVIEWED,
    inLanguage: "en-IN",
    author:    { "@type": "Organization", name: "EduDhruv Editorial Team" },
    publisher: {
      "@type": "Organization", name: "EduDhruv",
      logo: { "@type": "ImageObject", url: "https://www.edudhruv.com/logo.jpg" },
    },
    mainEntityOfPage: url,
    isAccessibleForFree: true,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: t.faqs.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return { breadcrumb, article, faq };
}

export default function TestPrepPage({ params }: { params: { test: string } }) {
  const t = getTestBySlug(params.test);
  if (!t) notFound();

  const url = `https://www.edudhruv.com/test-prep/${t.slug}`;
  const schemas = buildSchemas(t, url);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/test-prep" className="hover:text-brand">Test Prep</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{t.test}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-5xl">{t.icon}</span>
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
            Test Prep · Updated {new Date(LAST_REVIEWED).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          {t.test} for Indian Students
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl" data-speakable="true">
          {t.intro}
        </p>
      </header>

      {/* Quick facts */}
      <aside className="mb-8 rounded-xl border-2 overflow-hidden"
             style={{ borderColor: "#3AAFE5" }} data-speakable="true">
        <header className="px-5 py-3 text-white text-sm font-bold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          📊 {t.test} at a Glance
        </header>
        <dl className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 divide-gray-100 bg-white text-sm">
          <Stat label="Fee"            value={t.registrationFee} />
          <Stat label="Duration"       value={`${Math.floor(t.durationMinutes / 60)} hr ${t.durationMinutes % 60} min`} />
          <Stat label="Max score"      value={t.maxScore} short />
          <Stat label="Validity"       value={t.validityYears} />
          <Stat label="Test modes"     value={t.modes.length === 1 ? t.modes[0] : `${t.modes.length} modes`} />
          <Stat label="Retake policy"  value={t.retakePolicy.split(",")[0]} />
        </dl>
      </aside>

      <AffiliateDisclosure />

      {/* Who takes */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Who takes the {t.test}?</h2>
        <p className="text-gray-700 leading-relaxed">{t.whoTakes}</p>
      </section>

      {/* Sections breakdown */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{t.test} Exam Pattern</h2>
        <div className="space-y-4">
          {t.sections.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                <span className="text-xs font-bold text-gray-500">{s.duration} · {s.questions}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">What's tested:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-gray-700">
                {s.topics.map((topic, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">How {t.test} Scoring Works</h2>
        <p className="text-gray-700 leading-relaxed bg-blue-50 border-l-4 p-5 rounded-r-lg"
           style={{ borderColor: "#3AAFE5" }}>
          {t.scoringExplained}
        </p>
      </section>

      {/* Target scores */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Target Scores for Indian Students</h2>
        <p className="text-gray-500 text-sm mb-5">
          Based on actual admit data from top universities. Use as a benchmark to plan your prep.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm bg-white" data-speakable="true">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Target score</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Section breakdown</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Good for</th>
              </tr>
            </thead>
            <tbody>
              {t.recommendedScores.map((r, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i === t.recommendedScores.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3.5 whitespace-nowrap font-extrabold" style={{ color: "#3AAFE5" }}>{r.target}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-700">{r.section}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-800">{r.forWhat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <NewsletterSignup sourceSlug={`test-prep-${t.slug}`} variant="inline" />

      {/* Universities accepted */}
      <section className="my-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          Where the {t.test} is Accepted
        </h2>
        <ul className="space-y-2">
          {t.topUniversitiesAccepted.map((u, i) => (
            <li key={i} className="flex gap-3 bg-white rounded-lg border border-gray-100 p-4 text-sm">
              <span className="text-xl flex-shrink-0">🏛️</span>
              <span className="text-gray-700">{u}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prep timeline */}
      <section className="my-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {t.test} Preparation Timeline
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          <strong>{t.prepTimeline.label}</strong>
        </p>
        <div className="space-y-3">
          {t.prepTimeline.breakdown.map((p, i) => (
            <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-5">
              <span className="w-12 h-12 rounded-full text-white font-bold flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "#3AAFE5" }}>
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">{p.weeks}</p>
                <p className="text-sm text-gray-700">{p.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">
          Frequently Asked Questions about {t.test}
        </h2>
        <div className="space-y-3">
          {t.faqs.map(({ q, a }) => (
            <details key={q} className="bg-white rounded-xl border border-gray-100 p-5 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>{q}</span>
                <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Compare with other tests */}
      <section className="my-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Compare with other tests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TESTS.filter(other => other.slug !== t.slug).map(other => (
            <Link key={other.slug} href={`/test-prep/${other.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-brand hover:shadow-sm transition-all">
              <p className="text-2xl mb-1">{other.icon}</p>
              <p className="font-bold text-gray-900 text-sm">{other.test}</p>
              <p className="text-xs text-gray-500 mt-1">{other.fullName}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="my-12 rounded-2xl p-8 sm:p-10 text-center text-white"
               style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to plan your application?</h2>
        <p className="text-white/90 mb-5 max-w-xl mx-auto">
          Get personalised guidance on test prep, university shortlisting, and scholarships from Priya — free AI counsellor.
        </p>
        <Link href="/loan-portal"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl">
          💬 Talk to Priya — Free →
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value, short = false }: { label: string; value: string; short?: boolean }) {
  return (
    <div className="p-4">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</dt>
      <dd className={`font-extrabold text-gray-900 ${short ? "text-xs" : "text-sm sm:text-base"}`}>{value}</dd>
    </div>
  );
}
