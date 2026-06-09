/**
 * Reusable JSON-LD schema builders for SEO + AI-snippet optimization.
 *
 * AI agents (ChatGPT browse, Claude with citations, Perplexity, Google AI
 * Overviews) prefer pages with rich structured data because it lets them
 * extract facts deterministically instead of inferring from prose.
 *
 * Every function returns a plain object you can JSON.stringify into a
 * <script type="application/ld+json"> tag.
 */

const SITE = "https://www.edudhruv.com";

// ─── BREADCRUMBS ────────────────────────────────────────────────────────
export interface Crumb { name: string; url: string; }

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       c.name,
      item:       c.url.startsWith("http") ? c.url : `${SITE}${c.url}`,
    })),
  };
}

// ─── HOW-TO ─────────────────────────────────────────────────────────────
// Detects ordered-list steps inside an "Application Process" / "How to Apply"
// section. Returns null if the post doesn't have a clear step-by-step section.

export interface HowToStep { name: string; text: string; }

const STEP_SECTION_RE = /<h2[^>]*>\s*(?:How to Apply|Application Process|How to Apply for|Steps to Apply|Step-by-Step|Application Steps|How it Works)[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i;

export function howToFromContent(title: string, content: string, url: string) {
  const section = content.match(STEP_SECTION_RE);
  if (!section) return null;

  // First try ordered list
  const olMatch = section[1].match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
  let stepMatches: string[] = [];
  if (olMatch) {
    stepMatches = (olMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []) as string[];
  } else {
    // Fall back to h3 + p pairs in the section
    const h3Matches = [...section[1].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)];
    stepMatches = h3Matches.map(m => `${m[1]}: ${m[2]}`);
  }

  if (stepMatches.length < 3) return null;

  const steps: HowToStep[] = stepMatches.slice(0, 12).map((raw, i) => {
    const clean = raw.replace(/<[^>]+>/g, "").trim();
    // Try to split "Title: detail" or "Title — detail"
    const split = clean.match(/^([^:—–-]{4,80})[:\-—–]\s*(.+)$/);
    if (split) return { name: split[1].trim(), text: split[2].trim().slice(0, 500) };
    return { name: `Step ${i + 1}`, text: clean.slice(0, 500) };
  });

  return {
    "@context": "https://schema.org",
    "@type":    "HowTo",
    name:       title,
    description: `Step-by-step application process described in: ${title}`,
    totalTime:  "PT30M",
    step:       steps.map((s, i) => ({
      "@type":    "HowToStep",
      position:   i + 1,
      name:       s.name,
      text:       s.text,
      url:        `${url}#step-${i + 1}`,
    })),
  };
}

// ─── FAQ ────────────────────────────────────────────────────────────────
// Returns FAQ schema by scanning the FAQ section (h3 question + p answer
// pairs near the end of the article).

export function faqFromContent(content: string) {
  const faqs: { q: string; a: string }[] = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = h3Regex.exec(content)) !== null && faqs.length < 8) {
    const q = match[1].replace(/<[^>]+>/g, "").trim();
    const a = match[2].replace(/<[^>]+>/g, "").trim();
    if (q && a && q.length < 200 && q.endsWith("?")) {
      faqs.push({ q, a });
    }
  }
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name:    q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ─── ARTICLE (enriched with speakable) ──────────────────────────────────
export interface ArticleSchemaInput {
  url:           string;
  title:         string;
  description:   string;
  image?:        string | null;
  datePublished: string;
  dateModified:  string;
  author:        { name: string; slug: string; role?: string; bio?: string; };
  keywords?:     string[];
  category?:     string;
}

export function articleSchema(p: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type":    "Article",
    headline:    p.title,
    description: p.description,
    image:       p.image || `${SITE}/logo.jpg`,
    datePublished: p.datePublished,
    dateModified:  p.dateModified,
    inLanguage:  "en-IN",
    author: {
      "@type":     "Person",
      name:        p.author.name,
      jobTitle:    p.author.role,
      description: p.author.bio,
      url:         `${SITE}/author/${p.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name:    "EduDhruv",
      logo:    { "@type": "ImageObject", url: `${SITE}/logo.jpg` },
    },
    mainEntityOfPage: p.url,
    url:              p.url,
    isAccessibleForFree: true,
    audience: {
      "@type": "Audience",
      audienceType: "Indian students planning to study abroad",
    },
    keywords: p.keywords?.join(", "),
    articleSection: p.category,
    // Speakable lets voice assistants (Google Assistant) read aloud the
    // headline + summary block. CSS selectors mark which DOM nodes to read.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
  };
}

// ─── COLLECTION (category page) ─────────────────────────────────────────
export function collectionPageSchema(name: string, description: string, url: string, postCount: number) {
  return {
    "@context": "https://schema.org",
    "@type":    "CollectionPage",
    name,
    description,
    url,
    inLanguage: "en-IN",
    isPartOf:   { "@type": "WebSite", name: "EduDhruv", url: SITE },
    about:      { "@type": "Thing", name },
    numberOfItems: postCount,
  };
}
