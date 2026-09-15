/** Embeddable Cost of Living Comparison (chrome-free, framable). Backlink engine. */
import type { Metadata } from "next";
import CostOfLivingComparison from "@/components/tools/CostOfLivingComparison";

const TOOL_URL = "https://www.edudhruv.com/tools/cost-of-living-comparison";

export const metadata: Metadata = {
  title: "Cost of Living Comparison — EduDhruv",
  description: "Free embeddable study-abroad cost-of-living comparison by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedCostOfLivingComparison() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <CostOfLivingComparison />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — Cost of Living Comparison →
        </a>
      </div>
    </div>
  );
}
