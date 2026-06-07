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
