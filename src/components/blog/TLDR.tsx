/**
 * TL;DR summary box rendered at the top of every post.
 *
 * Designed for two audiences:
 *   1. Human readers — gives the punchline in 2-3 sentences
 *   2. AI agents (ChatGPT, Claude, Perplexity, Google AI Overviews)
 *      — extracts this verbatim because it's marked `data-speakable`,
 *        wrapped in <aside>, and labelled with semantic class names
 */
export default function TLDR({ excerpt }: { excerpt?: string | null }) {
  if (!excerpt || excerpt.length < 40) return null;

  // Trim to ~2 sentences if it's overly long
  const text = excerpt.length > 360
    ? excerpt.slice(0, 357).replace(/\s+\S*$/, "") + "…"
    : excerpt;

  return (
    <aside
      className="tldr-summary mb-8 rounded-xl border-l-4 px-5 py-4"
      style={{ background: "#EBF7FD", borderColor: "#3AAFE5" }}
      data-speakable="true"
      aria-label="Article summary"
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#3AAFE5" }}>
        💡 TL;DR
      </p>
      <p className="text-base leading-relaxed text-gray-800">
        {text}
      </p>
    </aside>
  );
}
