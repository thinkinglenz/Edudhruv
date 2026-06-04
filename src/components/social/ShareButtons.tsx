"use client";
import { useState } from "react";

interface Props {
  url:   string;       // full URL of post
  title: string;       // post title
  slug:  string;       // for analytics
  className?: string;
}

const PLATFORMS = [
  { key: "whatsapp",  label: "WhatsApp",  color: "#25D366", icon: "💬",
    href: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t}\n${u}`)}` },
  { key: "twitter",   label: "Twitter",   color: "#000000", icon: "𝕏",
    href: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { key: "facebook",  label: "Facebook",  color: "#1877F2", icon: "f",
    href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { key: "linkedin",  label: "LinkedIn",  color: "#0A66C2", icon: "in",
    href: (u: string, t: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { key: "telegram",  label: "Telegram",  color: "#0088CC", icon: "✈",
    href: (u: string, t: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { key: "email",     label: "Email",     color: "#6B7280", icon: "✉",
    href: (u: string, t: string) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}` },
] as const;

export default function ShareButtons({ url, title, slug, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function logShare(platform: string) {
    try {
      const userJson = localStorage.getItem("edudhruv_user");
      const user = userJson ? JSON.parse(userJson) : null;
      fetch("/api/social/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_slug: slug, platform, user }),
      }).catch(() => {});
    } catch {}
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      logShare("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, url });
        logShare("native");
      } catch {}
    } else {
      copyLink();
    }
  }

  return (
    <div className={`${className}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Share This Article</p>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(p => (
          <a
            key={p.key}
            href={p.href(url, title)}
            target="_blank"
            rel="noopener"
            onClick={() => logShare(p.key)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-semibold transition-transform hover:scale-105 hover:shadow-md"
            style={{ background: p.color }}
            aria-label={`Share on ${p.label}`}
          >
            <span className="w-5 text-center font-extrabold">{p.icon}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </a>
        ))}

        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold transition-colors hover:bg-gray-200"
        >
          <span>{copied ? "✓" : "🔗"}</span>
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        <button
          onClick={nativeShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-semibold transition-transform hover:scale-105"
          style={{ background: "#3AAFE5" }}
        >
          <span>↗</span>
          <span className="hidden sm:inline">More</span>
        </button>
      </div>
    </div>
  );
}
