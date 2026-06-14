/**
 * Submit a student admission story.
 *
 *   POST /api/admission-stories
 *
 * Stored with status='pending' — admin moderates before showing publicly.
 */
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/admission-stories";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                !process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "edudruv@gmail.com";

function isValidEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name, email, city_india,
      university, country, program, degree, intake_year,
      cgpa, gre_score, gmat_score, ielts_band, toefl_score, work_years,
      headline, body: storyBody, advice,
      funding_source, scholarship_name,
      captcha, website,
    } = body as Record<string, any>;

    // Validation
    if (!name || name.length < 2) return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!email || !isValidEmail(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    if (!university) return NextResponse.json({ error: "University required" }, { status: 400 });
    if (!country) return NextResponse.json({ error: "Country required" }, { status: 400 });
    if (!program) return NextResponse.json({ error: "Program required" }, { status: 400 });
    if (!degree) return NextResponse.json({ error: "Degree level required" }, { status: 400 });
    if (!intake_year || intake_year < 2024 || intake_year > 2030) {
      return NextResponse.json({ error: "Valid intake year required" }, { status: 400 });
    }
    if (!headline || headline.length < 10) return NextResponse.json({ error: "Headline required (10+ chars)" }, { status: 400 });
    if (!storyBody || storyBody.length < 200) {
      return NextResponse.json({ error: "Story must be at least 200 characters" }, { status: 400 });
    }
    if (storyBody.length > 10000) {
      return NextResponse.json({ error: "Story too long (max 10000 chars)" }, { status: 400 });
    }

    // Honeypot
    if (website) return NextResponse.json({ success: true }); // silent

    if (IS_MOCK) {
      return NextResponse.json({ success: true, mock: true });
    }

    const slug = slugify(university, intake_year, name);

    const { getServiceClient } = await import("@/lib/supabase");
    const sb = getServiceClient();
    const ip = req.headers.get("x-forwarded-for") || null;

    const { error } = await sb.from("admission_stories").insert({
      slug,
      name:       name.slice(0, 100),
      email:      email.toLowerCase().slice(0, 254),
      city_india: (city_india || "").slice(0, 100) || null,
      university: university.slice(0, 200),
      country:    country.slice(0, 80),
      program:    program.slice(0, 200),
      degree:     degree.slice(0, 50),
      intake_year: parseInt(intake_year),
      cgpa:       cgpa  ? parseFloat(cgpa)  : null,
      gre_score:  gre_score  ? parseInt(gre_score)  : null,
      gmat_score: gmat_score ? parseInt(gmat_score) : null,
      ielts_band: ielts_band ? parseFloat(ielts_band) : null,
      toefl_score: toefl_score ? parseInt(toefl_score) : null,
      work_years: work_years ? parseInt(work_years) : null,
      headline:   headline.slice(0, 300),
      body:       storyBody.slice(0, 10000),
      advice:     (advice || "").slice(0, 2000) || null,
      funding_source:   funding_source || null,
      scholarship_name: scholarship_name || null,
      status:    "pending",
      ip_address: ip,
    });

    if (error) {
      console.error("[admission-stories] insert error:", error);
      return NextResponse.json({ error: "Could not save story — try again" }, { status: 500 });
    }

    // Notify admin
    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    process.env.RESEND_FROM || "EduDhruv <onboarding@resend.dev>",
          to:      [ADMIN_EMAIL],
          subject: `📝 New admission story submitted: ${university} ${intake_year}`,
          html: `
<p><strong>${name}</strong> submitted a story:</p>
<p><strong>University:</strong> ${university} (${country})<br>
<strong>Program:</strong> ${program} (${degree}, ${intake_year})<br>
<strong>Headline:</strong> ${headline}</p>
<p><strong>Story (preview):</strong></p>
<blockquote>${storyBody.slice(0, 500)}…</blockquote>
<p><a href="https://www.edudhruv.com/admin">→ Moderate in admin</a></p>`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, slug });
  } catch (e: any) {
    console.error("[admission-stories] handler error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
