import type { Metadata } from "next";
import Link from "next/link";
import { getRecentPosts } from "@/lib/supabase";
import PostCard from "@/components/blog/PostCard";
import AdvertiseForm from "./AdvertiseForm";

export const metadata: Metadata = {
  title: "Advertise with EduDhruv — Reach Indian Students Studying Abroad",
  description: "Reach 100,000+ Indian students researching study abroad each month. Banner ads, sponsored posts, featured listings — partner with India's trusted education platform.",
  alternates: { canonical: "https://www.edudhruv.com/advertise" },
};

export const revalidate = 3600;

const PACKAGES = [
  {
    name:     "Sponsored Article",
    price:    "₹25,000",
    duration: "Permanent placement",
    color:    "#3AAFE5",
    icon:     "📝",
    features: [
      "Full-length editorial article (1,500+ words)",
      "Written by our team — your brand voice",
      "Published under a senior counsellor by-line",
      "Dofollow backlink to your site",
      "Lifetime placement (no expiry)",
      "Distributed to 12K newsletter subscribers",
      "Permanent indexing on Google",
    ],
    cta: "Discuss content angle",
  },
  {
    name:     "Hero Banner",
    price:    "₹35,000",
    duration: "30 days",
    color:    "#F5A71A",
    badge:    "MOST POPULAR",
    icon:     "🎯",
    features: [
      "Rotating banner on homepage hero (1 of 5 slots)",
      "1.5M+ impressions over 30 days",
      "Appears on all category pages",
      "Featured in 4 newsletter editions",
      "Real-time click analytics dashboard",
      "We design the creative — no extra cost",
      "Targets Indian students directly",
    ],
    cta: "Book hero banner",
  },
  {
    name:     "Featured University",
    price:    "₹50,000",
    duration: "3 months",
    color:    "#8B5CF6",
    icon:     "🏛️",
    features: [
      "Dedicated featured listing in /top-universities",
      "Custom landing page on EduDhruv",
      "3 sponsored articles included",
      "Sidebar widget on 50+ related posts",
      "Lead capture form (we pass leads to you)",
      "Newsletter feature in 6 editions",
      "Quarterly performance report",
    ],
    cta: "Discuss partnership",
  },
];

