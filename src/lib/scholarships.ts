// Helpers for reading scholarships from Supabase

export interface Scholarship {
  id:                  string;
  university_name:     string;
  country:             string;
  scholarship_name:    string;
  coverage_percentage: number;
  amount_inr:          string | null;
  amount_native:       string | null;
  courses_covered:     string[] | null;
  eligibility_summary: string | null;
  indian_eligible:     boolean;
  application_deadline: string | null;
  intake:              string | null;
  official_url:        string | null;
  post_slug:           string | null;
  featured_image_url:  string | null;
  status:              string;
  created_at:          string;
}

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

const FALLBACK: Scholarship[] = [];

/** Look up the scholarship row that powers a given post (if any). */
export async function getScholarshipByPostSlug(slug: string): Promise<Scholarship | null> {
  if (IS_MOCK) return null;
  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const { data } = await getServiceClient()
      .from("scholarships")
      .select("*")
      .eq("post_slug", slug)
      .maybeSingle();
    return (data as Scholarship | null) || null;
  } catch {
    return null;
  }
}

/**
 * Get scholarships to compare against the current one — used to render the
 * Comparison table on each scholarship post. Returns 3 active scholarships
 * preferring same country, falling back to other countries.
 */
export async function getComparisonScholarships(
  excludeSlug: string,
  preferCountry?: string,
  limit = 3,
): Promise<Scholarship[]> {
  if (IS_MOCK) return FALLBACK;
  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const sb = getServiceClient();

    // 1. Same country first
    let rows: Scholarship[] = [];
    if (preferCountry) {
      const { data } = await sb.from("scholarships")
        .select("*")
        .eq("status", "active")
        .eq("country", preferCountry)
        .neq("post_slug", excludeSlug)
        .order("created_at", { ascending: false })
        .limit(limit);
      rows = (data as Scholarship[]) || [];
    }

    // 2. Top up with other countries if needed
    if (rows.length < limit) {
      const { data } = await sb.from("scholarships")
        .select("*")
        .eq("status", "active")
        .neq("post_slug", excludeSlug)
        .order("created_at", { ascending: false })
        .limit(limit - rows.length + 5);
      const extras = ((data as Scholarship[]) || [])
        .filter(s => !rows.find(r => r.id === s.id))
        .slice(0, limit - rows.length);
      rows = [...rows, ...extras];
    }

    return rows;
  } catch {
    return FALLBACK;
  }
}

export async function getRecentScholarships(limit = 6): Promise<Scholarship[]> {
  if (IS_MOCK) return FALLBACK.slice(0, limit);
  try {
    const { getServiceClient } = await import("./supabase");
    const { data } = await getServiceClient()
      .from("scholarships")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as Scholarship[]) || [];
  } catch {
    return [];
  }
}

export async function getActiveScholarships(): Promise<Scholarship[]> {
  if (IS_MOCK) return FALLBACK;
  try {
    const { getServiceClient } = await import("./supabase");
    const { data } = await getServiceClient()
      .from("scholarships")
      .select("*")
      .eq("status", "active")
      .order("application_deadline", { ascending: true, nullsFirst: false });
    return (data as Scholarship[]) || [];
  } catch {
    return [];
  }
}

// Country code → emoji flag for visual identification
export function getCountryFlag(country: string): string {
  const map: Record<string, string> = {
    "USA": "🇺🇸", "UK": "🇬🇧", "Canada": "🇨🇦", "Australia": "🇦🇺",
    "Germany": "🇩🇪", "Singapore": "🇸🇬", "Switzerland": "🇨🇭",
    "Netherlands": "🇳🇱", "Ireland": "🇮🇪", "France": "🇫🇷",
    "Belgium": "🇧🇪", "Hong Kong": "🇭🇰", "China": "🇨🇳",
    "Japan": "🇯🇵", "South Korea": "🇰🇷",
  };
  return map[country] || "🌍";
}

export function getInitials(name: string): string {
  return name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / 86400000);
  return diff;
}
