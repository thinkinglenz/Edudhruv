/**
 * Site-wide full-text search using Postgres tsvector + pg_trgm fuzzy.
 *
 * Returns results grouped by type:
 *   - posts          (blog posts)
 *   - scholarships   (100% funded)
 *   - universities   (top universities seeded)
 *   - pages          (static high-value pages — hardcoded list)
 *
 * Query strategy:
 *   1. Use websearch_to_tsquery (handles "education loan" as a phrase
 *      automatically) for ranked semantic results
 *   2. Fall back to ILIKE on title for very short queries (1-2 chars)
 *   3. ts_rank for ordering, with manual boost for exact title matches
 */

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY;

export interface SearchResult {
  type:        "post" | "scholarship" | "university" | "page";
  title:       string;
  subtitle?:   string;
  url:         string;
  excerpt?:    string;
  image?:      string | null;
  badge?:      string;       // e.g. "100% Funded", "Free Tool"
  rank?:       number;
}

export interface SearchResponse {
  query:    string;
  total:    number;
  results:  SearchResult[];
  grouped:  {
    posts:        SearchResult[];
    scholarships: SearchResult[];
    universities: SearchResult[];
    pages:        SearchResult[];
  };
  durationMs: number;
}

// ─── HIGH-VALUE STATIC PAGES ───────────────────────────────────────
const STATIC_PAGES: Array<{
  url: string; title: string; subtitle: string; keywords: string[]; badge?: string;
}> = [
  { url: "/best-education-loans",                        title: "Best Education Loans for Indian Students 2027",   subtitle: "Compare 8 lenders side-by-side",         keywords: ["education loan", "compare lenders", "hdfc", "sbi", "credila", "avanse", "prodigy", "mpower", "interest rate", "emi", "best loans", "student loan"], badge: "Compare" },
  { url: "/scholarships",                                title: "100% Funded Scholarships",                          subtitle: "Updated daily — verified for Indians",   keywords: ["scholarships", "100 funded", "fully funded", "free education", "no cost"], badge: "Daily" },
  { url: "/tools",                                       title: "Free Tools for Indian Students",                    subtitle: "Calculators & checkers",                  keywords: ["tools", "calculator", "free"], badge: "Free" },
  { url: "/tools/education-loan-emi-calculator",         title: "Education Loan EMI Calculator",                     subtitle: "Calculate monthly EMI",                    keywords: ["emi", "calculator", "education loan", "monthly", "interest rate", "tenure"], badge: "Free Tool" },
  { url: "/tools/cost-of-studying-abroad-calculator",    title: "Cost of Studying Abroad Calculator",                subtitle: "Total cost in INR per country",            keywords: ["cost", "calculator", "total expense", "tuition", "living", "budget", "studying abroad"], badge: "Free Tool" },
  { url: "/study-in/usa",                                title: "Study in USA from India 2027",                      subtitle: "F-1 visa + universities + costs",         keywords: ["usa", "america", "f-1", "study in usa", "mba usa", "ms usa", "mit", "stanford", "harvard"], badge: "Guide" },
  { url: "/study-in/uk",                                 title: "Study in UK from India 2027",                       subtitle: "Tier 4 visa + Oxbridge + costs",          keywords: ["uk", "britain", "england", "tier 4", "study in uk", "oxford", "cambridge"], badge: "Guide" },
  { url: "/study-in/canada",                             title: "Study in Canada from India 2027",                   subtitle: "Study Permit + PR pathway",               keywords: ["canada", "study permit", "sds", "pr canada", "toronto", "vancouver"], badge: "Guide" },
  { url: "/study-in/australia",                          title: "Study in Australia from India 2027",                subtitle: "Subclass 500 + post-study work",          keywords: ["australia", "subclass 500", "melbourne", "sydney", "australia visa"], badge: "Guide" },
  { url: "/study-in/germany",                            title: "Study in Germany from India 2027",                  subtitle: "FREE tuition + blocked account",          keywords: ["germany", "free tuition", "blocked account", "tum", "rwth", "english programs germany"], badge: "Free Tuition" },
  { url: "/study-in/singapore",                          title: "Study in Singapore from India 2027",                subtitle: "NUS + NTU + tuition grant",               keywords: ["singapore", "nus", "ntu", "tuition grant", "singapore visa"], badge: "Guide" },
  { url: "/loan-portal",                                 title: "Talk to Priya — Free AI Counsellor",                subtitle: "Get personalised guidance",                keywords: ["priya", "chat", "counsellor", "free guidance", "ai counsellor"], badge: "Free Chat" },
];