export default async function AdvertisePage() {
  const featured = await getRecentPosts(6);

  return (
    <div className="bg-white">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-24 px-4 text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #1575A8 100%)" }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-widest mb-4">
            🎓 Advertise with EduDhruv
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
            Reach <span style={{ color: "#F5A71A" }}>100,000+</span> Indian Students<br />
            Researching Study Abroad Every Month
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-8">
            India's trusted education platform. Universities, education lenders, scholarship bodies,
            and ed-tech brands trust us to reach the most qualified study-abroad audience in the country.
          </p>
          <a
            href="#contact"
            className="inline-block bg-white font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            style={{ color: "#3AAFE5" }}
          >
            Start a Conversation →
          </a>
        </div>
      </section>

      {/* ── Audience stats ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: "100K+",  label: "Monthly visitors",        icon: "👥" },
            { value: "325+",  label: "Published guides",         icon: "📚" },
            { value: "12K",    label: "Newsletter subscribers",   icon: "📧" },
            { value: "85%",    label: "Indian student audience",  icon: "🇮🇳" },
          ].map(s => (
            <div key={s.label} className="text-center p-5 rounded-2xl border border-gray-100">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl sm:text-4xl font-extrabold mb-1" style={{ color: "#3AAFE5" }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why brands choose us ────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Why brands choose EduDhruv
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We're not a generic education portal — we specifically serve Indian students
              actively planning their study abroad journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "High-intent audience", text: "Our readers are actively researching universities, loans, and scholarships — not casual browsers." },
              { icon: "💼", title: "Premium SEO",          text: "Each guide ranks for high-intent commercial keywords. Sponsored content benefits from our authority." },
              { icon: "🤝", title: "Direct attribution",    text: "We pass qualified leads directly to you. No third-party tracking nonsense." },
            ].map(b => (
              <div key={b.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad packages ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Advertising Packages
          </h2>
          <p className="text-gray-500">Three ways to partner with us. Prices in INR, billed once.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PACKAGES.map(p => (
            <div
              key={p.name}
              className="relative rounded-2xl p-6 border-2 transition-all hover:shadow-lg"
              style={{ borderColor: p.badge ? p.color : "#E5E7EB" }}
            >
              {p.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                  style={{ background: p.color }}
                >
                  {p.badge}
                </span>
              )}
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-extrabold text-xl text-gray-900 mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold" style={{ color: p.color }}>{p.price}</span>
              </div>
              <p className="text-xs text-gray-400 mb-5">{p.duration}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0" style={{ color: p.color }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block w-full text-center py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
                style={{ background: p.color }}
              >
                {p.cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Custom packages, scholarship sponsorships and bulk deals available — contact us below.
        </p>
      </section>

      {/* ── Featured content showcase ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "#3AAFE5" }}>
                Editorial Quality
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                Recent Featured Content
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Your sponsored articles sit alongside our authority guides like these.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Client logos / trust strip ──────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Trusted by leading brands in the Indian education space</p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-gray-400 font-bold text-base sm:text-lg">
          <span>SBI Education Loan</span>
          <span>·</span>
          <span>HDFC Credila</span>
          <span>·</span>
          <span>Prodigy Finance</span>
          <span>·</span>
          <span>MPOWER</span>
          <span>·</span>
          <span>Avanse</span>
        </div>
      </section>

      {/* ── Contact form ────────────────────────────────────────── */}
      <section id="contact" className="bg-gray-50 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Let's Talk
            </h2>
            <p className="text-gray-500">
              Tell us about your brand and goals — we'll respond within 24 hours.
            </p>
          </div>
          <AdvertiseForm />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Prefer email?</p>
            <a href="mailto:edudruv@gmail.com?subject=Advertising%20enquiry"
               className="font-semibold hover:underline" style={{ color: "#3AAFE5" }}>
              edudruv@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Common Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do you measure performance?", a: "All sponsored content includes click and engagement metrics. Hero banners get real-time impression and CTR dashboards. We share a custom report monthly." },
            { q: "Can I supply my own creative?",   a: "Yes — for hero banners we accept 728×90 (leaderboard) and 300×250 (sidebar) GIFs or static images. For sponsored articles we recommend you let us write to fit our editorial voice for best engagement." },
            { q: "Do you do affiliate partnerships?", a: "Yes — we are active members of multiple affiliate programs (Amazon, CJ, Impact). For education lenders, we offer custom referral arrangements above a minimum spend." },
            { q: "What's the minimum commitment?",   a: "₹15,000 for a single sidebar banner spot. We don't do impressions-based ads — only flat-rate placements." },
            { q: "How do you handle disclosure?",    a: "All paid content is clearly labelled 'Sponsored' or 'Partner Content' per FTC and ASCI guidelines. We never hide commercial relationships from readers." },
          ].map(f => (
            <details key={f.q} className="group rounded-xl border border-gray-200 px-5 py-4">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 list-none">
                <span>{f.q}</span>
                <span className="text-xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Schema for advertising service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type":    "Service",
            name:       "Advertising on EduDhruv",
            provider:   { "@type": "Organization", name: "EduDhruv", url: "https://www.edudhruv.com" },
            areaServed: "IN",
            description: "Advertising and sponsored content services targeting Indian students studying abroad.",
            offers: PACKAGES.map(p => ({
              "@type":          "Offer",
              name:             p.name,
              priceCurrency:    "INR",
              price:            p.price.replace(/[^0-9]/g, ""),
              description:      p.features.join(". "),
            })),
          }),
        }}
      />
    </div>
  );
}
