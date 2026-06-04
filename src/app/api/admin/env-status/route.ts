import { NextRequest, NextResponse } from "next/server";

/**
 * Returns the live status of all admin-relevant env vars.
 * Only returns boolean (set / not set) — NEVER returns actual values.
 * Read by /admin/settings page to show ✅ / ❌ badges.
 */
function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("edudhruv_admin_v2")?.value;
  const pw = process.env.ADMIN_PASSWORD || "EduDhruv@Admin2025";
  const expected = btoa(`edudhruv::${pw}::admin_ok`).replace(/=/g, "");
  return cookie === expected;
}

function isSet(name: string, prefix?: string): boolean {
  const val = process.env[name];
  if (!val) return false;
  if (val === "placeholder") return false;
  if (val.startsWith("YOUR_") || val.startsWith("your_")) return false;
  if (prefix && !val.startsWith(prefix)) return false;
  return val.length > 4;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status: Record<string, boolean> = {
    // Google
    NEXT_PUBLIC_GA_ID:                    isSet("NEXT_PUBLIC_GA_ID", "G-"),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: isSet("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
    NEXT_PUBLIC_ADSENSE_ID:               isSet("NEXT_PUBLIC_ADSENSE_ID", "ca-pub-"),
    NEXT_PUBLIC_AD_SLOT_LEADERBOARD:      isSet("NEXT_PUBLIC_AD_SLOT_LEADERBOARD"),
    NEXT_PUBLIC_AD_SLOT_SIDEBAR:          isSet("NEXT_PUBLIC_AD_SLOT_SIDEBAR"),
    NEXT_PUBLIC_AD_SLOT_INFEED:           isSet("NEXT_PUBLIC_AD_SLOT_INFEED"),

    // AI
    ANTHROPIC_API_KEY:                    isSet("ANTHROPIC_API_KEY", "sk-"),
    CLAUDE_MODEL:                         isSet("CLAUDE_MODEL"),
    MAX_TOKENS:                           isSet("MAX_TOKENS"),
    UNSPLASH_ACCESS_KEY:                  isSet("UNSPLASH_ACCESS_KEY"),

    // Database
    NEXT_PUBLIC_SUPABASE_URL:             isSet("NEXT_PUBLIC_SUPABASE_URL", "https://"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY:        isSet("NEXT_PUBLIC_SUPABASE_ANON_KEY", "eyJ"),
    SUPABASE_SERVICE_ROLE_KEY:            isSet("SUPABASE_SERVICE_ROLE_KEY", "eyJ"),

    // Affiliate
    NEXT_PUBLIC_AMAZON_ASSOCIATE_ID:      isSet("NEXT_PUBLIC_AMAZON_ASSOCIATE_ID"),
    CJ_AFFILIATE_ID:                      isSet("CJ_AFFILIATE_ID"),
    CJ_AFFILIATE_SECRET:                  isSet("CJ_AFFILIATE_SECRET"),
    PRODIGY_REFERRAL_CODE:                isSet("PRODIGY_REFERRAL_CODE"),
    CREDILA_REFERRAL_CODE:                isSet("CREDILA_REFERRAL_CODE"),

    // Social / email
    FB_PAGE_ACCESS_TOKEN:                 isSet("FB_PAGE_ACCESS_TOKEN"),
    FB_PAGE_ID:                           isSet("FB_PAGE_ID"),
    FB_APP_ID:                            isSet("FB_APP_ID"),
    NEWSAPI_KEY:                          isSet("NEWSAPI_KEY"),
    WHATSAPP_NUMBER:                      isSet("WHATSAPP_NUMBER"),
    LEAD_NOTIFY_EMAIL:                    isSet("LEAD_NOTIFY_EMAIL"),
    RESEND_API_KEY:                       isSet("RESEND_API_KEY", "re_"),
    SENDGRID_API_KEY:                     isSet("SENDGRID_API_KEY", "SG."),

    // Captcha
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:       isSet("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
    TURNSTILE_SECRET_KEY:                 isSet("TURNSTILE_SECRET_KEY"),

    // Revalidation
    REVALIDATE_SECRET:                    isSet("REVALIDATE_SECRET"),
    SITE_URL:                             isSet("SITE_URL", "https://"),

    // Security
    ADMIN_PASSWORD:                       isSet("ADMIN_PASSWORD"),
    ADMIN_SESSION_TOKEN:                  isSet("ADMIN_SESSION_TOKEN"),
  };

  return NextResponse.json({ status });
}