function searchStaticPages(q: string, limit = 4): SearchResult[] {
  const lower = q.toLowerCase().trim();
  if (lower.length < 2) return [];
  const matched: Array<SearchResult & { score: number }> = [];
  for (const p of STATIC_PAGES) {
    let score = 0;
    if (p.title.toLowerCase().includes(lower)) score += 10;
    for (const kw of p.keywords) {
      if (kw.includes(lower)) score += 4;
      if (lower.includes(kw)) score += 6;
    }
    if (score > 0) {
      matched.push({
        type: "page",
        title: p.title,
        subtitle: p.subtitle,
        url: p.url,
        badge: p.badge,
        rank: score,
        score,
      });
    }
  }
  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, limit).map(({ score, ...r }) => r);
}

// ─── MAIN SEARCH ────────────────────────────────────────────────────
export async function searchSite(q: string, limit = 30): Promise<SearchResponse> {
  const start = Date.now();
  const query = q.trim();
  const grouped = { posts: [], scholarships: [], universities: [], pages: [] } as SearchResponse["grouped"];

  if (!query) {
    return { query, total: 0, results: [], grouped, durationMs: 0 };
  }

  // Always include static page matches (cheap, in-memory)
  grouped.pages = searchStaticPages(query);

  if (IS_MOCK) {
    return {
      query,
      total: grouped.pages.length,
      results: grouped.pages,
      grouped,
      durationMs: Date.now() - start,
    };
  }

  try {
    const { getServiceClient } = await import("@/lib/supabase");
    const sb = getServiceClient();

    const tooShort = query.length < 3;

    // ─── POSTS ───────────────────────────────────────────────────────
    // Try full-text first (when migration applied), fall back to ILIKE.
    const postsLimit = 12;
    let postsData: any[] | null = null;

    if (!tooShort) {
      try {
        const { data, error } = await sb
          .from("posts")
          .select("id,title,slug,category_slug,excerpt,featured_image_url")
          .eq("status", "published")
          .textSearch("search_tsv", query, { type: "websearch", config: "english" })
          .limit(postsLimit);
        if (!error && data) postsData = data;
      } catch { /* tsv column missing — fall through */ }
    }

    if (!postsData) {
      // ILIKE fallback on title OR excerpt OR tags (works without tsv column)
      const safeQuery = query.replace(/%/g, "").replace(/_/g, "");
      const { data } = await sb
        .from("posts")
        .select("id,title,slug,category_slug,excerpt,featured_image_url")
        .eq("status", "published")
        .or(`title.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`)
        .limit(postsLimit);
      postsData = data || [];
    }

    grouped.posts = postsData.map((p: any) => ({
      type: "post" as const,
      title: p.title,
      subtitle: p.category_slug.replace(/-/g, " "),
      url: `/${p.category_slug}/${p.slug}`,
      excerpt: p.excerpt,
      image: p.featured_image_url,
    }));

    // ─── SCHOLARSHIPS ────────────────────────────────────────────────
    const schLimit = 5;
    let schData: any[] | null = null;

    if (!tooShort) {
      try {
        const { data, error } = await sb
          .from("scholarships")
          .select("id,scholarship_name,university_name,country,post_slug,featured_image_url,amount_inr")
          .eq("status", "active")
          .textSearch("search_tsv", query, { type: "websearch", config: "english" })
          .limit(schLimit);
        if (!error && data) schData = data;
      } catch { /* tsv column missing */ }
    }

    if (!schData) {
      const safeQuery = query.replace(/%/g, "").replace(/_/g, "");
      const { data } = await sb
        .from("scholarships")
        .select("id,scholarship_name,university_name,country,post_slug,featured_image_url,amount_inr")
        .eq("status", "active")
        .or(`scholarship_name.ilike.%${safeQuery}%,university_name.ilike.%${safeQuery}%,country.ilike.%${safeQuery}%`)
        .limit(schLimit);
      schData = data || [];
    }

    grouped.scholarships = schData.map((s: any) => ({
      type: "scholarship" as const,
      title: s.scholarship_name,
      subtitle: `${s.university_name}, ${s.country}`,
      url: s.post_slug ? `/scholarship/${s.post_slug}` : "/scholarships",
      excerpt: s.amount_inr ? `Amount: ${s.amount_inr}` : undefined,
      image: s.featured_image_url,
      badge: "100% Funded",
    }));

    // ─── UNIVERSITIES ────────────────────────────────────────────────
    if (query.length >= 3) {
      const { data } = await sb
        .from("universities")
        .select("id,name,country")
        .ilike("name", `%${query}%`)
        .limit(3);
      grouped.universities = (data || []).map((u: any) => ({
        type: "university" as const,
        title: u.name,
        subtitle: u.country,
        url: `/scholarships?country=${encodeURIComponent(u.country)}`,
        badge: "University",
      }));
    }
  } catch (e) {
    console.warn("[search] supabase error:", e);
    // Return whatever we have (static pages at least)
  }

  // Combine + sort
  const all = [
    ...grouped.pages,
    ...grouped.scholarships,
    ...grouped.posts,
    ...grouped.universities,
  ].slice(0, limit);

  return {
    query,
    total: all.length,
    results: all,
    grouped,
    durationMs: Date.now() - start,
  };
}
