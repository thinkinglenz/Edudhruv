/** Embeddable University Shortlist Quiz (chrome-free, framable). */
import type { Metadata } from "next";
import ShortlistQuiz from "@/components/tools/ShortlistQuiz";

const TOOL_URL = "https://www.edudhruv.com/tools/university-shortlist-quiz";

export const metadata: Metadata = {
  title: "University Shortlist Quiz — EduDhruv",
  description: "Free embeddable university shortlist quiz for study-abroad students by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedShortlistQuiz() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <ShortlistQuiz />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — University Shortlist Quiz →
        </a>
      </div>
    </div>
  );
}
