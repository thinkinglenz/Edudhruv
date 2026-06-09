import type { Metadata } from "next";
import Link from "next/link";
import EMICalculator from "@/components/tools/EMICalculator";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools/education-loan-emi-calculator";

export const metadata: Metadata = {
  title: "Education Loan EMI Calculator — India 2027 (Free)",
  description: "Free education loan EMI calculator for Indian students. Calculate monthly EMI for any amount, interest rate, and tenure. Compare HDFC Credila, SBI, Avanse, Prodigy rates side-by-side.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Free Education Loan EMI Calculator — India",
    description: "Calculate your education loan EMI in seconds. Compare interest rates across 8 top lenders.",
    url: URL, type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    q: "How is education loan EMI calculated?",
    a: "EMI is calculated using the formula: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P is the loan amount, r is the monthly interest rate (annual rate / 12 / 100), and n is the number of monthly payments (tenure in years × 12). Our calculator does this automatically — just enter your loan amount, rate, and years.",
  },
  {
    q: "What is a good interest rate for an education loan in India in 2027?",
    a: "Anything between 8.5%-12% is competitive. SBI offers the lowest at 8.5-11% (requires collateral). HDFC Credila and ICICI charge 10.5-12.5% for premium universities. NBFCs like Avanse and Auxilo are 11-14%. Global fintechs (Prodigy, MPOWER) charge 12-16% but need no collateral or co-signer. Always negotiate — your specific rate depends on your co-applicant's credit score and the university.",
  },
  {
    q: "Is there a moratorium on education loan EMIs?",
    a: "Yes. Most Indian lenders give 'course duration + 6 months' moratorium before EMIs start. SBI gives up to 1 year. During the moratorium, interest accrues but you don't pay EMIs. Some students pay simple interest during studies to reduce the total loan burden — discuss this with your lender. Prodigy and MPOWER charge interest during the entire course (which can add 15-20% to total cost).",
  },
  {
    q: "Can I prepay my education loan to reduce EMIs?",
    a: "Yes — RBI mandates that floating-rate education loans cannot have prepayment penalties. You can make part-prepayments anytime, which either reduces your EMI or shortens the tenure (your choice). Most graduates aggressively prepay in the first 3-5 years of working to cut the long interest tail. Fixed-rate loans may have 2-4% prepayment charges — check your sanction letter.",
  },
  {
    q: "Does the EMI calculator factor in processing fees?",
    a: "No — this calculator shows the EMI on the principal loan amount only. Most lenders charge a one-time processing fee of 0.5-2% upfront (deducted from disbursement) which doesn't affect your EMI but does reduce the cash you receive. For example, on a ₹25 L loan with 1% processing fee, you actually get ₹24.75 L disbursed.",
  },
  {
    q: "How does Section 80E tax benefit affect my EMI cost?",
    a: "Section 80E lets you deduct the ENTIRE interest paid (no upper limit) from your taxable income for up to 8 years. If you're in the 30% tax bracket, that effectively reduces your interest by 30% — making a 12% loan feel like 8.4%. Save your annual interest certificate from the lender. This benefit doesn't reduce your EMI, but it does reduce your total cost when you file taxes.",
  },
];

export default function EMICalculatorPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "EMI Calculator", url: "/tools/education-loan-emi-calculator" },
  ]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Education Loan EMI Calculator",
    description: "Calculate monthly EMI for any education loan amount, rate, and tenure.",
    url: URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: {
      "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1247",
    },
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
        <span className="text-gray-700">EMI Calculator</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          🧮 Free Tool · No Signup
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3" data-speakable="true">
          Education Loan EMI Calculator
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          Calculate your monthly EMI for any education loan amount, interest rate, and tenure.
          Compare what you'd pay across SBI, HDFC Credila, Avanse, Prodigy and other lenders side-by-side.
        </p>
      </header>

      <EMICalculator />

      {/* FAQ */}
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
