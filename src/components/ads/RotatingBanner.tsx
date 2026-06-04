"use client";
import { useEffect, useState } from "react";

/**
 * Rotating sponsored banner — cycles through multiple banners in a single slot.
 * Auto-picks the right size variant per slot (sidebar 300×250 or leaderboard 728×90).
 *
 * To use real GIFs:
 *   1. Drop your files into /public/banners/ — e.g.
 *        listmyai.gif         (animated GIF, ideally 300×250 or 728×90)
 *        thinkinglenz.gif
 *   2. Update the BANNERS array below: change ".svg" to ".gif" and
 *      optionally remove the size suffix if your GIF is responsive.
 */

interface Banner {
  /** Brand key — used to pick the right size variant from /public/banners/ */
  key:    string;
  /** Click-through URL */
  url:    string;
  /** Brand name (alt text) */
  name:   string;
  /** Background color while image loads */
  bg?:    string;
}

const BANNERS: Banner[] = [
  {
    key:  "listmyai",
    url:  "https://listmyai.com",
    name: "ListMyAI — Discover the Best AI Tools",
    bg:   "#0a0a23",
  },
  {
    key:  "thinkinglenz",
    url:  "https://thinkinglenz.com",
    name: "ThinkingLenz — Smart Insights for Your Mind",
    bg:   "#1a0a2a",
  },
];

interface Props {
  /** "sidebar" = 300×250 · "leaderboard" = 728×90 · "large" = 970×250 */
  size?: "sidebar" | "leaderboard" | "large";
  /** Rotation interval in ms */
  interval?: number;
  className?: string;
}

const SIZES = {
  sidebar:     { w: 300, h: 250, suffix: "300x250" },
  leaderboard: { w: 728, h: 90,  suffix: "728x90"  },
  large:       { w: 970, h: 250, suffix: "300x250" }, // fallback to 300x250 art, stretched
};

export default function RotatingBanner({ size = "sidebar", interval = 5000, className = "" }: Props) {
  const [current, setCurrent] = useState(0);
  const { w, h, suffix } = SIZES[size];

  useEffect(() => {
    if (BANNERS.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % BANNERS.length), interval);
    return () => clearInterval(t);
  }, [interval]);

  if (BANNERS.length === 0) return null;

  return (
    <div className={className}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">
        Sponsored
      </p>
      <a
        href={BANNERS[current].url}
        target="_blank"
        rel="noopener sponsored"
        className="relative block rounded-lg overflow-hidden hover:opacity-95 transition-opacity shadow-sm"
        style={{
          width:    "100%",
          maxWidth: w,
          aspectRatio: `${w} / ${h}`,
          background: BANNERS[current].bg || "#f3f4f6",
          margin: size === "sidebar" ? "0 auto" : undefined,
        }}
      >
        {BANNERS.map((b, i) => (
          <img
            key={b.key}
            src={`/banners/${b.key}-${suffix}.svg`}
            alt={b.name}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dot indicators */}
        {BANNERS.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`rounded-full transition-all ${
                  i === current ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"
                }`}
                aria-label={`Show banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </a>
    </div>
  );
}

// ─── Fixed single-brand variants (for slot-specific banners) ─────────────
// When you want ONE specific brand to fill a slot (e.g. user said ListMyAI here, ThinkingLenz there)

export function ListMyAIBanner({ size = "sidebar", className = "" }: Omit<Props, "interval">) {
  const { w, h, suffix } = SIZES[size];
  return (
    <div className={className}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Sponsored</p>
      <a href="https://listmyai.com" target="_blank" rel="noopener sponsored"
         className="block rounded-lg overflow-hidden hover:opacity-95 transition-opacity shadow-sm mx-auto"
         style={{ width: "100%", maxWidth: w, aspectRatio: `${w} / ${h}`, background: "#0a0a23" }}>
        <img src={`/banners/listmyai-${suffix}.svg`} alt="ListMyAI — Discover the Best AI Tools"
             loading="lazy" className="w-full h-full object-cover" />
      </a>
    </div>
  );
}

export function ThinkingLenzBanner({ size = "sidebar", className = "" }: Omit<Props, "interval">) {
  const { w, h, suffix } = SIZES[size];
  return (
    <div className={className}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Sponsored</p>
      <a href="https://thinkinglenz.com" target="_blank" rel="noopener sponsored"
         className="block rounded-lg overflow-hidden hover:opacity-95 transition-opacity shadow-sm mx-auto"
         style={{ width: "100%", maxWidth: w, aspectRatio: `${w} / ${h}`, background: "#1a0a2a" }}>
        <img src={`/banners/thinkinglenz-${suffix}.svg`} alt="ThinkingLenz — Smart Insights"
             loading="lazy" className="w-full h-full object-cover" />
      </a>
    </div>
  );
}
