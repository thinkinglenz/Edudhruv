/**
 * Best Education Loans for Indian Students 2027
 *
 * High-commercial-intent landing page targeting buyer-intent queries:
 *  - "best education loan for abroad study"
 *  - "HDFC Credila vs Avanse"
 *  - "education loan without collateral"
 *  - "student loan for MS in USA"
 *
 * Monetization:
 *  - AdSense placements above + below fold
 *  - Lead capture → /loan-portal (Priya AI counsellor)
 *  - Affiliate links (when approved) — currently nofollow sponsored
 *  - Internal links from all 50+ existing loan posts
 */
import type { Metadata } from "next";
import Link from "next/link";
import LoanComparisonTable from "@/components/loans/LoanComparisonTable";
import LenderCard from "@/components/loans/LenderCard";
import LoanDecisionTree from "@/components/loans/LoanDecisionTree";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import AffiliateDisclosure from "@/components/blog/AffiliateDisclosure";
import { LENDERS, BEST_OF_CATEGORIES, LAST_REVIEWED } from "@/lib/lenders";
import { breadcrumbSchema, faqFromContent } from "@/lib/seo-schemas";

const PAGE_URL = "https://www.edudhruv.com/best-education-loans";
const YEAR = new Date().getFullYear() + 1; // Forward-looking for "2027"

export const metadata: Metadata = {
  title: `Best Education Loans for Indian Students ${YEAR} — Complete Comparison`,
  description: `Compare ${LENDERS.length} top education loan providers for Indian students going abroad. Interest rates, max amounts, collateral, processing time. HDFC Credila vs Avanse vs Prodigy vs SBI vs MPOWER — updated for ${YEAR}.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Best Education Loans for Indian Students ${YEAR}`,
    description: `Side-by-side comparison of ${LENDERS.length} lenders. Find the right one in 60 seconds.`,
    url: PAGE_URL,
    type: "article",
    images: ["/logo.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    q: `What is the best education loan in India for studying abroad in ${YEAR}?`,
    a: `The "best" depends on your situation. SBI Global Ed-vantage has the lowest interest (8.5%–11%) but requires collateral and takes 30+ days. HDFC Credila is the largest education-loan NBFC, faster but slightly higher. For students without collateral, Prodigy Finance or MPOWER Financing offer collateral-free loans for top universities. Use our decision helper above to find your match.`,
  },
  {
    q: "Can I get an education loan without collateral?",
    a: `Yes. NBFCs like HDFC Credila, Avanse, and Auxilo offer up to ₹40-50 lakh without collateral if the co-applicant has good income. Beyond that, Prodigy Finance and MPOWER offer truly collateral-free loans (no co-signer needed either) for students admitted to their list of approved universities.`,
  },
  {
    q: "What is the minimum CIBIL score for an education loan?",
    a: `Indian banks/NBFCs typically want the co-applicant's CIBIL above 700. SBI prefers 750+. Global fintech lenders like Prodigy and MPOWER don't use Indian CIBIL — they evaluate the student's university, program, and post-graduation earning potential instead.`,
  },
  {
    q: "How long does an education loan take to get approved?",
    a: `Approval times vary widely: InCred and Avanse can approve in 3-7 days. HDFC Credila takes 7-10 days. ICICI takes 10-15. SBI is slowest at 30-45 days due to branch-based processing. Plan accordingly — start your loan application alongside your university application, not after.`,
  },
  {
    q: "Is education loan interest tax-deductible in India?",
    a: `Yes. Under Section 80E of the Income Tax Act, the entire interest paid on an education loan is deductible — with no upper limit — for up to 8 years from when you start repaying. This applies whether the loan is from a bank or notified NBFC. Save the interest certificate from your lender each year.`,
  },
  {
    q: "What's the moratorium period for education loans?",
    a: `Most Indian lenders offer "course duration + 6 months" as moratorium (you start EMIs only after that). SBI offers up to 1 year. Prodigy and MPOWER are "interest only" during the moratorium — interest accrues, but you only repay principal after graduation. Read the fine print: interest accruing during moratorium increases your total cost.`,
  },
  {
    q: "Should I take a loan from an Indian lender or a global fintech like Prodigy?",
    a: `Indian lenders are cheaper IF you have collateral (₹2-5 lakh saved over 5 years of EMIs). Global fintechs are better IF you don't have collateral, are admitted to a top university, and want USD/GBP disbursement directly. The "savings" from a lower Indian rate evaporate if exchange-rate movements work against you, since Indian loans give INR you'll convert to USD.`,
  },
  {
    q: "Can I prepay an education loan without penalty?",
    a: `Yes. RBI rules require all banks and NBFCs to allow education loan prepayment WITHOUT any penalty for floating-rate loans. Fixed-rate loans may have a 2-4% prepayment fee — check your sanction letter. Most students prepay aggressively after their post-graduation job to save on the long interest tail.`,
  },
];

