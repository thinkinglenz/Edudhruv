/**
 * Free Study Abroad Counselling — simple, no-login lead capture.
 * Replaces the /loan-portal register/login wall as the cold-visitor CTA
 * destination. Uses the existing LeadForm (name + phone + email + Turnstile
 * captcha) → /api/lead → `leads` table.
 */
import type { Metadata } from "next";
import LeadForm from "@/components/blog/LeadForm";

const URL = "https://www.edudhruv.com/free-counselling";

export const metadata: Metadata = {
  title: "Free Study Abroad Counselling — Get a Callback in 24 Hours | EduDhruv",
  description:
    "Get free, personalised study-abroad guidance from EduDhruv. Education loans, scholarships, university admissions and visas. Share your details and a counsellor calls you within 24 hours. No fee.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Free Study Abroad Counselling — Callback in 24 Hours",
    description: "Free guidance on loans, scholarships, admissions and visas for Indian students. No fee.",
    url: URL,
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "EduDhruv — Free Counselling" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.jpg"] },
};

const POINTS = [
  "Education loans — which lender fits you, and how much you'll actually pay",
  "Scholarships you're eligible for (and how to apply)",
  "University shortlisting and admissions guidance",
  "Student visa requirements and timelines",
];

export default function FreeCounsellingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <header className="text-center mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7FD", color: "#3AAFE5" }}>
          🎓 100% Free · No Signup
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Free Study Abroad Counselling
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Confused about loans, scholarships or admissions? Share your details below and
          our counsellor <strong>Priya</strong> will call you within 24 hours — completely free.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="font-extrabold text-gray-900 mb-3">What we'll help you with:</h2>
          <ul className="space-y-2">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-gray-700 text-sm">
                <span style={{ color: "#3AAFE5" }} className="font-bold">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-6">
            No fee, no obligation. We'll never ask for payment to give you guidance.
          </p>
        </div>

        <div>
          <LeadForm />
        </div>
      </div>
    </div>
  );
}
