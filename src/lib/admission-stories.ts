/**
 * Helpers for admission_stories table — UGC content for SEO + engagement.
 */

export interface AdmissionStory {
  id:           number;
  slug:         string;
  name:         string;
  city_india:   string | null;
  university:   string;
  country:      string;
  program:      string;
  degree:       string;
  intake_year:  number;
  cgpa:         number | null;
  gre_score:    number | null;
  gmat_score:   number | null;
  ielts_band:   number | null;
  toefl_score:  number | null;
  work_years:   number | null;
  headline:     string;
  body:         string;
  advice:       string | null;
  funding_source: string | null;
  scholarship_name: string | null;
  status:       "pending" | "approved" | "rejected";
  views:        number;
  created_at:   string;
}

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
                !process.env.SUPABASE_SERVICE_ROLE_KEY;

const FALLBACK: AdmissionStory[] = [];

export async function getApprovedStories(limit = 30): Promise<AdmissionStory[]> {
  if (IS_MOCK) return FALLBACK;
  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const { data } = await getServiceClient()
      .from("admission_stories")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as AdmissionStory[]) || [];
  } catch { return FALLBACK; }
}

export async function getStoryBySlug(slug: string): Promise<AdmissionStory | null> {
  if (IS_MOCK) return null;
  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const { data } = await getServiceClient()
      .from("admission_stories")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();
    return (data as AdmissionStory | null) || null;
  } catch { return null; }
}

export function slugify(university: string, year: number, name: string): string {
  const uni  = university.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30);
  const firstName = name.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${uni}-${year}-${firstName}-${Math.random().toString(36).slice(2, 6)}`;
}
