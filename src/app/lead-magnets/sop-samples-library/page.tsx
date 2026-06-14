/**
 * SOP Samples Library — the unlocked guide content after email gate.
 * Print-friendly. Layout strips site chrome via /lead-magnets layout.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SOP_SAMPLES, LAST_REVIEWED } from "@/lib/sop-samples";

export const metadata: Metadata = {
  title: "Winning SOP Samples Library 2027 — EduDhruv",
  robots: { index: false, follow: false },
};

export default function SOPSamplesLibrary() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-8 py-10 print:py-4 bg-white"
             style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <header className="mb-10 pb-6 border-b-2" style={{ borderColor: "#3AAFE5" }}>
        <div className="flex items-baseline gap-1 mb-3 print:hidden">
          <Link href="/" className="flex items-baseline">
            <span className="text-2xl font-extrabold" style={{ color: "#000" }}>EDU</span>
            <span className="font-extrabold text-2xl tracking-tight" style={{ color: "#3AAFE5" }}>DHRUV</span>
            <span className="text-xl ml-1" style={{ color: "#F5A71A" }}>★</span>
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
          Winning SOP Samples Library 2027
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          <strong>{SOP_SAMPLES.length} complete sample SOPs</strong> from Indian students who got into top global universities, with detailed analysis of what worked.
        </p>
        <p className="text-xs text-gray-400 mt-2 print:text-[10px]">
          Updated June 2026 · For inspiration and structure only — do not copy or paraphrase. edudhruv.com
        </p>
      </header>

      {/* How to use */}
      <section className="mb-8 bg-blue-50 border-l-4 p-5 rounded-r-lg print:bg-transparent print:border-l-2"
               style={{ borderColor: "#3AAFE5" }}>
        <p className="font-bold text-gray-900 mb-2">📌 How to use these samples</p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>1. <strong>Read the "What Worked" analysis first</strong> — understand the structural choices before reading the text.</li>
          <li>2. <strong>Adopt structure, not content.</strong> Plagiarism detectors are aggressive at top schools.</li>
          <li>3. <strong>Substitute your own stories.</strong> The opening hook, professor citations, internship anecdotes — these are yours alone.</li>
          <li>4. <strong>Write 3 drafts.</strong> First draft: get it out. Second: edit ruthlessly. Third: get external feedback.</li>
          <li>5. <strong>Get feedback</strong> from a current grad student at your target program. They're often willing — just ask politely on LinkedIn.</li>
        </ul>
      </section>

      {/* Samples */}
      {SOP_SAMPLES.map((s, i) => (
        <section key={s.slug} className="mb-12 print:break-inside-avoid">
          <header className="mb-4 pb-3 border-b-2" style={{ borderColor: "#F5A71A" }}>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Sample #{i + 1}</p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{s.program}</h2>
            <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
              <span>🎯 {s.university}</span>
              <span>📝 {s.wordCount} words</span>
            </div>
            <p className="text-xs text-gray-500 italic mt-1">Applicant profile: {s.studentProfile}</p>
          </header>

          {/* What worked */}
          <div className="bg-green-50 border-l-4 p-5 rounded-r-lg mb-5 print:bg-transparent print:border-l-2"
               style={{ borderColor: "#10B981" }}>
            <p className="text-xs font-bold uppercase tracking-wider text-green-800 mb-2">What worked in this SOP</p>
            <ul className="space-y-1 text-sm text-gray-800">
              {s.whatWorked.map((w, j) => (
                <li key={j} className="flex gap-2"><span className="text-green-600">✓</span>{w}</li>
              ))}
            </ul>
          </div>

          {/* Full text */}
          <div className="prose prose-sm max-w-none">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Full Sample (read for structure, write your own):</p>
            {s.fullText.split("\n\n").map((para, j) => (
              <p key={j} className="text-sm text-gray-800 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t-2 text-center" style={{ borderColor: "#3AAFE5" }}>
        <p className="font-bold text-gray-900 text-lg mb-1">Need feedback on your own draft?</p>
        <p className="text-sm text-gray-600 mb-3">
          Chat with Priya (free AI counsellor) for SOP review + improvement suggestions at <strong>edudhruv.com/loan-portal</strong>
        </p>
        <p className="text-xs text-gray-500 print:text-[10px]">
          © EduDhruv 2026 · Free for personal use · Not for commercial redistribution
        </p>
        <p className="text-xs text-gray-400 mt-2 print:hidden">
          💡 To save as PDF: Cmd+P (Mac) or Ctrl+P (Windows) → "Save as PDF"
        </p>
      </footer>
    </article>
  );
}
