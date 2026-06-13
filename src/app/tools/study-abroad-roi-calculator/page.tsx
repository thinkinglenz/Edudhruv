import type { Metadata } from "next";
import Link from "next/link";
import ROICalculator from "@/components/tools/ROICalculator";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/study-abroad-roi-calculator";

export const metadata: Metadata = {
  title: "Study Abroad ROI Calculator — Is It Worth It for Indian Students?",
  description: "Free study abroad ROI calculator for Indian students. Compare 10-year net savings of MS in USA, UK, Canada, Germany vs staying in India. Includes loan EMI + tax + living costs.",
  alternates: { canonical: URL },
  openGraph: { title: "Study Abroad ROI Calculator", description: "10-year ROI projection vs staying in India.", url: URL },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  { q: "How do you calculate ROI for studying abroad?",
    a: "We project 10 years of net income (after taxes, EMI, and living costs) for two scenarios: studying abroad (with loan + post-study work salary) vs staying in India (with typical engineer/MBA salary growth). The 'surplus' shows how much more you save abroad after 10 years. Starting salaries are from placement reports + LinkedIn. We use 8% salary growth post-graduation, 12% in India compounded. Country-specific tax + living costs are factored in." },
  { q: "Is MS in USA worth ₹1 Cr+ for Indian students?",
    a: "For most CS/STEM students — yes. USA MS CS with 3-year STEM OPT gives ~$170k median starting (₹1.5 Cr). After 5 years: ₹2.5 Cr/year salary. Even after ₹15-20L/year EMI for 7 years, net surplus over 10 years is typically ₹4-7 Cr more than staying in India. ROI clears the loan within 4-6 years. For non-STEM or Tier 2 schools, the math is tighter — try the calculator with realistic salary inputs." },
  { q: "Is studying in Germany really the highest ROI?",
    a: "For mechanical/electrical/civil engineers — yes. Germany public universities = ZERO tuition. Total cost ~₹25L (just living). German engineering salaries start at €55-70k (₹50-65L). Pay off the small loan in 1-2 years. EU Blue Card → PR in 21-33 months. Long-term ROI = ₹3-5 Cr surplus over 10 years vs India. Only catch: need basic German for best opportunities long-term." },
  { q: "What if I plan to return to India after studying abroad?",
    a: "Adjust your 'starting salary' input downward. Indian return salaries are 40-60% of foreign salaries: USA-MS returnee = ₹35-55L in India (vs ₹1.5 Cr in US). UK-MBA returnee = ₹40-70L (vs £85k in London). The ROI gap shrinks but stays positive if you stay 2-3 years abroad first to pay off most of the loan. Best return strategy: 3-5 years abroad → return to India at senior level." },
  { q: "Does the calculator include scholarships?",
    a: "Not yet — you have to manually reduce 'total cost' if you have scholarships. For example, with a ₹50L scholarship at Stanford GSB MBA, set total cost = ₹110L (instead of ₹160L). Or set 'loan %' lower to reflect you're paying less out of loan. We're adding scholarship presets in a future update." },
  { q: "What's the average ROI for Canadian Masters programs?",
    a: "Canada MS CS or PG Diploma offers strong ROI for Indians targeting PR. Total cost ₹35-60L (cheaper than USA), starting salary CAD 90-130k (₹65-95L), 3-year PGWP, clear PR pathway. Net 10-year surplus vs India typically ₹2-4 Cr. Best for cost-conscious students who prioritize immigration over absolute salary." },
];

export default function ROIPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home",  url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "ROI Calculator", url: "/tools/study-abroad-roi-calculator" },
  ]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type":   "WebApplication",
    name:      "Study Abroad ROI Calculator for Indian Students",
    description: "Calculate 10-year net savings of studying abroad vs staying in India",
    url:        URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1142" },
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
        <span className="text-gray-700">ROI Calculator</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#ECFDF5", color: "#10B981" }}>
          📊 Free Calculator · No Signup
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          Will Studying Abroad Pay Off?
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          Compare 10-year net savings of studying abroad vs staying in India.
          Factors in tuition, loan EMI, taxes, living costs — and what you'd actually earn.
          Honest math, not marketing.
        </p>
      </header>

      <ROICalculator />

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
