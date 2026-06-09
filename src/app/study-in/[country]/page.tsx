/**
 * Programmatic country guide pages — /study-in/{country}
 *
 * Each page targets buyer-intent queries:
 *   - "study in {country} from India"          (1k-15k/mo)
 *   - "cost of studying in {country}"          (5k-50k/mo)
 *   - "{country} student visa for Indians"     (2k-10k/mo)
 *   - "best universities in {country}"         (5k-30k/mo)
 *
 * 6 countries × ~6-12 long-tail keywords each = potentially 50-100k
 * monthly impressions within 4-8 weeks of indexing.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES, getCountryBySlug, type CountryData } from "@/lib/countries";
import { getRecentScholarships } from "@/lib/scholarships";
import AffiliateDisclosure from "@/components/blog/AffiliateDisclosure";
import NewsletterSignup    from "@/components/blog/NewsletterSignup";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const YEAR = new Date().getFullYear() + 1;

export const revalidate = 86_400;

export async function generateStaticParams() {
  return COUNTRIES.map(c => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const c = getCountryBySlug(params.country);
  if (!c) return {};
  const url = `https://www.edudhruv.com/study-in/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title:       c.metaTitle,
      description: c.metaDescription,
      url,
      type:        "article",
      images:      ["/logo.jpg"],
    },
    twitter: { card: "summary_large_image" },
  };
}

function buildSchemas(c: CountryData, url: string) {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Indian Students Abroad", url: "/indian-students-abroad" },
    { name: `Study in ${c.name}`,     url: `/study-in/${c.slug}` },
  ]);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:    c.metaTitle,
    description: c.metaDescription,
    image:       `https://www.edudhruv.com/logo.jpg`,
    datePublished: "2026-06-09T00:00:00+05:30",
    dateModified:  new Date().toISOString(),
    inLanguage:  "en-IN",
    author:      { "@type": "Organization", name: "EduDhruv Editorial Team" },
    publisher:   {
      "@type": "Organization", name: "EduDhruv",
      logo: { "@type": "ImageObject", url: "https://www.edudhruv.com/logo.jpg" },
    },
    mainEntityOfPage: url,
    url,
    isAccessibleForFree: true,
    audience: { "@type": "Audience", audienceType: "Indian students applying for overseas education" },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const howto = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to get a ${c.visaType} for ${c.name} from India`,
    description: `Step-by-step process for Indian students applying for the ${c.name} student visa.`,
    totalTime: "P30D",
    step: c.visaSteps.map((s, i) => ({
      "@type":   "HowToStep",
      position:  i + 1,
      name:      s.title,
      text:      s.detail,
      url:       `${url}#visa-step-${i + 1}`,
    })),
  };

  // ItemList of top universities for AI ranked-list extraction
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top universities in ${c.name} for Indian students`,
    numberOfItems: c.topUniversities.length,
    itemListElement: c.topUniversities.map((u, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "EducationalOrganization", name: u },
    })),
  };

  return { breadcrumb, article, faq, howto, list };
}

export default async function CountryPage({ params }: { params: { country: string } }) {
  const c = getCountryBySlug(params.country);
  if (!c) notFound();

  const url = `https://www.edudhruv.com/study-in/${c.slug}`;
  const schemas = buildSchemas(c, url);

  // Pull scholarships that mention this country (cross-link to scholarships system)
  const allScholarships = await getRecentScholarships(20);
  const relevantScholarships = allScholarships.filter(s =>
    s.country.toLowerCase().includes(c.name.toLowerCase()) ||
    c.name.toLowerCase().includes(s.country.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.howto) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.list) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/indian-students-abroad" className="hover:text-brand">Indian Students Abroad</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Study in {c.name}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-5xl">{c.flag}</span>
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
            #{c.popularity} destination for Indian students
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          Study in {c.name} from India <span style={{ color: "#3AAFE5" }}>{YEAR}</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          {c.intro}
        </p>
      </header>

      {/* TL;DR / Key Facts box */}
      <aside className="mb-8 rounded-xl border-2 overflow-hidden"
             style={{ borderColor: "#3AAFE5" }}
             data-speakable="true">
        <header className="px-5 py-3 text-white text-sm font-bold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #2E8AB8 100%)" }}>
          📊 Quick Facts — {c.name} for Indian Students
        </header>
        <dl className="divide-y divide-gray-100 bg-white text-sm">
          <Row label="Indian students enrolled" value={c.indianStudentsCount} />
          <Row label="Tuition (per year)"        value={c.tuitionRange} />
          <Row label="Living cost (per year)"    value={c.livingCost} />
          <Row label="Student visa"              value={c.visaType} />
          <Row label="Visa processing time"      value={c.visaProcessing} />
          <Row label="Work while studying"       value={c.workWhileStudying} />
          <Row label="Post-study work"           value={c.postStudyWork} />
          <Row label="English requirement"       value={c.englishRequirement} />
        </dl>
      </aside>

      <AffiliateDisclosure />

      {/* Why study here */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Why Indian students choose {c.name}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.whyStudyHere.map((reason, i) => (
            <li key={i} className="flex gap-3 bg-white rounded-lg border border-gray-100 p-4">
              <span className="text-xl flex-shrink-0">✓</span>
              <span className="text-sm text-gray-700 leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top universities */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Top universities in {c.name}</h2>
        <p className="text-gray-600 text-sm mb-5">
          Best-known universities Indian students apply to most often:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.topUniversities.map((uni, i) => (
            <div key={uni} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-4">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                {i + 1}
              </span>
              <span className="font-semibold text-gray-900">{uni}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular courses */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Popular courses for Indian students</h2>
        <div className="flex flex-wrap gap-2">
          {c.popularCourses.map(course => (
            <span key={course} className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-semibold">
              {course}
            </span>
          ))}
        </div>
      </section>

      {/* Top cities */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Best cities for Indian students</h2>
        <div className="space-y-3">
          {c.topCities.map(city => (
            <div key={city.name} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="font-bold text-gray-900">📍 {city.name}</p>
              <p className="text-sm text-gray-600 mt-1">{city.for}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Monthly cost of living for Indian students in {c.name}</h2>
        <p className="text-gray-600 text-sm mb-5">
          Realistic monthly budget breakdown (single student, shared accommodation):
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm bg-white" data-speakable="true">
            <thead>
              <tr className="bg-gray-50 border-b-2">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Expense</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold">Monthly (INR)</th>
              </tr>
            </thead>
            <tbody>
              {c.averageMonthlyExpenses.map((e, i) => (
                <tr key={e.item} className={`border-b border-gray-100 ${i === c.averageMonthlyExpenses.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3.5 text-gray-800">{e.item}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">{e.inr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Newsletter mid-page */}
      <NewsletterSignup sourceSlug={`study-in-${c.slug}`} variant="inline" />

      {/* Visa process — HowTo schema-backed */}
      <section className="my-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          How to get a {c.visaType} from India
        </h2>
        <p className="text-gray-600 text-sm mb-5">
          Step-by-step process for Indian students applying for the {c.name} student visa.
        </p>
        <ol className="space-y-3">
          {c.visaSteps.map((s, i) => (
            <li key={i} id={`visa-step-${i + 1}`} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-5">
              <span className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: "#3AAFE5" }}>
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-700">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Documents required */}
      <section className="my-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Documents required</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            {c.documentsRequired.map(doc => (
              <li key={doc} className="flex gap-2">
                <span className="text-green-600">✓</span>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related scholarships */}
      {relevantScholarships.length > 0 && (
        <section className="my-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
            💯 100% Funded scholarships for {c.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relevantScholarships.map(s => (
              <Link key={s.id} href={s.post_slug ? `/scholarship/${s.post_slug}` : "#"}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1">{s.university_name}</p>
                <h3 className="font-bold text-gray-900 mb-2">{s.scholarship_name}</h3>
                {s.amount_inr && <p className="text-sm text-gray-700">💰 {s.amount_inr}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ — FAQPage schema */}
      <section className="my-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">
          Frequently Asked Questions about studying in {c.name}
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

      {/* Related country guides — internal linking */}
      <section className="my-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Compare with other study destinations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COUNTRIES.filter(other => other.slug !== c.slug).slice(0, 6).map(other => (
            <Link key={other.slug} href={`/study-in/${other.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-brand hover:shadow-sm transition-all">
              <p className="text-2xl mb-1">{other.flag}</p>
              <p className="font-bold text-gray-900 text-sm">Study in {other.name}</p>
              <p className="text-xs text-gray-500 mt-1">{other.indianStudentsCount} Indians</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="my-12 rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
          Need help applying to {c.name}?
        </h2>
        <p className="text-white/90 mb-5 max-w-xl mx-auto">
          Chat with Priya — our AI counsellor — for a free personalised study + loan plan in 2 minutes.
        </p>
        <Link href="/loan-portal"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          💬 Talk to Priya — Free →
        </Link>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 grid grid-cols-[180px_1fr] gap-3 items-start text-sm">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-gray-800 m-0 font-semibold">{value}</dd>
    </div>
  );
}
