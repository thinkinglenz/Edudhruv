"use client";
import { useEffect } from "react";
import { ListMyAIBanner, ThinkingLenzBanner } from "./RotatingBanner";

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

  // Dev placeholder — shows in local dev only, never in production
  if (IS_DEV) {
    const [w, h] = format === "horizontal" ? [728, 90] : format === "rectangle" ? [300, 250] : [336, 280];
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400 ${className}`}
        style={{ width: "100%", maxWidth: w, height: h, ...style }}
      >
        Ad Unit ({w}×{h}) — dev mode
      </div>
    );
  }

  // Production with no slot ID configured — render nothing (caller will show fallback)
  if (!slot) return null;

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
// Each ad component renders a useful brand banner as fallback when its
// AdSense slot ID is missing, so the visual space is never wasted with
// an empty placeholder or red "add slot ID" warning.

/** 728×90 leaderboard — falls back to ThinkingLenz brand banner */
export function LeaderboardAd({ className = "" }: { className?: string }) {
  if (!IS_DEV && !SLOT_LB) {
    return <ThinkingLenzBanner size="leaderboard" className={className} />;
  }
  return (
    <div className={`w-full bg-gray-50 border-y border-gray-100 py-2 ${className}`}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Advertisement</p>
      <div className="flex justify-center px-4">
        <AdUnit slot={SLOT_LB} format="horizontal" style={{ minHeight: 90, width: "100%", maxWidth: 728 }} />
      </div>
    </div>
  );
}

/** 300×250 sidebar rectangle — falls back to ListMyAI brand banner */
export function SidebarAd({ className = "" }: { className?: string }) {
  if (!IS_DEV && !SLOT_SB) {
    return <ListMyAIBanner size="sidebar" className={className} />;
  }
  return (
    <div className={className}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Advertisement</p>
      <AdUnit slot={SLOT_SB} format="rectangle" style={{ width: 300, height: 250 }} />
    </div>
  );
}

/** In-feed — auto height; falls back to ThinkingLenz horizontal in feed */
export function InFeedAd({ className = "" }: { className?: string }) {
  if (!IS_DEV && !SLOT_IF) {
    return (
      <div className={`col-span-full ${className}`}>
        <ThinkingLenzBanner size="leaderboard" />
      </div>
    );
  }
  return (
    <div className={`col-span-full ${className}`}>
      <p className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">Advertisement</p>
      <AdUnit slot={SLOT_IF} format="auto" style={{ minHeight: 100, display: "block" }} />
    </div>
  );
}

export default AdUnit;
