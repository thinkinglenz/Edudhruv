import pagesJson from "./pages.json";

export interface StaticPage {
  slug: string;
  title: string;
  content: string;
  status: string;
}

export const STATIC_PAGES = pagesJson as StaticPage[];

export function getStaticPage(slug: string): StaticPage | undefined {
  return STATIC_PAGES.find(p => p.slug === slug && p.status === "publish");
}

export function getAllPageSlugs(): string[] {
  return STATIC_PAGES.filter(p => p.status === "publish").map(p => p.slug);
}
