"use client";
import { useState } from "react";

interface Post {
  slug: string;
  title: string;
  excerpt?: string | null;
  category_slug: string;
  featured_image_url?: string | null;
}

interface Props {
  post: Post;
  siteUrl: string;
}

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn",    color: "#0A66C2", icon: "in" },
  { id: "twitter",  label: "X / Twitter", color: "#000000", icon: "𝕏" },
  { id: "facebook", label: "Facebook",    color: "#1877F2", icon: "f"  },
  { id: "whatsapp", label: "WhatsApp",    color: "#25D366", icon: "💬" },
  { id: "email",    label: "Email",       color: "#EA4335", icon: "✉️" },
] as const;

type PlatformId = typeof PLATFORMS[number]["id"];

// ─── COPY GENERATORS ──────────────────────────────────────────────────────
function generateCopy(post: Post, platform: PlatformId, url: string): string {
  const title   = post.title.trim();
  const excerpt = (post.excerpt || "").trim();

  const tagsByCat: Record<string, string[]> = {
    "scholarship":            ["#Scholarships", "#StudyAbroad", "#IndianStudents", "#FullyFunded"],
    "education-loan":         ["#StudentLoan", "#EducationLoan", "#StudyAbroad", "#IndianStudents"],
    "top-universities":       ["#TopUniversities", "#StudyAbroad", "#HigherEducation", "#IndianStudents"],
    "indian-students-abroad": ["#StudyAbroad", "#IndianStudentsAbroad", "#OverseasEducation"],
    "student-accommodation":  ["#StudentLife", "#StudyAbroad", "#StudentHousing"],
    "travel-essentials":      ["#StudentVisa", "#StudyAbroad", "#Travel"],
  };
  const tags = tagsByCat[post.category_slug] || ["#StudyAbroad", "#IndianStudents"];

  switch (platform) {
    case "twitter": {
      const t = `🎓 ${title}`;
      const tagStr = tags.slice(0, 2).join(" ");
      const reserved = t.length + tagStr.length + url.length + 8;
      const room = Math.max(0, 280 - reserved);
      const snippet = excerpt.length > room ? excerpt.slice(0, room - 1) + "…" : excerpt;
      return `${t}\n\n${snippet}\n\n${tagStr}\n${url}`;
    }
    case "linkedin":
      return `🎓 ${title}\n\n${excerpt || "Read our latest guide for Indian students planning to study abroad."}\n\n` +
             `👉 Why this matters:\nEducation is the single biggest investment many Indian families will ever make. ` +
             `Getting the details right — funding, university choice, visa process — can save lakhs of rupees and years of effort.\n\n` +
             `📖 Read the full guide: ${url}\n\n${tags.join(" ")} #EduDhruv`;
    case "facebook":
      return `🎓 ${title}\n\n${excerpt}\n\n📖 Full guide for Indian students: ${url}\n\n${tags.slice(0, 3).join(" ")}`;
    case "whatsapp":
      return `🎓 *${title}*\n\n${excerpt}\n\nRead more: ${url}`;
    case "email":
      return `Hi,\n\nI thought you'd find this useful — EduDhruv just published a detailed guide:\n\n${title}\n\n${excerpt}\n\nRead it here: ${url}\n\n— Shared from EduDhruv`;
  }
}

function getShareUrl(platform: PlatformId, copy: string, url: string, title: string): string {
  const enc = encodeURIComponent;
  switch (platform) {
    case "twitter":  return `https://twitter.com/intent/tweet?text=${enc(copy)}`;
    case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
    case "whatsapp": return `https://wa.me/?text=${enc(copy)}`;
    case "email":    return `mailto:?subject=${enc("EduDhruv: " + title)}&body=${enc(copy)}`;
  }
}

