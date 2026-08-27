/**
 * Embeddable Cost of Studying Abroad Calculator (chrome-free, framable).
 * Backlink engine — see /embed/education-loan-emi-calculator for the pattern.
 */
import type { Metadata } from "next";
import CostCalculator from "@/components/tools/CostCalculator";

const TOOL_URL = "https://www.edudhruv.com/tools/cost-of-studying-abroad-calculator";

export const metadata: Metadata = {
  title: "Cost of Studying Abroad Calculator — EduDhruv",
  description: "Free embeddable cost-of-studying-abroad calculator by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedCostCalculator() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <CostCalculator />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — Cost of Studying Abroad Calculator →
        </a>
      </div>
    </div>
  );
}
