/** Embeddable Study Abroad Profile Evaluator (chrome-free, framable). */
import type { Metadata } from "next";
import ProfileEvaluator from "@/components/tools/ProfileEvaluator";

const TOOL_URL = "https://www.edudhruv.com/tools/profile-evaluator";

export const metadata: Metadata = {
  title: "Study Abroad Profile Evaluator — EduDhruv",
  description: "Free embeddable study-abroad profile evaluator by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedProfileEvaluator() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <ProfileEvaluator />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — Study Abroad Profile Evaluator →
        </a>
      </div>
    </div>
  );
}
