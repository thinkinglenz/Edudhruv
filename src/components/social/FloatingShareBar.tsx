"use client";
import { useEffect, useState } from "react";

interface Props {
  url:   string;
  title: string;
  slug:  string;
}

const PLATFORMS = [
  { key: "whatsapp",  color: "#25D366", icon: "💬",
    href: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t}\n${u}`)}` },
  { key: "twitter",   color: "#000000", icon: "𝕏",
    href: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { key: "facebook",  color: "#1877F2", icon: "f",
    href: (u: string)            => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { key: "linkedin",  color: "#0A66C2", icon: "in",
    href: (u: string)            => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
] as const;

export default function FloatingShareBar({ url, title, slug }: Props) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    function update() {
      // Show after 300px scroll, hide near footer
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(y > 300 && y < h - 600);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function logShare(p: string) {
    try {
      const userJson = localStorage.getItem("edudhruv_user");
      const user = userJson ? JSON.parse(userJson) : null;
      fetch("/api/social/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_slug: slug, platform: p, user }),
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

  return (
    <div
      className={`hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 flex-col gap-2 z-40 transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-1.5 flex flex-col gap-1">
        {PLATFORMS.map(p => (
          <a key={p.key} href={p.href(url, title)} target="_blank" rel="noopener" onClick={() => logShare(p.key)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold transition-transform hover:scale-110"
            style={{ background: p.color }} title={`Share on ${p.key}`}>
            {p.icon}
          </a>
        ))}
        <button onClick={copyLink}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
          title="Copy link">
          {copied ? "✓" : "🔗"}
        </button>
        <button
          onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
          style={{ background: "#3AAFE5" }}
          title="Jump to comments">
          💬
        </button>
      </div>
    </div>
  );
}
