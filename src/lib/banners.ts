/**
 * Banner config — single source of truth.
 * Edit BANNERS array below to add/remove/change sponsored placements.
 * Stored in code (not DB) so changes deploy with code review.
 */

export interface BannerConfig {
  id:        string;
  brand:     string;
  url:       string;
  image_sm:  string;   // 300x250 sidebar
  image_lg:  string;   // 728x90 leaderboard
  bg:        string;
  is_active: boolean;
  /** Placements where this banner appears */
  placements: ("homepage-sidebar" | "homepage-leaderboard" | "post-sidebar" | "post-leaderboard" | "category-leaderboard" | "static-sidebar")[];
  /** Display weight (higher = more often in rotation) */
  weight?:   number;
  /** Start/end dates — null = always active */
  starts_at?: string | null;
  ends_at?:   string | null;
  notes?:    string;
}

export const BANNERS: BannerConfig[] = [
  {
    id:         "listmyai",
    brand:      "ListMyAI",
    url:        "https://listmyai.com",
    image_sm:   "/banners/listmyai-300x250.svg",
    image_lg:   "/banners/listmyai-728x90.svg",
    bg:         "#0a0a23",
    is_active:  true,
    placements: ["homepage-sidebar", "homepage-leaderboard", "post-sidebar", "post-leaderboard", "category-leaderboard", "static-sidebar"],
    weight:     1,
    notes:      "Discover the Best AI Tools",
  },
  {
    id:         "thinkinglenz",
    brand:      "ThinkingLenz",
    url:        "https://thinkinglenz.com",
    image_sm:   "/banners/thinkinglenz-300x250.svg",
    image_lg:   "/banners/thinkinglenz-728x90.svg",
    bg:         "#1a0a2a",
    is_active:  true,
    placements: ["homepage-sidebar", "homepage-leaderboard", "post-sidebar", "post-leaderboard", "category-leaderboard", "static-sidebar"],
    weight:     1,
    notes:      "Smart Insights for Your Mind",
  },
];

export function getActiveBanners(): BannerConfig[] {
  const now = new Date();
  return BANNERS.filter(b => {
    if (!b.is_active) return false;
    if (b.starts_at && new Date(b.starts_at) > now) return false;
    if (b.ends_at   && new Date(b.ends_at)   < now) return false;
    return true;
  });
}

export function getBannersForPlacement(placement: BannerConfig["placements"][number]): BannerConfig[] {
  return getActiveBanners().filter(b => b.placements.includes(placement));
}
