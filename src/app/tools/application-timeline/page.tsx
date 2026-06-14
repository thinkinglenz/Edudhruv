import type { Metadata } from "next";
import Link from "next/link";
import ApplicationTimeline from "@/components/tools/ApplicationTimeline";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/application-timeline";

export const metadata: Metadata = {
  title: "Study Abroad Application Timeline Tool — When to Start Applying",
  description: "Free study abroad application timeline tool for Indian students. Personalised month-by-month checklist for your target intake (Fall 2027 / Spring 2028) and country.",
  alternates: { canonical: URL },
  openGraph: { title: "Application Timeline Builder", description: "Personalised month-by-month checklist.", url: URL },
};

const FAQS = [
  { q: "When should I start applying for Fall 2027 study abroad?",
    a: "Start in January-March 2026 (about 16-18 months before intake). Critical first steps: shortlist universities, take diagnostic GRE/GMAT, identify recommenders. Most US Masters deadlines fall in December 2026 — but scholarship deadlines (Rhodes, Knight-Hennessy, Gates) are 4-6 months earlier in July-October 2026. Don't wait until after summer 2026 — you'll miss major scholarships." },
  { q: "What's the latest I can start applying for Fall 2027?",
    a: "Hard cutoff: 6 months before intake (March 2027 for Fall 2027) — but only for rolling-admissions programs at lower-ranked universities. For top US/UK/Canada universities with December 2026 deadlines, you should have already taken GRE/IELTS and started SOPs by September 2026. Late starts dramatically reduce scholarship options and require accepting any offer you get." },
  { q: "How long does GRE/GMAT/IELTS prep take?",
    a: "GRE: 2-3 months for full-time students, 4-5 months for working professionals. GMAT: 3-4 months focused prep, 5-6 months for working professionals. IELTS: 6-8 weeks for Indians from English-medium schools. Build in a 1-2 month buffer for potential retakes — most Indians retake at least one test." },
  { q: "When should I apply for an education loan for Fall 2027?",
    a: "Start loan research 6-8 months before intake (Jan-Mar 2027 for Fall 2027). Get pre-approval letters from 2-3 lenders before applying for visa — strengthens financial profile. Final loan sanction typically takes 2-4 weeks after admit. Don't wait until last minute — visa interviews require loan sanction letters." },
  { q: "What's the typical timeline for student visa processing?",
    a: "USA F-1: 3-5 weeks (varies by consulate; Mumbai fastest). UK Tier 4: 3 weeks standard, 5 days priority. Canada Study Permit: 8-12 weeks regular, 20 days via SDS (with IELTS 6.0+, 1-year tuition paid). Australia Subclass 500: 4-6 weeks. Germany National Student Visa: 6-12 weeks (slowest). Plan to apply 8-12 weeks before intake to allow buffer." },
];

export default function ApplicationTimelinePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Application Timeline", url: "/tools/application-timeline" },
  ]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type":   "WebApplication",
    name:      "Study Abroad Application Timeline Builder",
    description: "Month-by-month checklist for Indian students applying abroad",
    url:        URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Application Timeline</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#F3E8FF", color: "#7C2D92" }}>
          📅 Free Tool · Personalised
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          When should I start applying?
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          Get a personalised month-by-month application timeline for your target intake — from
          shortlisting universities to packing your bags. Built for Indian students applying to
          USA, UK, Canada, Germany, Australia, and Singapore.
        </p>
      </header>

      <ApplicationTimeline />

      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
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
    </div>
  );
}
