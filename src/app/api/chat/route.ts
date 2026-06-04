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

If a student seems ready, suggest: "Fill in your details on this page and I'll have a senior counsellor call you within 24 hours!"`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: PRIYA_SYSTEM,
        messages: messages.slice(-10), // last 10 messages for context
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Claude API error");

    return NextResponse.json({ reply: data.content[0].text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
