/**
 * Embeddable Education Loan EMI Calculator.
 * ------------------------------------------------------------------
 * This is the chrome-free version served inside an <iframe> on OTHER
 * websites (education blogs, coaching centres, student forums). Each
 * embed carries a visible "Powered by EduDhruv" link back to the full
 * tool — the backlink engine.
 *
 * - No site header/footer (SiteShell skips "/embed").
 * - Framable anywhere (next.config.js gives /embed `frame-ancestors *`).
 * - noindex: the canonical, indexable version is the /tools page, so this
 *   duplicate isn't indexed.
 */
import type { Metadata } from "next";
import EMICalculator from "@/components/tools/EMICalculator";

const TOOL_URL = "https://www.edudhruv.com/tools/education-loan-emi-calculator";

export const metadata: Metadata = {
  title: "Education Loan EMI Calculator — EduDhruv",
  description: "Free embeddable education loan EMI calculator by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedEMICalculator() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <EMICalculator />

      {/* Attribution — the backlink users see inside every embed */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a
          href={TOOL_URL}
          target="_blank"
          rel="noopener"
          className="font-semibold"
          style={{ color: "#3AAFE5" }}
        >
          EduDhruv — Education Loan EMI Calculator →
        </a>
      </div>
    </div>
  );
}
