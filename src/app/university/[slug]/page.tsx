/**
 * University detail pages — /university/{slug}
 *
 * Each page targets 20-50 long-tail buyer-intent queries:
 *   - "{University} fees India"
 *   - "{University} acceptance rate Indian students"
 *   - "{University} scholarships for Indians"
 *   - "{University} application deadline 2027"
 *   - "{University} placement statistics"
 *   - "{University} vs {Other University}"
 *
 * 5 deeply-detailed pages (MIT, Stanford, Harvard, Oxford, Cambridge) =
 * ~150 ranking keyword opportunities. We'll grow this to 50 over time.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  UNIVERSITY_DETAILS,
  getUniversityBySlug,
  LAST_REVIEWED,
  type UniversityDetail,
} from "@/lib/universities-detail";
import AffiliateDisclosure from "@/components/blog/AffiliateDisclosure";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { breadcrumbSchema } from "@/lib/seo-schemas";

export const revalidate = 86400; // 1 day

export async function generateStaticParams() {
  return UNIVERSITY_DETAILS.map(u => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const u = getUniversityBySlug(params.slug);
  if (!u) return {};
  const url = `https://www.edudhruv.com/university/${u.slug}`;
  return {
    title: u.metaTitle,
    description: u.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: u.metaTitle,
      description: u.metaDescription,
      url,
      type: "article",
      images: [u.imageUrl],
    },
    twitter: { card: "summary_large_image" },
  };
}

function buildSchemas(u: UniversityDetail, url: string) {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Top Universities", url: "/top-universities" },
    { name: u.shortName, url: `/university/${u.slug}` },
  ]);

  const collegeSchema = {
    "@context": "https://schema.org",
    "@type":    "CollegeOrUniversity",
    name:       u.name,
    alternateName: u.shortName,
    url,
    image:      u.imageUrl,
    foundingDate: u.founded.toString(),
    address: {
      "@type":      "PostalAddress",
      addressLocality: u.city,
      addressCountry:  u.country,
    },
    sameAs: [],
    description: u.intro,
  };

  const article = {
    "@context": "https://schema.org",
    "@type":   "Article",
    headline:  u.metaTitle,
    description: u.metaDescription,
    image:     u.imageUrl,
    datePublished: LAST_REVIEWED,
    dateModified:  LAST_REVIEWED,
    inLanguage: "en-IN",
    author:    { "@type": "Organization", name: "EduDhruv Editorial Team" },
    publisher: {
      "@type": "Organization",
      name:    "EduDhruv",
      logo:    { "@type": "ImageObject", url: "https://www.edudhruv.com/logo.jpg" },
    },
    mainEntityOfPage: url,
    isAccessibleForFree: true,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
    audience: { "@type": "Audience", audienceType: "Indian students applying for overseas education" },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: u.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name:    q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  // ItemList of programs for AI ranked-list extraction
  const programList = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       `Popular programs at ${u.shortName} for Indian students`,
    numberOfItems: u.topPrograms.length,
    itemListElement: u.topPrograms.map((p, i) => ({
      "@type":   "ListItem",
      position:  i + 1,
      item: {
        "@type":   "Course",
        name:      p.name,
        provider:  { "@type": "CollegeOrUniversity", name: u.name },
        educationalLevel: p.degree,
      },
    })),
  };

  return { breadcrumb, collegeSchema, article, faq, programList };
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const u = getUniversityBySlug(params.slug);
  if (!u) notFound();

  const url = `https://www.edudhruv.com/university/${u.slug}`;
  const schemas = buildSchemas(u, url);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collegeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.programList) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/top-universities" className="hover:text-brand">Top Universities</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{u.shortName}</span>
      </nav>

      {/* Hero image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-gray-200">
        <Image
          src={u.imageUrl}
          alt={`${u.name} campus`}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          quality={75}
          className="object-cover"
          priority
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800">
          🌍 QS World Rank #{u.qsRank}
        </div>
      </div>

      {/* Hero text */}
      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          🏛️ University Guide · Updated {new Date(LAST_REVIEWED).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          {u.name}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          {u.intro}
        </p>
        <p className="text-sm text-gray-400 mt-3">
          📍 {u.city}, {u.country} · Founded {u.founded} · Student body: {u.totalStudents}
        </p>
      </header>

      {/* Quick Facts box */}
      <aside className="mb-10 rounded-xl border-2 overflow-hidden"
             style={{ borderColor: "#3AAFE5" }}
             data-speakable="true">
        <header className="px-5 py-3 text-white text-sm font-bold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          📊 {u.shortName} at a Glance — for Indian Students
        </header>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-white text-sm">
          <Stat label="Indian students enrolled" value={u.indianStudents} />
          <Stat label="Acceptance rate"           value={u.acceptanceRate} />
          <Stat label="International students"    value={u.intlStudents} />
          <Stat label="Tuition (per year)"        value={u.tuitionRange} />
          <Stat label="Total cost (per year)"     value={u.totalCostRange} />
          <Stat label="Avg starting salary"       value={u.avgStartingSalaryINR} />
        </dl>
      </aside>

      <AffiliateDisclosure />

      {/* Why study here */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          Why Indian students choose {u.shortName}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {u.whyApply.map((reason, i) => (
            <li key={i} className="flex gap-3 bg-white rounded-lg border border-gray-100 p-4">
              <span className="text-xl flex-shrink-0">✓</span>
              <span className="text-sm text-gray-700 leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top programs */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Top programs at {u.shortName} for Indian students
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Most-applied-to programs by Indian students, with current cost + admission stats.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm bg-white" data-speakable="true">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Program</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Duration</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Annual fee</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Avg GRE/GMAT</th>
              </tr>
            </thead>
            <tbody>
              {u.topPrograms.map((p, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i === u.topPrograms.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.degree}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-700">{p.duration}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-gray-800">{p.annualFeeINR}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-700">
                    {p.avgGRE && <span className="block">{p.avgGRE}</span>}
                    {p.avgIELTS && <span className="block text-gray-500">IELTS {p.avgIELTS}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Application info */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">📅 Application Deadlines</h3>
          <ul className="space-y-3">
            {u.applicationDeadlines.map((d, i) => (
              <li key={i} className="border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                <p className="font-semibold text-gray-900 text-sm">{d.intake}</p>
                <p className="text-xs text-gray-600 mt-0.5">{d.deadline}</p>
                {d.notes && <p className="text-[11px] text-gray-400 mt-0.5">{d.notes}</p>}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Application fee: <strong>{u.applicationFee}</strong>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">📋 What You Need to Apply</h3>
          <ul className="space-y-1.5 text-sm">
            {u.applicationRequirements.map((req, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup sourceSlug={`university-${u.slug}`} variant="inline" />

      {/* Indian alumni + placements */}
      <section className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3">🇮🇳 Notable Indian Alumni</h3>
          <ul className="space-y-2 text-sm">
            {u.indianAlumniNotable.map((a, i) => (
              <li key={i} className="text-gray-700">⭐ {a}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3">💰 Placement & Salary</h3>
          <p className="text-2xl font-extrabold text-green-700 mb-1">{u.avgStartingSalaryINR}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Average starting salary</p>
          <p className="text-sm text-gray-700">{u.placementSupport}</p>
        </div>
      </section>

      {/* Accommodation */}
      <section className="my-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          🏠 Accommodation at {u.shortName}
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 text-sm">
          <div>
            <p className="font-bold text-gray-900 mb-1">On-campus</p>
            <p className="text-gray-700">{u.accommodation.onCampus}</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">Off-campus</p>
            <p className="text-gray-700">{u.accommodation.offCampus}</p>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <p className="font-bold text-gray-900 mb-1">Typical monthly rent (INR)</p>
            <p className="text-blue-700 font-semibold">{u.accommodation.monthlyINR}</p>
          </div>
        </div>
      </section>

      {/* Scholarships — link to /scholarships */}
      <section className="my-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          🎓 Scholarships Available at {u.shortName}
        </h2>
        <p className="text-gray-600 text-sm mb-5">
          Indian students can apply to multiple scholarships in parallel. Funded options for {u.shortName}:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {u.scholarshipsAvailable.map((s, i) => (
            <li key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-2">
              <span className="text-xl">🏆</span>
              <span className="text-sm text-gray-700">{s}</span>
            </li>
          ))}
        </ul>
        <Link href="/scholarships"
              className="inline-flex items-center gap-2 mt-5 text-white font-bold px-5 py-3 rounded-xl"
              style={{ background: "#3AAFE5" }}>
          Browse all 100% Funded Scholarships →
        </Link>
      </section>

      {/* FAQ */}
      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">
          Frequently Asked Questions about {u.shortName}
        </h2>
        <div className="space-y-3">
          {u.faqs.map(({ q, a }) => (
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

      {/* Compare with other universities */}
      <section className="my-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Compare with other top universities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {UNIVERSITY_DETAILS.filter(o => o.slug !== u.slug).map(o => (
            <Link key={o.slug} href={`/university/${o.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-brand hover:shadow-sm transition-all">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">QS #{o.qsRank}</p>
              <p className="font-bold text-gray-900 text-sm">{o.shortName}</p>
              <p className="text-xs text-gray-500 mt-1">{o.country} · {o.indianStudents} Indians</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="my-12 rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
          Ready to apply to {u.shortName}?
        </h2>
        <p className="text-white/90 mb-5 max-w-xl mx-auto">
          Chat with Priya for a personalised application plan + loan + scholarship suggestions in 2 minutes.
        </p>
        <Link href="/loan-portal"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          💬 Talk to Priya — Free →
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</dt>
      <dd className="text-base sm:text-lg font-extrabold text-gray-900">{value}</dd>
    </div>
  );
}
