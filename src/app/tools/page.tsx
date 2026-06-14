import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/tools";

export const metadata: Metadata = {
  title: "Free Tools for Indian Students Going Abroad — EduDhruv",
  description: "Free calculators and tools for Indian students: EMI calculator, cost of studying calculator, scholarship eligibility, GRE/GMAT score estimator.",
  alternates: { canonical: URL },
  openGraph: { title: "Free Tools — EduDhruv", description: "Calculators for Indian students going abroad.", url: URL },
};

const TOOLS = [
  {
    href: "/tools/education-loan-emi-calculator",
    icon: "💰",
    title: "Education Loan EMI Calculator",
    description: "Calculate monthly EMI for any loan amount, interest rate, and tenure. Compare 5 rates side-by-side.",
    color: "#3AAFE5",
    cta: "Calculate EMI →",
    keywords: "EMI · Interest · Tenure",
  },
  {
    href: "/tools/cost-of-studying-abroad-calculator",
    icon: "🌍",
    title: "Cost of Studying Abroad Calculator",
    description: "Total cost in INR for 6 countries — tuition + living + visa + flights + EMI estimate.",
    color: "#F5A71A",
    cta: "Calculate Cost →",
    keywords: "Total cost · Per country · INR",
  },
  {
    href: "/tools/study-abroad-roi-calculator",
    icon: "📊",
    title: "Study Abroad ROI Calculator",
    description: "10-year ROI projection — will it pay off vs staying in India? Realistic salary + tax + EMI math.",
    color: "#10B981",
    cta: "Run the math →",
    keywords: "ROI · Salary · 10-yr projection",
  },
  {
    href: "/tools/university-shortlist-quiz",
    icon: "🎯",
    title: "University Shortlisting Quiz",
    description: "5 questions → 5 best-fit universities for your profile (country, field, budget, test scores).",
    color: "#8B5CF6",
    cta: "Take the quiz →",
    keywords: "Shortlist · Best-fit · 60 sec",
  },
  {
    href: "/free-guides/100-funded-scholarships",
    icon: "📚",
    title: "100% Funded Scholarships — Free PDF",
    description: "60+ fully-funded scholarships organized by country with deadlines + amounts + apply links.",
    color: "#B45309",
    cta: "Download free →",
    keywords: "PDF · 60+ scholarships · Free",
  },
  {
    href: "/tools/profile-evaluator",
    icon: "🎯",
    title: "Profile Evaluator",
    description: "Honest admission-chance estimate. Enter CGPA, GRE/GMAT, IELTS, work-ex → see your % chance at Top 10/30/50.",
    color: "#8B5CF6",
    cta: "Evaluate my profile →",
    keywords: "Chance % · 30 sec · Top 10/30/50",
  },
  {
    href: "/tools/application-timeline",
    icon: "📅",
    title: "Application Timeline Builder",
    description: "Personalised month-by-month checklist for your target intake. From shortlisting to packing flights.",
    color: "#6D28D9",
    cta: "Build my timeline →",
    keywords: "Per intake · Per country · Checklist",
  },
  {
    href: "/test-prep",
    icon: "📝",
    title: "Test Prep — GRE, GMAT, IELTS",
    description: "Complete guides for GRE, GMAT, IELTS — syllabus, fees, scoring, target bands for top universities.",
    color: "#3AAFE5",
    cta: "Browse test guides →",
    keywords: "Syllabus · Fees · Target scores",
  },
  {
    href: "/free-guides/sop-samples",
    icon: "📝",
    title: "SOP Samples Library — Free PDF",
    description: "3 complete winning SOPs (MS CS, MBA, MSc Finance) with line-by-line analysis of what made them work.",
    color: "#7C2D92",
    cta: "Download free →",
    keywords: "Full essays · Analysis · Free",
  },
  {
    href: "/admission-stories",
    icon: "❤️",
    title: "Real Admission Stories",
    description: "Read how Indian students got into MIT, Stanford, Oxford — their stats, prep, struggles, and advice.",
    color: "#991B1B",
    cta: "Read stories →",
    keywords: "Real students · By university · Inspiration",
  },
];

export default function ToolsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Tools</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          🧮 Free Tools for Indian Students
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
          Honest, accurate calculators built for Indian students going abroad. No signup. No data collected.
          Just answers in seconds.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href}
                className="block bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg hover:border-brand transition-all group">
            <div className="text-5xl mb-3">{t.icon}</div>
            <h2 className="font-extrabold text-xl text-gray-900 mb-1 group-hover:text-brand">{t.title}</h2>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">{t.keywords}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.description}</p>
            <span className="inline-flex items-center gap-1 font-bold" style={{ color: t.color }}>
              {t.cta}
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl p-8 text-white"
               style={{ background: "linear-gradient(135deg, #1a1a4a 0%, #3AAFE5 100%)" }}>
        <h2 className="text-2xl font-extrabold mb-2">More tools coming soon</h2>
        <p className="text-white/90 max-w-2xl">
          Scholarship eligibility checker · University admit chance estimator · GRE/GMAT score → university predictor ·
          Visa fee calculator. Bookmark this page or{" "}
          <Link href="/loan-portal" className="underline">talk to Priya</Link> for personalised guidance.
        </p>
      </section>
    </div>
  );
}
