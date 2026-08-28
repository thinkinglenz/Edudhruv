import { NextRequest, NextResponse } from "next/server";

const PRIYA_SYSTEM = `You are Priya, a warm and knowledgeable education counsellor at EduDhruv. You help Indian students navigate studying abroad — education loans, scholarships, visa requirements, university admissions and accommodation.

Your personality:
- Warm and encouraging, like a helpful older sister
- Use simple English mixed with occasional Hindi words (yaar, achha, haan, bilkul) to feel relatable
- Be specific and practical — give real bank names, real amounts, real timelines
- Never make up information. If unsure, say "Let me check that for you — but generally..."
- Keep replies concise (2-4 short paragraphs max)
- End every response with a gentle nudge to use the lead form or call

Key knowledge:
- Education loans: SBI Scholar, HDFC Credila, Avanse, Prodigy Finance, GyanDhan
- Popular destinations: UK, Canada, Australia, Germany, Singapore, USA, Ireland
- Scholarships: Chevening, Commonwealth, DAAD, Australia Awards, Singapore Govt
- Typical loan amounts: ₹20L-₹1Cr for abroad studies
- Processing time: 2-6 weeks for secured loans, 4-8 weeks for unsecured
- Collateral threshold: Most banks require collateral above ₹40L

If a student seems ready, suggest: "Just share your name, phone and email at edudhruv.com/free-counselling and a senior counsellor will call you within 24 hours — it's free!"`;

type Msg = { role: string; content: string };
type Result = { ok: true; text: string } | { ok: false; status: number; msg: string };

/**
 * Provider selection:
 *   AI_PROVIDER = "gemini" | "anthropic"  → forces that provider.
 *   Otherwise: prefer Gemini if GEMINI_API_KEY is set (free tier), else Anthropic.
 * This keeps BOTH options available — flip AI_PROVIDER (or the keys) to switch.
 */
function pickProvider(): "gemini" | "anthropic" | null {
  const explicit = (process.env.AI_PROVIDER || "").toLowerCase();
  if (explicit === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (explicit === "anthropic" && process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.GEMINI_API_KEY) return "gemini";       // free tier — default
  if (process.env.ANTHROPIC_API_KEY) return "anthropic"; // paid fallback
  return null;
}

// ── Google Gemini (free tier) ────────────────────────────────────────────
async function callGemini(messages: Msg[]): Promise<Result> {
  const key = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const contents = messages.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user", // Gemini uses "model", not "assistant"
    parts: [{ text: String(m.content ?? "") }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: PRIYA_SYSTEM }] },
        contents,
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      }),
    },
  );
  const data = await res.json();
  if (!res.ok) return { ok: false, status: res.status, msg: data?.error?.message || "Gemini error" };
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p: any) => p.text || "").join("");
  return { ok: true, text };
}

// ── Anthropic Claude (paid option) ───────────────────────────────────────
async function callAnthropic(messages: Msg[]): Promise<Result> {
  const key = process.env.ANTHROPIC_API_KEY!;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5",
      max_tokens: 500,
      system: [{ type: "text", text: PRIYA_SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: messages.slice(-10),
    }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, status: res.status, msg: data?.error?.message || "Claude error" };
  return { ok: true, text: data?.content?.[0]?.text || "" };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const provider = pickProvider();
    if (!provider) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const r = provider === "gemini" ? await callGemini(messages) : await callAnthropic(messages);

    if (!r.ok) {
      console.error(`Priya ${provider} error:`, r.status, r.msg);
      const hint = /credit|balance|quota|insufficient|exhausted|rate.?limit/i.test(r.msg) ? "billing"
        : r.status === 401 || r.status === 403 ? "auth"
        : r.status === 400 ? "bad_request"
        : "upstream";
      return NextResponse.json(
        {
          error: "Priya is temporarily unavailable. Please try again shortly.",
          hint, provider,
          // Safe upstream detail (provider error text, no secrets) for debugging.
          detail: String(r.msg).slice(0, 300),
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ reply: r.text, provider });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
