"use client";
import { useState } from "react";

export interface PostForShare {
  slug: string;
  title: string;
  excerpt: string | null;
  category_slug: string;
  featured_image_url: string | null;
  published_at: string | null;
}

interface Props {
  posts: PostForShare[];
  siteUrl: string;
}

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: "in" },
  { id: "twitter",  label: "X / Twitter", color: "#000000", icon: "𝕏" },
  { id: "facebook", label: "Facebook", color: "#1877F2", icon: "f" },
  { id: "whatsapp", label: "WhatsApp", color: "#25D366", icon: "💬" },
  { id: "email",    label: "Email", color: "#EA4335", icon: "✉️" },
] as const;

type PlatformId = typeof PLATFORMS[number]["id"];

// ─── COPY GENERATORS ──────────────────────────────────────────────────────
// Platform-specific tone, length, hashtags.
function generateCopy(post: PostForShare, platform: PlatformId, url: string): string {
  const title = post.title.trim();
  const excerpt = (post.excerpt || "").trim();

  // Smart hashtag selection by category
  const tagsByCat: Record<string, string[]> = {
    "scholarship":              ["#Scholarships", "#StudyAbroad", "#IndianStudents", "#FullyFunded"],
    "education-loan":           ["#StudentLoan", "#EducationLoan", "#StudyAbroad", "#IndianStudents"],
    "top-universities":         ["#TopUniversities", "#StudyAbroad", "#HigherEducation", "#IndianStudents"],
    "indian-students-abroad":   ["#StudyAbroad", "#IndianStudentsAbroad", "#OverseasEducation"],
    "student-accommodation":    ["#StudentLife", "#StudyAbroad", "#StudentHousing"],
    "travel-essentials":        ["#StudentVisa", "#StudyAbroad", "#Travel"],
  };
  const tags = tagsByCat[post.category_slug] || ["#StudyAbroad", "#IndianStudents"];

  switch (platform) {
    case "twitter": {
      // 280-char limit. Title + short excerpt + 2 tags + URL.
      const t = `🎓 ${title}`;
      const tagStr = tags.slice(0, 2).join(" ");
      const reserved = t.length + tagStr.length + url.length + 8; // newlines + spaces
      const room = Math.max(0, 280 - reserved);
      const snippet = excerpt.length > room ? excerpt.slice(0, room - 1) + "…" : excerpt;
      return `${t}\n\n${snippet}\n\n${tagStr}\n${url}`;
    }

    case "linkedin": {
      // Longer, professional. 1300-char sweet spot for engagement.
      const tagStr = tags.join(" ");
      return `🎓 ${title}\n\n${excerpt || "Read our latest guide for Indian students planning to study abroad."}\n\n` +
             `👉 Why this matters:\n` +
             `Education is the single biggest investment many Indian families will ever make. Getting the details right — funding, university choice, visa process — can save lakhs of rupees and years of effort.\n\n` +
             `📖 Read the full guide: ${url}\n\n` +
             `${tagStr} #EduDhruv`;
    }

    case "facebook": {
      const tagStr = tags.slice(0, 3).join(" ");
      return `🎓 ${title}\n\n${excerpt}\n\n📖 Full guide for Indian students: ${url}\n\n${tagStr}`;
    }

    case "whatsapp": {
      // Bold formatting works in WhatsApp via asterisks
      return `🎓 *${title}*\n\n${excerpt}\n\nRead more: ${url}`;
    }

    case "email": {
      return `Hi,\n\nI thought you'd find this useful — EduDhruv just published a detailed guide:\n\n${title}\n\n${excerpt}\n\nRead it here: ${url}\n\n— Shared from EduDhruv`;
    }
  }
}

