/**
 * Course landing pages — /courses/{slug}
 *
 * 10 high-traffic course×country pages targeting buyer-intent queries.
 * Each ranks for 5-20 related long-tail searches.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { COURSES, getCourseBySlug, LAST_REVIEWED, type CourseData } from "@/lib/courses-data";
import { getUniversityBySlug } from "@/lib/universities-detail";
import AffiliateDisclosure from "@/components/blog/AffiliateDisclosure";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { breadcrumbSchema } from "@/lib/seo-schemas";

export const revalidate = 86400;

export async function generateStaticParams() {
  return COURSES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = getCourseBySlug(params.slug);
  if (!c) return {};
  const url = `https://www.edudhruv.com/courses/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url, type: "article" },
    twitter: { card: "summary_large_image" },
  };
}

function buildSchemas(c: CourseData, url: string) {
  const breadcrumb = breadcrumbSchema([
    { name: "Home",           url: "/" },
    { name: "Courses",        url: "/courses" },
    { name: `${c.course} (${c.country})`, url: `/courses/${c.slug}` },
  ]);

  const course = {
    "@context": "https://schema.org",
    "@type":    "Course",
    name:       c.course,
    description: c.metaDescription,
    provider:   { "@type": "Organization", name: "Multiple universities", url: `https://www.edudhruv.com/study-in/${c.countrySlug}` },
    educationalLevel: c.degree,
    inLanguage: "en-IN",
    timeRequired: `P${c.durationYears.match(/\d+/)?.[0] || "2"}Y`,
    occupationalCredentialAwarded: c.degree,
    audience: { "@type": "Audience", audienceType: "Indian students applying overseas" },
    hasCourseInstance: {
      "@type":  "CourseInstance",
      courseMode: "FullTime",
      location: { "@type": "Place", name: c.country },
    },
  };

  const article = {
    "@context": "https://schema.org",
    "@type":   "Article",
    headline:  c.metaTitle,
    description: c.metaDescription,
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
    mainEntity: c.faqs.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const universityList = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       `Top universities for ${c.course} in ${c.country}`,
    numberOfItems: c.topUniversities.length,
    itemListElement: c.topUniversities.map((u, i) => ({
      "@type":   "ListItem",
      position:  i + 1,
      item: { "@type": "CollegeOrUniversity", name: u },
    })),
  };

  return { breadcrumb, course, article, faq, universityList };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const c = getCourseBySlug(params.slug);
  if (!c) notFound();

  const url = `https://www.edudhruv.com/courses/${c.slug}`;
  const schemas = buildSchemas(c, url);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.course) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.universityList) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/courses" className="hover:text-brand">Courses</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{c.course} ({c.country})</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-5xl">{c.flag}</span>
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
            🎓 {c.degree} · Updated {new Date(LAST_REVIEWED).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          {c.course} in {c.country}{" "}
          <span style={{ color: "#3AAFE5" }}>for Indian Students</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          {c.intro}
        </p>
      </header>

      {/* Quick facts */}
      <aside className="mb-8 rounded-xl border-2 overflow-hidden"
             style={{ borderColor: "#3AAFE5" }}
             data-speakable="true">
        <header className="px-5 py-3 text-white text-sm font-bold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          📊 Quick Facts
        </header>
        <dl className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 bg-white text-sm">
          <Stat label="Duration"           value={c.durationYears} />
          <Stat label="Annual tuition"     value={c.tuitionAnnualINR} />
          <Stat label="Total cost"         value={c.totalCostINR} />
          <Stat label="Starting salary"    value={c.startingSalaryINR} short />
        </dl>
      </aside>

      <AffiliateDisclosure />

      {/* Why choose */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          Why Indian students choose {c.course} in {c.country}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.whyChoose.map((reason, i) => (
            <li key={i} className="flex gap-3 bg-white rounded-lg border border-gray-100 p-4">
              <span className="text-xl flex-shrink-0">✓</span>
              <span className="text-sm text-gray-700 leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top universities */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Top universities for {c.course} in {c.country}
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Most-applied-to programs by Indian students:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.topUniversities.map((uniName, i) => {
            const matchedSlug = c.topUniversitySlugs[i] ||
              c.topUniversitySlugs.find(s => {
                const u = getUniversityBySlug(s);
                return u && uniName.toLowerCase().includes(u.shortName.toLowerCase());
              });
            const hasPage = !!(matchedSlug && getUniversityBySlug(matchedSlug));
            const inner = (
              <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-4 h-full">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{uniName}</p>
                  {hasPage && <p className="text-xs text-brand mt-0.5" style={{ color: "#3AAFE5" }}>View full guide →</p>}
                </div>
              </div>
            );
            return hasPage ? (
              <Link key={i} href={`/university/${matchedSlug}`} className="block hover:shadow-md transition-shadow rounded-lg">
                {inner}
              </Link>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* Application details */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3">📅 Application Timeline</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-2">
              <span className="text-gray-500">Intake</span>
              <span className="font-semibold text-gray-900 text-right">{c.intakeMonth}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-gray-500">Deadline</span>
              <span className="font-semibold text-gray-900 text-right">{c.appDeadline}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-gray-500">English</span>
              <span className="font-semibold text-gray-900 text-right">{c.englishRequired}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-gray-500">Post-study visa</span>
              <span className="font-semibold text-gray-900 text-right">{c.postStudyVisa}</span>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3">📋 Tests Required</h3>
          <ul className="space-y-1.5 text-sm">
            {c.testsRequired.map((t, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Scholarships</p>
            <p className="text-xs text-gray-600 leading-relaxed">{c.scholarshipsHint}</p>
          </div>
        </div>
      </section>

      <NewsletterSignup sourceSlug={`course-${c.slug}`} variant="inline" />

      {/* Career outcomes */}
      <section className="my-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          💰 Career outcomes after {c.course} in {c.country}
        </h2>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">Starting salary range</p>
          <p className="text-3xl font-extrabold text-green-700 mb-2">{c.startingSalaryINR}</p>
          <p className="text-xs text-gray-500">Based on placement reports from top universities + LinkedIn salary data</p>
        </div>
        <h3 className="font-bold text-gray-900 mb-3">Popular jobs Indian graduates land:</h3>
        <ul className="space-y-2">
          {c.popularJobs.map((job, i) => (
            <li key={i} className="flex gap-3 bg-white rounded-lg border border-gray-100 p-4 text-sm">
              <span className="text-xl flex-shrink-0">💼</span>
              <span className="text-gray-700">{job}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {c.faqs.map(({ q, a }) => (
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

      {/* Related courses */}
      <section className="my-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Explore other courses</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COURSES.filter(other => other.slug !== c.slug).slice(0, 6).map(other => (
            <Link key={other.slug} href={`/courses/${other.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-brand hover:shadow-sm transition-all">
              <p className="text-2xl mb-1">{other.flag}</p>
              <p className="font-bold text-gray-900 text-sm">{other.course}</p>
              <p className="text-xs text-gray-500 mt-1">{other.country}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="my-12 rounded-2xl p-8 sm:p-10 text-center text-white"
               style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
          Ready to apply for {c.course} in {c.country}?
        </h2>
        <p className="text-white/90 mb-5 max-w-xl mx-auto">
          Chat with Priya for personalised university shortlist + loan options in 2 minutes.
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
      <dd className={`font-extrabold text-gray-900 ${short ? "text-sm" : "text-base sm:text-lg"}`}>{value}</dd>
    </div>
  );
}
