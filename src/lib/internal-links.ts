/**
 * Auto-inject internal links into post content.
 *
 * Why this matters for monetization:
 *  - Google ranks topical authority, which is signalled by interlinking
 *    across related pages
 *  - Increases pages per session → more ad impressions → more revenue
 *  - Reduces bounce rate (positive ranking signal)
 *  - AI agents follow links to gather context → cite us more
 *
 * Conservative rules:
 *  - Only link the FIRST occurrence of each term per article
 *  - Skip terms inside <a>, <h1>-<h6>, or code blocks
 *  - Match whole words only (no partial matches)
 *  - Skip if term is part of the URL we'd link to (no self-link)
 */

import { CATEGORIES } from "./categories";

interface LinkRule {
  pattern: RegExp;
  href:    string;
  title:   string;
}

/** Build link rules from canonical site structure. */
function buildRules(): LinkRule[] {
  const rules: LinkRule[] = [];

  // Category pages — link first mention of each category name
  for (const cat of CATEGORIES.filter(c => c.slug !== "latest")) {
    const variants = new Set<string>([cat.name]);
    if (cat.slug === "education-loan")          { variants.add("education loan"); variants.add("student loan"); }
    if (cat.slug === "scholarship")             { variants.add("scholarship"); variants.add("100% scholarship"); variants.add("fully funded scholarship"); }
    if (cat.slug === "top-universities")        { variants.add("top universities"); variants.add("best universities"); }
    if (cat.slug === "indian-students-abroad")  { variants.add("study abroad"); }
    if (cat.slug === "student-accommodation")   { variants.add("student housing"); }
    if (cat.slug === "travel-essentials")       { variants.add("student visa"); }

    for (const v of variants) {
      rules.push({
        pattern: new RegExp(`\\b(${escapeRegex(v)})\\b`, "i"),
        href:    `/${cat.slug}`,
        title:   `${cat.name} — EduDhruv`,
      });
    }
  }

  // Cornerstone pages — these get high-priority linking
  rules.push(
    { pattern: /\b(100% scholarships?|fully[- ]funded scholarships?)\b/i, href: "/scholarships",        title: "100% Funded Scholarships" },
    { pattern: /\b(best education loans?|compare education loans?|best student loans?)\b/i, href: "/best-education-loans", title: "Best Education Loans Comparison" },
    { pattern: /\b(free guidance|free counselling|talk to (?:our )?counsel?lor)\b/i, href: "/loan-portal", title: "Free Counselling" },
    { pattern: /\b(Priya(?: Menon)?)\b/,                                  href: "/loan-portal",         title: "Chat with Priya" },

    // Country guides — auto-link first mention of "study in {country}"
    { pattern: /\b(study in (?:the )?USA?|study in America)\b/i,          href: "/study-in/usa",        title: "Study in USA from India — Complete Guide" },
    { pattern: /\b(study in (?:the )?UK|study in (?:the )?United Kingdom|study in Britain)\b/i, href: "/study-in/uk", title: "Study in UK from India — Complete Guide" },
    { pattern: /\b(study in Canada)\b/i,                                  href: "/study-in/canada",     title: "Study in Canada from India — Complete Guide" },
    { pattern: /\b(study in Australia)\b/i,                               href: "/study-in/australia",  title: "Study in Australia from India — Complete Guide" },
    { pattern: /\b(study in Germany)\b/i,                                 href: "/study-in/germany",    title: "Study in Germany from India — Complete Guide" },
    { pattern: /\b(study in Singapore)\b/i,                               href: "/study-in/singapore",  title: "Study in Singapore from India — Complete Guide" },
  );

  return rules;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Apply internal links to HTML content. Links are inserted as <a>
 * tags pointing to in-site URLs.
 *
 * @param html  raw HTML content
 * @param skipHref  current page URL (to avoid self-links)
 */
export function applyInternalLinks(html: string, skipHref = ""): string {
  const rules = buildRules().filter(r => r.href !== skipHref);

  // Mark content within <a>, <h1-6>, <code>, <pre> so we don't link inside them
  const protectedRanges: [number, number][] = [];
  for (const tag of ["a", "h1", "h2", "h3", "h4", "h5", "h6", "code", "pre"]) {
    const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      protectedRanges.push([m.index, m.index + m[0].length]);
    }
  }
  const isProtected = (idx: number) =>
    protectedRanges.some(([s, e]) => idx >= s && idx < e);

  const used = new Set<string>();
  let output = html;

  for (const rule of rules) {
    if (used.has(rule.href)) continue;

    // Find first non-protected match
    const matchAll = [...output.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags.replace("g", "") + "g"))];
    const first = matchAll.find(m => !isProtected(m.index!));
    if (!first) continue;

    const matchedText = first[0];
    const start = first.index!;
    const replacement = `<a href="${rule.href}" title="${rule.title}" class="text-brand hover:underline">${matchedText}</a>`;
    output = output.slice(0, start) + replacement + output.slice(start + matchedText.length);
    used.add(rule.href);

    // Shift protected ranges that come after this insertion
    const lengthDelta = replacement.length - matchedText.length;
    for (const range of protectedRanges) {
      if (range[0] > start) { range[0] += lengthDelta; range[1] += lengthDelta; }
    }
  }

  return output;
}
