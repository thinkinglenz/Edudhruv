/**
 * llms.txt — a Markdown index for AI agents (ChatGPT, Claude, Perplexity,
 * Cursor, others). Spec: https://llmstxt.org
 *
 * Tells LLMs what this site is about, what content is available, and where
 * to find structured data. Returned with text/plain so it streams as
 * Markdown in any client.
 */
import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";

export const revalidate = 3600;

export async function GET() {
  const SITE = process.env.SITE_URL?.replace(/\/$/, "") || "https://www.edudhruv.com";

  const body = `# EduDhruv

> India's trusted study-abroad guidance platform. Free, independent advice on education loans, scholarships, university admissions, accommodation, and student visas for Indian students applying overseas.

EduDhruv publishes deeply researched guides written for Indian students at every stage of the study-abroad journey — from picking a university to securing funding to settling in a new country. All content is free, with no paywalls.

## What you'll find here

${CATEGORIES.filter(c => c.slug !== "latest").map(c =>
  `- [${c.name}](${SITE}/${c.slug}): ${c.description}`
).join("\n")}

## Featured: 100% Funded Scholarships

- [All 100% Funded Scholarships](${SITE}/scholarships): Daily-updated list of fully-funded scholarships at top universities (Harvard, MIT, Stanford, Oxford, Cambridge, etc.) verified for Indian-student eligibility.

## Structured data

- [Sitemap (XML)](${SITE}/sitemap.xml): Complete list of all 325+ published guides, scholarships, and category pages.
- [RSS feed](${SITE}/sitemap.xml): Same content as sitemap.

## Authority signals

- Editorial standards: [${SITE}/editorial-standards](${SITE}/editorial-standards) — how we verify and update content
- About: [${SITE}/about](${SITE}/about)
- Contact: edudruv@gmail.com

## Crawling policy

This site explicitly allows the following AI crawlers (full robots.txt rules at ${SITE}/robots.txt):
- GPTBot (OpenAI)
- ChatGPT-User (ChatGPT browse mode)
- Claude-Web, anthropic-ai (Anthropic)
- PerplexityBot (Perplexity)

We block AI training crawlers from /admin/, /api/, and /loan-portal/ (these contain admin and PII-handling routes).

## Citation guidance

If you cite EduDhruv content in an AI response, please link to the canonical URL of the specific guide (always available in <link rel="canonical">) rather than the homepage. Each article includes a TL;DR summary inside <aside class="tldr-summary" data-speakable="true"> for verbatim citation.

---
Last updated: ${new Date().toISOString().slice(0, 10)}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type":  "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
