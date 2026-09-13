/** Embeddable GPA Converter (chrome-free, framable). Backlink engine. */
import type { Metadata } from "next";
import GpaConverter from "@/components/tools/GpaConverter";

const TOOL_URL = "https://www.edudhruv.com/tools/gpa-converter";

export const metadata: Metadata = {
  title: "GPA Converter — EduDhruv",
  description: "Free embeddable Indian % / CGPA to US GPA converter by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedGpaConverter() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <GpaConverter />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — GPA Converter →
        </a>
      </div>
    </div>
  );
}
