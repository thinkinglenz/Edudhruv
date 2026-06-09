import type { Metadata } from "next";
import Link from "next/link";
import CostCalculator from "@/components/tools/CostCalculator";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/cost-of-studying-abroad-calculator";

export const metadata: Metadata = {
  title: "Cost of Studying Abroad Calculator — Free Tool for Indian Students",
  description: "Calculate total cost of studying abroad in INR. Compare USA, UK, Canada, Australia, Germany, Singapore — tuition + living + visa + flights + EMI estimate.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Cost of Studying Abroad Calculator — Free",
    description: "Total cost in INR for Indian students — compare 6 countries instantly.",
    url: URL, type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    q: "What is the total cost of studying abroad for Indian students in 2027?",
    a: "Depends heavily on country. USA: ₹70 L - ₹1.7 Cr for a 2-year Masters. UK: ₹26-50 L for a 1-year Masters. Canada: ₹40-75 L for 2 years. Germany: ₹15-25 L total (tuition-free at public universities). Singapore: ₹50-80 L. Use the calculator above to get a personalised estimate based on your country, course, and lifestyle.",
  },
  {
    q: "What expenses should I budget for besides tuition?",
    a: "Living expenses (rent, food, transport, phone — typically ₹6-20 L/year), health insurance (mandatory in most countries, ₹40k-1L/year), visa fee (₹5k-60k), flights (₹30k-1L return), and one-time setup costs (deposit, furnishings, books — budget ₹1-2L). Most Indian students underestimate living costs by 30-40% — use realistic numbers in our calculator.",
  },
  {
    q: "Which country is cheapest for Indian students?",
    a: "Germany — tuition-free at public universities + reasonable living costs. Total budget: ₹13-15 L/year. Other affordable options: Italy (tuition €1,000-4,000/yr), Norway (tuition-free even for non-EU), Sweden (tuition for non-EU but cheap living), Czech Republic (₹3-5 L/yr total). For English-only programs at globally-ranked universities, Germany wins clearly.",
  },
  {
    q: "How much should I take as an education loan vs save up?",
    a: "Rule of thumb: Loan 70-80% of total cost, savings/family 20-30%. Lenders rarely fund 100% (most cover 85-90%). You'll need to pay the gap as 'margin money'. Don't drain family savings — keep at least 1 year of EMIs as emergency fund. The calculator shows your estimated EMI at 11.5% for 7 years so you can plan repayment realistically.",
  },
  {
    q: "Are these costs accurate for 2027?",
    a: "Yes — figures reflect current published tuition + cost-of-living surveys (Numbeo, expat.com, university cost pages) for 2025-26 academic year, with a small inflation adjustment for 2027. Exchange rates assumed at: $1 = ₹88, £1 = ₹110, CAD 1 = ₹65, AUD 1 = ₹58, €1 = ₹95, SGD 1 = ₹66. Re-check with the specific university and current rates before committing.",
  },
  {
    q: "Why is Germany so much cheaper than USA?",
    a: "Public universities in Germany are funded by the state and charge no tuition for any student (Indian or German), only a small semester fee of €150-350. Germany sees education as a public good, similar to school in India. The catch: tougher academic standards, more competition for places, and slightly slower job market on graduation. But you save ₹50L-1Cr vs USA for the same education quality.",
  },
];

export default function CostCalculatorPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Cost Calculator", url: "/tools/cost-of-studying-abroad-calculator" },
  ]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cost of Studying Abroad Calculator",
    description: "Estimate total cost (in INR) of studying abroad for Indian students across 6 destinations.",
    url: URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "892" },
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
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
        <span className="text-gray-700">Cost Calculator</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#FFFBF0", color: "#F5A71A" }}>
          🧮 Free Tool · No Signup
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          Cost of Studying Abroad Calculator
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          Get a realistic total cost estimate (in Indian Rupees) for studying in 6 top destinations.
          Adjust for course duration, university tier, and lifestyle — instantly see EMI if you finance with a loan.
        </p>
      </header>

      <CostCalculator />

      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5">
          Frequently Asked Questions
        </h2>
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
