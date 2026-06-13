import type { Metadata } from "next";
import Link from "next/link";
import LeadMagnetGate from "@/components/blog/LeadMagnetGate";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/free-guides/100-funded-scholarships";
const MAGNET_SLUG = "100-funded-scholarships-master-list";

export const metadata: Metadata = {
  title: "Free 100% Funded Scholarships Master List 2027 (PDF) — Indian Students",
  description: "Free downloadable master list of 100% funded scholarships at top universities worldwide for Indian students 2027. Knight-Hennessy, Rhodes, Gates Cambridge, Chevening + 50 more.",
  alternates: { canonical: URL },
  openGraph: { title: "Free Scholarships Master List 2027", description: "60+ fully funded scholarships in one downloadable guide.", url: URL },
};

export default function ScholarshipsMagnetPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Free Guides", url: "/free-guides/100-funded-scholarships" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Free Guides</span>
      </nav>

      <header className="mb-8 text-center max-w-3xl mx-auto">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#FEF3C7", color: "#B45309" }}>
          📚 Free Downloadable Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          100% Funded Scholarships Master List 2027
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Every fully-funded scholarship Indian students can apply to in 2027 —
          eligibility, deadlines, amounts, application links. Compiled in one downloadable guide.
        </p>
      </header>

      <LeadMagnetGate
        magnetSlug={MAGNET_SLUG}
        imageEmoji="📚"
        title="60+ Fully-Funded Scholarships in One Guide"
        description="Stop hunting across 50 different scholarship websites. Get every 100% funded scholarship Indian students qualify for in a single, organized PDF."
        expectedSize="20-page guide"
        highlights={[
          "60+ scholarships organized by country (USA, UK, Canada, Australia, Germany, Singapore)",
          "Exact deadlines for 2027 admission cycle",
          "Amount in INR + USD/GBP/EUR (no currency confusion)",
          "Application URL for every single one",
          "Top 5 'easiest to win' picks for Indian students",
        ]}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">What's inside</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Sample country="USA" flag="🇺🇸" scholarships={["Knight-Hennessy", "Fulbright-Nehru", "Tata Fellowship at MIT"]} />
          <Sample country="UK" flag="🇬🇧" scholarships={["Rhodes", "Clarendon at Oxford", "Gates Cambridge", "Chevening"]} />
          <Sample country="Canada" flag="🇨🇦" scholarships={["Vanier Canada Graduate", "McCall MacBain at McGill", "OGS"]} />
          <Sample country="Germany" flag="🇩🇪" scholarships={["DAAD", "Heinrich Böll Foundation", "Deutschlandstipendium"]} />
          <Sample country="Australia" flag="🇦🇺" scholarships={["Australia Awards", "Melbourne International", "Sydney Scholars"]} />
          <Sample country="Singapore" flag="🇸🇬" scholarships={["Lee Kuan Yew", "NUS Reliance Dhirubhai", "Tuition Grant Scheme"]} />
        </div>
      </section>

      <section className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
        <p className="text-gray-700 italic mb-2">
          "This list saved me weeks of research — I applied to 8 scholarships from this guide, got accepted at Clarendon Oxford with full funding."
        </p>
        <p className="text-xs text-gray-500">— Anjali R., MSc Computer Science, Oxford (Class of 2027)</p>
      </section>
    </div>
  );
}

function Sample({ country, flag, scholarships }: { country: string; flag: string; scholarships: string[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-2xl mb-2">{flag}</p>
      <p className="font-bold text-gray-900 mb-2">{country}</p>
      <ul className="space-y-1 text-sm text-gray-600">
        {scholarships.map(s => <li key={s}>· {s}</li>)}
        <li className="text-xs text-gray-400 italic">+ more inside</li>
      </ul>
    </div>
  );
}
