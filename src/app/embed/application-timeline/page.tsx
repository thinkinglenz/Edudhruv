/** Embeddable Study Abroad Application Timeline (chrome-free, framable). */
import type { Metadata } from "next";
import ApplicationTimeline from "@/components/tools/ApplicationTimeline";

const TOOL_URL = "https://www.edudhruv.com/tools/application-timeline";

export const metadata: Metadata = {
  title: "Study Abroad Application Timeline — EduDhruv",
  description: "Free embeddable study-abroad application timeline planner by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedApplicationTimeline() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <ApplicationTimeline />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — Study Abroad Application Timeline →
        </a>
      </div>
    </div>
  );
}
