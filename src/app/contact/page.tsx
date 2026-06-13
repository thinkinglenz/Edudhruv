import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/blog/ContactForm";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const URL = "https://www.edudhruv.com/contact";

export const metadata: Metadata = {
  title: "Contact EduDhruv — Get in Touch with Our Team",
  description: "Have a question about education loans, scholarships, or studying abroad? Send us a message — we respond within 48 hours. Or email edudruv@gmail.com directly.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Contact EduDhruv",
    description: "We respond to every message within 48 hours.",
    url: URL, type: "website",
  },
};

const CONTACT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: URL,
  name: "Contact EduDhruv",
  description: "Contact form + email for EduDhruv — India's study-abroad guidance platform.",
  mainEntity: {
    "@type": "Organization",
    name: "EduDhruv",
    email: "edudruv@gmail.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "edudruv@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  },
};

export default function ContactPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_SCHEMA) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Contact</span>
      </nav>

      {/* Header */}
      <header className="mb-8 text-center max-w-2xl mx-auto">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          ✉️ Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          Talk to EduDhruv
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Questions, partnerships, content corrections — we read every message and aim to reply within 48 hours.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Form */}
        <div>
          <ContactForm />
        </div>

        {/* Sidebar: alternative ways to reach us */}
        <aside className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Other ways to reach us</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">📧 Email</p>
                <a href="mailto:edudruv@gmail.com" className="font-semibold text-gray-800 hover:underline" style={{ color: "#3AAFE5" }}>
                  edudruv@gmail.com
                </a>
              </li>
              <li>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">⏱ Response time</p>
                <p className="text-gray-700">Within 48 hours, usually faster on weekdays</p>
              </li>
              <li>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">🌍 Languages</p>
                <p className="text-gray-700">English, Hindi</p>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl p-6 border" style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}>
            <h2 className="font-bold mb-3" style={{ color: "#3AAFE5" }}>
              💬 Need immediate help?
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              Chat with Priya — our free AI counsellor — for instant guidance on loans, scholarships, or universities.
            </p>
            <Link
              href="/loan-portal"
              className="block text-center text-white font-semibold py-2.5 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity"
              style={{ background: "#3AAFE5" }}
            >
              Chat with Priya →
            </Link>
          </div>

          {/* For advertisers */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-2">📣 Advertisers & Partners</h2>
            <p className="text-xs text-gray-600 mb-3">
              Reach 100,000+ Indian students through sponsored content, affiliate partnerships, or display ads.
            </p>
            <Link href="/advertise" className="text-sm font-bold hover:underline" style={{ color: "#F5A71A" }}>
              View advertising packages →
            </Link>
          </div>

          {/* Browse topics */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-3">Common questions</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/best-education-loans" className="text-gray-700 hover:underline" style={{ color: "#3AAFE5" }}>
                  → Compare education loans
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-gray-700 hover:underline" style={{ color: "#3AAFE5" }}>
                  → 100% funded scholarships
                </Link>
              </li>
              <li>
                <Link href="/tools/education-loan-emi-calculator" className="text-gray-700 hover:underline" style={{ color: "#3AAFE5" }}>
                  → EMI calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/cost-of-studying-abroad-calculator" className="text-gray-700 hover:underline" style={{ color: "#3AAFE5" }}>
                  → Cost of studying calculator
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
