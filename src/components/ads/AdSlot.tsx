"use client";
import { useEffect } from "react";

const CLIENT   = process.env.NEXT_PUBLIC_ADSENSE_ID       || "ca-pub-8001713028154145";
const SLOT_LB  = process.env.NEXT_PUBLIC_AD_SLOT_LEADERBOARD || "";  // 728×90
const SLOT_SB  = process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR     || "";  // 300×250
const SLOT_IF  = process.env.NEXT_PUBLIC_AD_SLOT_INFEED      || "";  // in-feed
const IS_DEV   = process.env.NODE_ENV !== "production";

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
}

function AdUnit({ slot, format = "auto", style, className = "" }: Props) {
  useEffect(() => {
    if (!slot || IS_DEV) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  // Dev placeholder — shows correct size without loading AdSense
  if (IS_DEV || !slot) {
    const [w, h] = format === "horizontal" ? [728, 90] : format === "rectangle" ? [300, 250] : [336, 280];
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400 ${className}`}
        style={{ width: "100%", maxWidth: w, height: h, ...style }}
      >
        Ad Unit ({w}×{h})
        {!slot && <span className="ml-1 text-red-400">— add slot ID to .env</span>}
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...(style || {}) }}
      data-ad-client={CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

// ─── Preset exports ────────────────────────────────────────────────────────

/** 728×90 leaderboard */
export function LeaderboardAd({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full bg-gray-50 border-y border-gray-100 py-2 ${className}`}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Advertisement</p>
      <div className="flex justify-center px-4">
        <AdUnit slot={SLOT_LB} format="horizontal" style={{ minHeight: 90, width: "100%", maxWidth: 728 }} />
      </div>
    </div>
  );
}

/** 300×250 sidebar rectangle */
export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Advertisement</p>
      <AdUnit slot={SLOT_SB} format="rectangle" style={{ width: 300, height: 250 }} />
    </div>
  );
}

/** In-feed — auto height */
export function InFeedAd({ className = "" }: { className?: string }) {
  return (
    <div className={`col-span-full ${className}`}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Advertisement</p>
      <AdUnit slot={SLOT_IF} format="auto" style={{ minHeight: 100, display: "block" }} />
    </div>
  );
}

export default AdUnit;
