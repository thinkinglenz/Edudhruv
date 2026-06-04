import type { Metadata } from "next";
import Link from "next/link";
import { AUTHORS } from "@/lib/authors";

export const metadata: Metadata = {
  title: "Editorial Standards — EduDhruv",
  description: "How EduDhruv researches, writes, fact-checks and updates every guide. Our editorial process, sourcing standards, and corrections policy.",
  alternates: { canonical: "https://www.edudhruv.com/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose-blog">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Editorial Standards</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 pb-4 border-b-2"
          style={{ borderColor: "#3AAFE5" }}>
        Editorial Standards
      </h1>

      <p className="text-gray-500 text-sm mb-8">
        Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <p className="lead text-lg text-gray-700 mb-8">
        EduDhruv is India's trusted study abroad guidance platform. Every guide on this site is
        researched, written, and reviewed by experienced education counsellors — and we want you to
        know exactly how we do it.
      </p>

      <h2>Our Editorial Mission</h2>
      <p>
        Our mission is simple: <strong>help Indian students make confident, well-informed decisions
        about studying abroad</strong>. We focus exclusively on what matters to Indian families —
        education loans in INR, scholarships open to Indian passport holders, visa procedures from
        Indian consulates, and the practical realities of life as an Indian student overseas.
      </p>

      <h2>How We Research Our Content</h2>
      <p>Every guide on EduDhruv is built from these sources, in this order of priority:</p>
      <ol>
        <li><strong>Official institutions</strong> — university websites, government immigration portals (UKVI, IRCC, DHA Australia, USCIS, BAMF), Reserve Bank of India, and the official websites of education loan providers (SBI, HDFC, Avanse, Credila, MPOWER, Prodigy)</li>
        <li><strong>Verified statistics</strong> — Ministry of External Affairs (India) data on student emigration, NAFSA, IIE Open Doors, university enrollment reports</li>
        <li><strong>First-hand experience</strong> — our 10 contributors (see <Link href="/about">About</Link>) have personally studied abroad or counselled hundreds of students through the process</li>
        <li><strong>Peer-reviewed publications</strong> — when relevant, we cite higher-education research journals</li>
      </ol>

      <h2>Our Editorial Team</h2>
      <p>
        EduDhruv content is produced by a team of {AUTHORS.length} education professionals. Each
        contributor has a specific area of expertise and writes only within that area:
      </p>
      <ul>
        {AUTHORS.slice(0, 6).map(a => (
          <li key={a.slug}>
            <Link href={`/author/${a.slug}`}><strong>{a.name}</strong></Link> — {a.role}. Specialises in {a.specialties.join(", ").replace(/-/g, " ")}.
          </li>
        ))}
      </ul>
      <p>
        Every published article carries the by-line of the author who wrote it. You can read more
        about each team member on their profile page.
      </p>

      <h2>Fact-Checking Process</h2>
      <p>Before any guide is published, it passes through a 4-step verification process:</p>
      <ol>
        <li><strong>Source verification</strong> — every quoted figure (fee, deadline, eligibility criterion) is cross-checked against the official source within the last 30 days</li>
        <li><strong>Currency conversion check</strong> — INR equivalents use exchange rates from xe.com or the RBI reference rate on the publication date, and the date is disclosed</li>
        <li><strong>Editorial review</strong> — a senior counsellor reviews the draft for accuracy, completeness, and clarity</li>
        <li><strong>Legal compliance</strong> — for loan and visa content, we verify against the most recent published guidelines</li>
      </ol>

      <h2>Updates and Corrections</h2>
      <p>
        University fees, visa requirements, interest rates, and scholarship deadlines change frequently.
        We aim to update each guide at least once every 6 months, and sooner when a major policy change occurs.
      </p>
      <p>
        Every article shows the <strong>"Last updated"</strong> date at the top. If you find an
        inaccuracy, <strong>please tell us</strong>: <Link href="/contact">edudruv@gmail.com</Link>.
        We respond within 24 hours and corrections appear within 48 hours.
      </p>

      <h2>Use of AI Tools</h2>
      <p>
        We use AI tools (including OpenAI ChatGPT and Anthropic Claude) for first-draft research and
        idea generation — the same way any modern editorial team uses Google Search. <strong>However,
        every published guide is reviewed, edited, fact-checked, and approved by a human counsellor
        before going live.</strong> No content is published directly from an AI tool without human review.
      </p>
      <p>
        We disclose this because we believe in transparency. AI is a tool, not a journalist.
      </p>

      <h2>Affiliate and Sponsored Content Disclosure</h2>
      <p>
        EduDhruv participates in affiliate marketing programs including Amazon Associates,
        CJ Affiliate, and direct partnerships with education lenders. When you click an affiliate
        link and make a purchase, we may earn a small commission at no additional cost to you.
      </p>
      <p>
        <strong>Our editorial recommendations are never influenced by these commercial relationships.</strong>
        We only recommend products, lenders, and services that we genuinely believe provide value to
        Indian students. Where a relationship exists, the content is labelled clearly (look for
        "Sponsored" or "Partner Content" labels). For more, see our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link href="/terms-and-conditions">Terms & Conditions</Link>.
      </p>

      <h2>What We Will Not Do</h2>
      <ul>
        <li>Recommend a university, loan, or scholarship that any of us wouldn't recommend to our own family</li>
        <li>Take payment to write misleading reviews</li>
        <li>Hide commercial relationships</li>
        <li>Publish content we haven't verified</li>
        <li>Sell, share, or rent your personal information</li>
      </ul>

      <h2>How To Contact Us</h2>
      <p>
        For corrections, partnership enquiries, content suggestions, or anything else:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:edudruv@gmail.com">edudruv@gmail.com</a></li>
        <li><strong>Contact form:</strong> <Link href="/contact">/contact</Link></li>
        <li><strong>Free counselling:</strong> <Link href="/loan-portal">Chat with Priya</Link></li>
      </ul>

      <hr className="my-12" />

      <p className="text-sm text-gray-500 italic">
        These standards are reviewed annually. The next scheduled review is{" "}
        {new Date(Date.now() + 365*86400000).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}.
      </p>
    </div>
  );
}