const HOWTO_STEPS = [
  { name: "Get your university admission letter", text: "Lenders won't process your application without an admission offer (or conditional offer). Start with this." },
  { name: "Choose 2-3 lenders to apply with", text: "Apply to multiple lenders simultaneously — there's no rule against it. This gives you negotiating leverage when rates differ." },
  { name: "Gather documents", text: "Admission letter, academic records, co-applicant ITRs (last 3 years), property documents (if pledging collateral), university fee breakdown, passport." },
  { name: "Submit applications", text: "Most lenders allow online application. NBFCs are typically faster. SBI may require a branch visit." },
  { name: "Sanction & disbursement", text: "Once sanctioned, you'll sign a loan agreement. Funds are disbursed directly to the university (tuition) or your account (living expenses) per the disbursement schedule." },
  { name: "Plan repayment", text: "Use the moratorium wisely — start saving and tracking interest. Set up auto-debit for EMIs once you start earning." },
];

export default function BestEducationLoansPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Education Loan", url: "/education-loan" },
    { name: `Best Education Loans ${YEAR}`, url: "/best-education-loans" },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Best Education Loans for Indian Students ${YEAR}`,
    description: `Compare ${LENDERS.length} top education loan providers for Indian students going abroad.`,
    datePublished: "2026-06-09T00:00:00+05:30",
    dateModified: new Date(LAST_REVIEWED).toISOString(),
    inLanguage: "en-IN",
    author: { "@type": "Organization", name: "EduDhruv Editorial Team" },
    publisher: {
      "@type": "Organization", name: "EduDhruv",
      logo: { "@type": "ImageObject", url: "https://www.edudhruv.com/logo.jpg" },
    },
    mainEntityOfPage: PAGE_URL,
    url: PAGE_URL,
    isAccessibleForFree: true,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
    audience: { "@type": "Audience", audienceType: "Indian students applying for overseas education" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to apply for an education loan in India for overseas study",
    description: "Step-by-step process to apply for an education loan from Indian banks, NBFCs, or global fintech lenders.",
    totalTime: "PT30D",
    step: HOWTO_STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${PAGE_URL}#step-${i + 1}`,
    })),
  };

  // ItemList of lenders — helps AI extract as a ranked list
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top Education Loan Lenders for Indian Students ${YEAR}`,
    itemListOrder: "https://schema.org/ItemListOrderUnordered",
    numberOfItems: LENDERS.length,
    itemListElement: LENDERS.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialProduct",
        name: l.name,
        description: l.bestFor,
        url: `${PAGE_URL}#${l.slug}`,
        provider: { "@type": "Organization", name: l.name, url: l.officialUrl },
      },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/education-loan" className="hover:text-brand">Education Loan</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Best Education Loans {YEAR}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          🏦 Loan Comparison · Updated {new Date(LAST_REVIEWED).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4" data-speakable="true">
          Best Education Loans for Indian Students <span style={{ color: "#3AAFE5" }}>{YEAR}</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl" data-speakable="true">
          A side-by-side comparison of <strong>{LENDERS.length} education loan providers</strong> — Indian banks, NBFCs,
          and global fintechs. Updated interest rates, collateral requirements, processing times, and "best for"
          recommendations so you can decide in 60 seconds.
        </p>
      </header>

      {/* TL;DR */}
      <aside className="mb-8 rounded-xl border-l-4 px-5 py-4"
             style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}
             data-speakable="true" aria-label="Article summary">
        <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#3AAFE5" }}>💡 TL;DR</p>
        <p className="text-base leading-relaxed text-gray-800">
          For lowest interest: <strong>SBI Global Ed-vantage</strong> (8.5%-11%, needs collateral).
          Without collateral: <strong>Prodigy Finance</strong> or <strong>MPOWER</strong> (top universities only).
          Largest NBFC option: <strong>HDFC Credila</strong> (up to ₹1.5 Cr). Fastest approval: <strong>InCred</strong> (3-7 days).
        </p>
      </aside>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure />

      {/* "Best for" badges */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick picks by need</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BEST_OF_CATEGORIES.map(cat => {
            const winner = LENDERS.find(l => l.bestForCategory === cat.id);
            if (!winner) return null;
            return (
              <a key={cat.id} href={`#${winner.slug}`}
                 className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{cat.label}</p>
                <p className="font-bold text-gray-900 text-sm">{winner.shortName}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Decision tree */}
      <LoanDecisionTree />

      {/* Big comparison table */}
      <LoanComparisonTable />

      {/* Newsletter signup */}
      <div className="my-10">
        <NewsletterSignup sourceSlug="best-education-loans" variant="inline" />
      </div>

      {/* Lender detail cards */}
      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Full review of every lender
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Detailed breakdown of each option — pros, cons, who should apply.
        </p>
        <div className="space-y-6">
          {LENDERS.map(l => <LenderCard key={l.id} lender={l} />)}
        </div>
      </section>

      {/* How to apply (HowTo schema-backed) */}
      <section className="my-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          How to apply for an education loan
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          A clean 6-step process whether you're going through an Indian bank, NBFC, or global fintech.
        </p>
        <ol className="space-y-4">
          {HOWTO_STEPS.map((s, i) => (
            <li key={i} id={`step-${i + 1}`} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-5">
              <span className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: "#3AAFE5" }}>
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{s.name}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

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

      {/* Final CTA */}
      <section className="my-12 rounded-2xl p-8 sm:p-10 text-center text-white relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
          Still not sure which loan is right?
        </h2>
        <p className="text-white/90 mb-5 max-w-xl mx-auto">
          Chat with Priya — our AI counsellor — for a free personalised recommendation in 2 minutes.
        </p>
        <Link
          href="/loan-portal"
          className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          💬 Talk to Priya — Free →
        </Link>
      </section>
    </div>
  );
}
