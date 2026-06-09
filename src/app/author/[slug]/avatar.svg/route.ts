/**
 * Generated avatar SVGs for each author — referenced by Person schema's
 * `image` property + the author profile page hero.
 *
 * URL: /author/[slug]/avatar.svg
 * Each is deterministic based on slug — same author = same avatar forever.
 */
import { NextResponse } from "next/server";
import { getAuthorBySlug, getInitials } from "@/lib/authors";

export const revalidate = 86400; // 1 day

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const author = getAuthorBySlug(params.slug);
  if (!author) return new NextResponse(null, { status: 404 });

  const initials = getInitials(author.name);
  const bg       = author.color;
  // Darken background ~20% for gradient end
  const darkBg   = bg.replace(/^#/, "");
  const r = parseInt(darkBg.slice(0, 2), 16);
  const g = parseInt(darkBg.slice(2, 4), 16);
  const b = parseInt(darkBg.slice(4, 6), 16);
  const darken = (v: number) => Math.max(0, Math.floor(v * 0.7));
  const darkerHex = `#${darken(r).toString(16).padStart(2, "0")}${darken(g).toString(16).padStart(2, "0")}${darken(b).toString(16).padStart(2, "0")}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${darkerHex}"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="128" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em"
        font-family="-apple-system, BlinkMacSystemFont, sans-serif"
        font-size="100" font-weight="800" fill="white">
    ${initials}
  </text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type":  "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
