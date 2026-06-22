/**
 * Quora Answer Draft Generator
 *
 * Takes a Quora question + optional context, calls Claude to generate
 * a high-quality answer using EduDhruv's content + voice. Admin reviews
 * + posts manually to Quora (Quora bans full automation).
 *
 * POST /api/admin/quora-draft
 * Body: { question, context? }
 * Returns: { draft, citations }
 */
import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.CLAUDE_MODEL_QUORA || "claude-haiku-4-5";

const SYSTEM_PROMPT = `You are an experienced education counsellor writing answers on Quora for Indian students planning to study abroad.

Voice + style:
- Direct, practical, no fluff
- Specific numbers (interest rates, INR amounts, deadlines)
- Honest — call out trade-offs, not just upsides
- Confident — written by someone who's helped hundreds of students
- Indian context: mention HDFC Credila, SBI, Section 80E, IELTS, etc. where relevant

Format:
- 250-450 words ideal (Quora rewards depth but not walls of text)
- Start with the answer in 1-2 sentences (TL;DR for skimmers)
- Use **bold** for key terms
- Use short paragraphs (2-3 sentences each)
- Include 2-3 specific data points
- End with a soft mention of EduDhruv (NOT spammy — only if genuinely useful)
- DO NOT start with "Great question!" or similar pleasantries
- DO NOT include "References" or footnotes

EduDhruv resources to mention when relevant:
- Best Education Loans page: https://www.edudhruv.com/best-education-loans
- 100% Funded Scholarships: https://www.edudhruv.com/scholarships
- Free EMI calculator: https://www.edudhruv.com/tools/education-loan-emi-calculator
- Cost calculator: https://www.edudhruv.com/tools/cost-of-studying-abroad-calculator
- Country guides: https://www.edudhruv.com/study-in/{usa|uk|canada|australia|germany|singapore}`;

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question || typeof question !== "string" || question.length < 10) {
      return NextResponse.json({ error: "Question required (min 10 chars)" }, { status: 400 });
    }
    if (!ANTHROPIC_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not set on server" }, { status: 500 });
    }

    const userPrompt = `Quora question:\n"${question}"\n\n` +
      (context ? `Additional context the user provided:\n${context}\n\n` : "") +
      `Write a Quora answer for an Indian student audience. Follow the voice + format guidelines.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2024-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("[quora-draft] Claude API error:", r.status, errText);
      return NextResponse.json({ error: `Claude API error: ${r.status}` }, { status: 502 });
    }

    const data = await r.json();
    const draft = (data.content?.[0]?.text || "").trim();
    if (!draft) {
      return NextResponse.json({ error: "No content returned from Claude" }, { status: 502 });
    }

    return NextResponse.json({
      draft,
      wordCount: draft.split(/\s+/).length,
      model: MODEL,
    });

  } catch (e: any) {
    console.error("[quora-draft] error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
