/** Embeddable Country Match Quiz (chrome-free, framable). Backlink engine. */
import type { Metadata } from "next";
import CountryMatchQuiz from "@/components/tools/CountryMatchQuiz";

const TOOL_URL = "https://www.edudhruv.com/tools/country-match-quiz";

export const metadata: Metadata = {
  title: "Country Match Quiz — EduDhruv",
  description: "Free embeddable 'which country should I study in' quiz by EduDhruv.",
  robots: { index: false, follow: true },
  alternates: { canonical: TOOL_URL },
};

export default function EmbeddedCountryMatchQuiz() {
  return (
    <div className="bg-white p-3 sm:p-4" style={{ minHeight: "100vh" }}>
      <CountryMatchQuiz />
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by{" "}
        <a href={TOOL_URL} target="_blank" rel="noopener" className="font-semibold" style={{ color: "#3AAFE5" }}>
          EduDhruv — Country Match Quiz →
        </a>
      </div>
    </div>
  );
}
