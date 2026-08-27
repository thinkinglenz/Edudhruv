/**
 * Embeddable Study Abroad ROI Calculator (chrome-free, framable).
 * Backlink engine — see /embed/education-loan-emi-calculator for the pattern.
 */
import type { Metadata } from "next";
import ROICalculator from "@/components/tools/ROICalculator";

const TOOL_URL = "https://www.edudhruv.com/tools/study-abroad-roi-calculator";

export const metadata: Metadata = {
  title: "Study Abroad ROI Calculator — EduDhruv",
  description: "Free embeddable study-abroad return-on-investment calculator by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedROICalculator() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <ROICalculator />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — Study Abroad ROI Calculator →
        </a>
      </div>
    </div>
  );
}