// ─── BUILD SHARE URL ──────────────────────────────────────────────────────
function getShareUrl(platform: PlatformId, copy: string, url: string, title: string): string {
  const enc = encodeURIComponent;
  switch (platform) {
    case "twitter":
      // X/Twitter doesn't include URL twice — strip from copy text since they auto-append
      return `https://twitter.com/intent/tweet?text=${enc(copy)}`;
    case "facebook":
      // FB only accepts URL via sharer — they read OG tags from the page
      return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case "linkedin":
      // LinkedIn share intent only accepts URL — text must be pasted manually
      return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
    case "whatsapp":
      return `https://wa.me/?text=${enc(copy)}`;
    case "email":
      return `mailto:?subject=${enc("EduDhruv: " + title)}&body=${enc(copy)}`;
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function SocialPublisher({ posts, siteUrl }: Props) {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<{ post: PostForShare; platform: PlatformId } | null>(null);
  const [copy, setCopy] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  function openShare(post: PostForShare, platform: PlatformId) {
    const url = `${siteUrl}/${post.category_slug}/${post.slug}`;
    setCopy(generateCopy(post, platform, url));
    setActive({ post, platform });
    setCopied(false);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function shareNow() {
    if (!active) return;
    const url = `${siteUrl}/${active.post.category_slug}/${active.post.slug}`;
    const shareUrl = getShareUrl(active.platform, copy, url, active.post.title);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=700");
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search posts to share…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
        />
        <span className="text-xs text-gray-500">{filtered.length} posts</span>
      </div>

      {/* Posts list */}
      {filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400">No matching posts.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {filtered.slice(0, 50).map(post => (
              <li key={post.slug} className="px-5 py-4 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Image thumb */}
                  <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gray-800 overflow-hidden border border-gray-700">
                    {post.featured_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.featured_image_url} alt={post.title}
                           className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📄</div>
                    )}
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold line-clamp-2">{post.title}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      /{post.category_slug}/{post.slug}
                    </p>
                  </div>

                  {/* Platform buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => openShare(post, p.id)}
                        title={`Share to ${p.label}`}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity"
                        style={{ background: p.color }}
                      >
                        {p.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Share modal ───────────────────────────────────────── */}
      {active && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setActive(null); }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: PLATFORMS.find(p => p.id === active.platform)!.color }}>
                  {PLATFORMS.find(p => p.id === active.platform)!.icon}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Share to {PLATFORMS.find(p => p.id === active.platform)!.label}
                  </p>
                  <p className="text-xs text-gray-500">{copy.length} characters</p>
                </div>
              </div>
              <button onClick={() => setActive(null)}
                      className="text-gray-500 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center">
                ×
              </button>
            </div>

            {/* Preview image */}
            {active.post.featured_image_url && (
              <div className="px-6 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.post.featured_image_url} alt=""
                     className="w-full h-40 object-cover rounded-lg border border-gray-800" />
              </div>
            )}

            {/* Editable copy */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                  Post text (edit before sharing)
                </label>
                <textarea
                  value={copy}
                  onChange={e => setCopy(e.target.value)}
                  rows={10}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:border-brand resize-none"
                />
              </div>

              {/* Platform-specific tip */}
              {active.platform === "linkedin" && (
                <div className="bg-blue-900/20 border border-blue-800 text-blue-200 text-xs rounded-lg px-4 py-2.5">
                  ⓘ LinkedIn doesn't accept pre-filled text via URL. <strong>Click "Copy" first</strong>, then "Open LinkedIn" — paste in the share dialog that opens.
                </div>
              )}
              {active.platform === "facebook" && (
                <div className="bg-blue-900/20 border border-blue-800 text-blue-200 text-xs rounded-lg px-4 py-2.5">
                  ⓘ Facebook reads the post title + image automatically from the URL. <strong>Copy</strong> the text above, then add it as your caption in the share dialog.
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={copyToClipboard}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    copied
                      ? "bg-green-900/40 border-green-700 text-green-300"
                      : "border-gray-700 text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  {copied ? "✓ Copied!" : "📋 Copy text"}
                </button>
                <button
                  onClick={shareNow}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: PLATFORMS.find(p => p.id === active.platform)!.color }}
                >
                  Open {PLATFORMS.find(p => p.id === active.platform)!.label} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