// ─── IMAGE DOWNLOAD (canvas → PNG) ────────────────────────────────────────
async function downloadAsPng(url: string, filename: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve({ ok: false, error: "Canvas unavailable" });
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return resolve({ ok: false, error: "Could not convert" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${filename}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          resolve({ ok: true });
        }, "image/png", 0.95);
      } catch (e: any) {
        // Canvas tainted by CORS — fall back to opening image in new tab
        window.open(url, "_blank", "noopener");
        resolve({ ok: false, error: "CORS blocked — opened image in new tab so you can right-click and save" });
      }
    };
    img.onerror = () => {
      window.open(url, "_blank", "noopener");
      resolve({ ok: false, error: "Image failed to load — opened in new tab" });
    };
    img.src = url;
  });
}

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function ShareButton({ post, siteUrl }: Props) {
  const [open, setOpen]       = useState(false);
  const [platform, setPlatform] = useState<PlatformId>("linkedin");
  const [copy, setCopy]       = useState("");
  const [copied, setCopied]   = useState(false);
  const [imgState, setImgState] = useState<"idle" | "downloading" | "done" | "error">("idle");
  const [imgError, setImgError] = useState("");

  const url = `${siteUrl}/${post.category_slug}/${post.slug}`;

  function selectPlatform(p: PlatformId) {
    setPlatform(p);
    setCopy(generateCopy(post, p, url));
    setCopied(false);
  }

  function openModal() {
    setOpen(true);
    selectPlatform("linkedin"); // Default to LinkedIn
    setImgState("idle");
    setImgError("");
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function openShareWindow() {
    const shareUrl = getShareUrl(platform, copy, url, post.title);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=700");
  }

  async function downloadImage() {
    if (!post.featured_image_url) return;
    setImgState("downloading");
    setImgError("");
    const filename = post.slug.replace(/[^a-z0-9-]/gi, "-");
    const result = await downloadAsPng(post.featured_image_url, filename);
    if (result.ok) {
      setImgState("done");
      setTimeout(() => setImgState("idle"), 2500);
    } else {
      setImgState("error");
      setImgError(result.error || "Download failed");
    }
  }

  const activePlatform = PLATFORMS.find(p => p.id === platform)!;

  function quickShare(p: PlatformId) {
    selectPlatform(p);
    setOpen(true);
    setImgState("idle");
    setImgError("");
  }

  return (
    <>
      {/* Inline platform icons — one click opens modal pre-selected to that platform */}
      <div className="inline-flex items-center gap-1 align-middle">
        {PLATFORMS.filter(p => p.id !== "email").map(p => (
          <button
            key={p.id}
            onClick={() => quickShare(p.id)}
            title={`Share to ${p.label}`}
            className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold hover:opacity-80 hover:scale-110 transition-all"
            style={{ background: p.color }}
          >
            {p.icon}
          </button>
        ))}
        <button
          onClick={openModal}
          title="More options — Email, Download Image, Edit caption"
          className="text-xs px-1.5 text-gray-500 hover:text-white"
        >
          ⋯
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-white font-semibold text-sm line-clamp-1">{post.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">/{post.category_slug}/{post.slug}</p>
              </div>
              <button onClick={() => setOpen(false)}
                      className="text-gray-500 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center flex-shrink-0">
                ×
              </button>
            </div>

            {/* Platform selector */}
            <div className="px-6 py-4 border-b border-gray-800">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Choose platform</p>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectPlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      platform === p.id
                        ? "text-white border-transparent shadow-lg"
                        : "text-gray-300 border-gray-700 bg-gray-800 hover:bg-gray-700"
                    }`}
                    style={platform === p.id ? { background: p.color } : {}}
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded text-white text-xs font-bold"
                          style={{ background: platform === p.id ? "rgba(255,255,255,0.2)" : p.color }}>
                      {p.icon}
                    </span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image preview + download */}
            {post.featured_image_url && (
              <div className="px-6 pt-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Featured image</p>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.featured_image_url} alt={post.title}
                       className="w-full h-44 object-cover rounded-lg border border-gray-800" />
                  <button
                    onClick={downloadImage}
                    disabled={imgState === "downloading"}
                    className={`absolute top-2 right-2 text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all ${
                      imgState === "done"  ? "bg-green-900/80 text-green-200" :
                      imgState === "error" ? "bg-red-900/80 text-red-200"   :
                                             "bg-black/70 text-white hover:bg-black"
                    }`}
                  >
                    {imgState === "downloading" ? "⏳ Converting…" :
                     imgState === "done"        ? "✓ Downloaded PNG" :
                     imgState === "error"       ? "⚠ Opened in new tab" :
                                                  "📥 Download as PNG"}
                  </button>
                </div>
                {imgError && (
                  <p className="text-xs text-red-400 mt-1.5">{imgError}</p>
                )}
              </div>
            )}

            {/* Editable copy */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Post text for {activePlatform.label}
                  </label>
                  <span className="text-xs text-gray-500">{copy.length} chars</span>
                </div>
                <textarea
                  value={copy}
                  onChange={e => setCopy(e.target.value)}
                  rows={9}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:border-brand resize-none"
                />
              </div>

              {/* Per-platform hint */}
              {platform === "linkedin" && (
                <div className="bg-blue-900/20 border border-blue-800 text-blue-200 text-xs rounded-lg px-4 py-2.5">
                  ⓘ LinkedIn doesn't pre-fill text. <strong>Copy first</strong>, then click "Open LinkedIn" — paste in the dialog. Upload the PNG you just downloaded as the image.
                </div>
              )}
              {platform === "facebook" && (
                <div className="bg-blue-900/20 border border-blue-800 text-blue-200 text-xs rounded-lg px-4 py-2.5">
                  ⓘ Facebook reads the title + image from the URL automatically. Copy the caption above and paste in their dialog.
                </div>
              )}
              {platform === "twitter" && copy.length > 280 && (
                <div className="bg-red-900/20 border border-red-800 text-red-200 text-xs rounded-lg px-4 py-2.5">
                  ⚠ {copy.length} chars — over X's 280 limit. Trim before posting.
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={copyToClipboard}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    copied
                      ? "bg-green-900/40 border-green-700 text-green-300"
                      : "border-gray-700 text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  {copied ? "✓ Copied to clipboard" : "📋 Copy text"}
                </button>
                <button
                  onClick={openShareWindow}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: activePlatform.color }}
                >
                  Open {activePlatform.label} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
