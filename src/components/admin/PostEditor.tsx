"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

interface PostData {
  id?:                string;
  title?:             string;
  slug?:              string;
  content?:           string;
  excerpt?:           string;
  category_slug?:     string;
  meta_title?:        string;
  meta_description?:  string;
  focus_keyword?:     string;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
  reading_time?:      number | null;
  tags?:              string[];
  status?:            string;
}

interface Props {
  existing?:    PostData;
  isEditing?:   boolean;
}

/**
 * Rich-text post editor — supports HTML, images, videos, tables, lists, links.
 * Uses contentEditable (no external dependency).
 * Works in both new-post and edit-post modes.
 */
export default function PostEditor({ existing = {}, isEditing = false }: Props) {
  const router  = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<PostData>({
    title:              existing.title              || "",
    slug:               existing.slug               || "",
    content:            existing.content            || "",
    excerpt:            existing.excerpt            || "",
    category_slug:      existing.category_slug      || "latest",
    meta_title:         existing.meta_title         || "",
    meta_description:   existing.meta_description   || "",
    focus_keyword:      existing.focus_keyword      || "",
    featured_image_url: existing.featured_image_url || "",
    featured_image_alt: existing.featured_image_alt || "",
    reading_time:       existing.reading_time       || 7,
    tags:               existing.tags               || [],
    status:             existing.status             || "draft",
  });

  const [tagInput,    setTagInput]    = useState("");
  const [saving,      setSaving]      = useState(false);
  const [message,     setMessage]     = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [seoOpen,     setSeoOpen]     = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && existing.content) {
      editorRef.current.innerHTML = existing.content;
    }
  }, [existing.content]);

  // Auto-generate slug from title (only if creating new)
  useEffect(() => {
    if (!isEditing && form.title && !form.slug) {
      const slug = form.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
      setForm(f => ({ ...f, slug }));
    }
  }, [form.title, isEditing, form.slug]);

  // ─── Toolbar commands ─────────────────────────────────────────────
  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }

  function insertHTML(html: string) {
    document.execCommand("insertHTML", false, html);
    editorRef.current?.focus();
  }

  function insertImage() {
    const url = prompt("Image URL (paste a hosted image link):");
    if (!url) return;
    const alt = prompt("Alt text (describe the image for accessibility):") || "";
    insertHTML(`<figure><img src="${url}" alt="${alt}" loading="lazy" style="max-width:100%;border-radius:8px;" /><figcaption>${alt}</figcaption></figure>`);
  }

  function insertVideo() {
    const url = prompt("YouTube URL (or any embed URL):");
    if (!url) return;
    // Extract YouTube video ID
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    if (ytMatch) {
      insertHTML(`<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px;"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`);
    } else {
      insertHTML(`<video src="${url}" controls style="max-width:100%;border-radius:8px;"></video>`);
    }
  }

  function insertTable() {
    const cols = parseInt(prompt("Number of columns:", "3") || "3");
    const rows = parseInt(prompt("Number of rows (including header):", "4") || "4");
    if (!cols || !rows) return;
    let html = '<table style="width:100%;border-collapse:collapse;margin:24px 0;"><thead><tr>';
    for (let c = 0; c < cols; c++) html += `<th style="border:1px solid #e5e7eb;padding:8px;background:#f9fafb;">Header ${c+1}</th>`;
    html += '</tr></thead><tbody>';
    for (let r = 1; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) html += `<td style="border:1px solid #e5e7eb;padding:8px;">Cell</td>`;
      html += '</tr>';
    }
    html += '</tbody></table>';
    insertHTML(html);
  }

  function insertLink() {
    const url = prompt("Link URL:");
    if (!url) return;
    exec("createLink", url);
  }

  function insertHTMLBlock() {
    const html = prompt("Paste raw HTML (iframe, embed, custom widget, etc):");
    if (html) insertHTML(html);
  }

  function insertCallout() {
    insertHTML(`<div style="background:#EBF7FD;border-left:4px solid #3AAFE5;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;"><strong>💡 Note:</strong> Type your callout here</div>`);
  }

  // ─── Save handler ──────────────────────────────────────────────────
  async function save(status: "draft" | "published") {
    if (!form.title || !form.slug) {
      setMessage("Title and slug are required");
      setMessageType("error");
      return;
    }
    setSaving(true); setMessage("");

    const content = editorRef.current?.innerHTML || "";
    const plain   = content.replace(/<[^>]+>/g, "");
    const words   = plain.split(/\s+/).filter(Boolean).length;
    const auto_reading_time = Math.max(1, Math.round(words / 200));

    const payload = {
      ...form,
      content,
      status,
      reading_time: form.reading_time || auto_reading_time,
    };

    try {
      const res = await fetch(
        isEditing ? `/api/admin/posts/${existing.id}` : "/api/admin/posts",
        {
          method:  isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage(`✓ Post ${status === "published" ? "published" : "saved as draft"}!`);
      setMessageType("success");
      // Redirect after a moment
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (e: any) {
      setMessage(e?.message || "Save failed");
      setMessageType("error");
    }
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* ── Left: Editor ── */}
      <div className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Post title — write something compelling…"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 text-white text-2xl font-bold rounded-xl px-5 py-4 focus:outline-none focus:border-brand"
        />

        {/* Slug */}
        <div className="flex items-center gap-2 text-sm bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
          <span className="text-gray-500 font-mono whitespace-nowrap">/{form.category_slug}/</span>
          <input
            type="text"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            className="flex-1 bg-transparent text-white font-mono focus:outline-none"
            placeholder="url-slug"
          />
        </div>

        {/* Toolbar */}
        <div className="bg-gray-900 border border-gray-700 rounded-t-xl px-3 py-2 flex flex-wrap gap-1 sticky top-0 z-10">
          <ToolbarGroup>
            <Btn onClick={() => exec("formatBlock", "h2")} title="Heading 2">H2</Btn>
            <Btn onClick={() => exec("formatBlock", "h3")} title="Heading 3">H3</Btn>
            <Btn onClick={() => exec("formatBlock", "p")} title="Paragraph">P</Btn>
          </ToolbarGroup>
          <Sep />
          <ToolbarGroup>
            <Btn onClick={() => exec("bold")} title="Bold (Cmd/Ctrl+B)"><strong>B</strong></Btn>
            <Btn onClick={() => exec("italic")} title="Italic"><em>I</em></Btn>
            <Btn onClick={() => exec("underline")} title="Underline"><u>U</u></Btn>
            <Btn onClick={() => exec("strikeThrough")} title="Strikethrough"><s>S</s></Btn>
          </ToolbarGroup>
          <Sep />
          <ToolbarGroup>
            <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list">• List</Btn>
            <Btn onClick={() => exec("insertOrderedList")} title="Numbered list">1. List</Btn>
            <Btn onClick={() => exec("formatBlock", "blockquote")} title="Quote">❝ Quote</Btn>
          </ToolbarGroup>
          <Sep />
          <ToolbarGroup>
            <Btn onClick={insertLink} title="Insert link">🔗 Link</Btn>
            <Btn onClick={insertImage} title="Insert image">🖼 Image</Btn>
            <Btn onClick={insertVideo} title="Insert YouTube/video">▶ Video</Btn>
            <Btn onClick={insertTable} title="Insert table">⊞ Table</Btn>
            <Btn onClick={insertCallout} title="Callout box">💡 Callout</Btn>
            <Btn onClick={insertHTMLBlock} title="Insert raw HTML">{"</>"} HTML</Btn>
          </ToolbarGroup>
          <Sep />
          <ToolbarGroup>
            <Btn onClick={() => exec("removeFormat")} title="Clear formatting">⌫ Clear</Btn>
            <Btn onClick={() => exec("undo")} title="Undo">↶</Btn>
            <Btn onClick={() => exec("redo")} title="Redo">↷</Btn>
          </ToolbarGroup>
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[500px] bg-white text-gray-900 rounded-b-xl p-6 prose-editor focus:outline-none"
          style={{ fontSize: 16, lineHeight: 1.7 }}
          onInput={() => {
            // sync HTML to state
            setForm(f => ({ ...f, content: editorRef.current?.innerHTML || "" }));
          }}
        />

        {/* Word count */}
        <p className="text-xs text-gray-500 text-right">
          {(form.content || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length} words
        </p>

        <style>{`
          .prose-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5em 0 0.5em; color:#111; }
          .prose-editor h3 { font-size: 1.2rem; font-weight: 600; margin: 1.2em 0 0.3em; color:#222; }
          .prose-editor p  { margin: 0.8em 0; }
          .prose-editor ul, .prose-editor ol { margin: 1em 0; padding-left: 1.5em; }
          .prose-editor li { margin: 0.3em 0; }
          .prose-editor a  { color: #3AAFE5; text-decoration: underline; }
          .prose-editor blockquote { border-left: 4px solid #3AAFE5; padding-left: 1em; margin: 1em 0; color:#555; font-style:italic; }
          .prose-editor img { max-width: 100%; border-radius: 8px; }
          .prose-editor table { width:100%; border-collapse:collapse; margin: 1em 0; }
          .prose-editor th, .prose-editor td { border: 1px solid #e5e7eb; padding: 8px; }
          .prose-editor th { background:#f9fafb; font-weight:600; }
        `}</style>
      </div>

      {/* ── Right: Sidebar ── */}
      <aside className="space-y-5">
        {/* Status + Save buttons */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Status</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              form.status === "published" ? "bg-green-900/60 text-green-400" : "bg-yellow-900/60 text-yellow-400"
            }`}>
              {form.status === "published" ? "PUBLISHED" : "DRAFT"}
            </span>
          </div>

          <button
            onClick={() => save("draft")}
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "💾 Save as Draft"}
          </button>

          <button
            onClick={() => save("published")}
            disabled={saving || !form.title || !form.slug}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm disabled:opacity-50 transition-opacity"
            style={{ background: "#3AAFE5" }}
          >
            {saving ? "Publishing…" : "🚀 Publish"}
          </button>

          {message && (
            <p className={`text-xs px-3 py-2 rounded-lg ${
              messageType === "success"
                ? "bg-green-900/40 border border-green-700 text-green-300"
                : "bg-red-900/40 border border-red-700 text-red-300"
            }`}>
              {message}
            </p>
          )}
        </div>

        {/* Category */}
        <Section title="Category">
          <select
            value={form.category_slug}
            onChange={e => setForm({ ...form, category_slug: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
          </select>
        </Section>

        {/* Featured image */}
        <Section title="Featured Image">
          {form.featured_image_url && (
            <img src={form.featured_image_url} alt="" className="w-full rounded-lg mb-2 max-h-40 object-cover" />
          )}
          <input
            type="url"
            placeholder="https://image-url.jpg"
            value={form.featured_image_url || ""}
            onChange={e => setForm({ ...form, featured_image_url: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Alt text"
            value={form.featured_image_alt || ""}
            onChange={e => setForm({ ...form, featured_image_alt: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 mt-2 focus:outline-none"
          />
        </Section>

        {/* Excerpt */}
        <Section title="Excerpt">
          <textarea
            placeholder="2-sentence summary…"
            value={form.excerpt}
            onChange={e => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
            maxLength={300}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none resize-none"
          />
          <p className="text-[10px] text-gray-500 mt-1">{(form.excerpt || "").length}/300 chars</p>
        </Section>

        {/* Tags */}
        <Section title="Tags">
          <div className="flex flex-wrap gap-1 mb-2">
            {(form.tags || []).map((t, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                {t}
                <button onClick={() => setForm({ ...form, tags: form.tags?.filter((_, j) => j !== i) })}
                        className="text-gray-500 hover:text-red-400">×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type tag + Enter…"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && tagInput.trim()) {
                e.preventDefault();
                setForm({ ...form, tags: [...(form.tags || []), tagInput.trim()] });
                setTagInput("");
              }
            }}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          />
        </Section>

        {/* SEO (collapsible) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">🔍 SEO Settings</span>
            <span className="text-gray-500">{seoOpen ? "▲" : "▼"}</span>
          </button>
          {seoOpen && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Meta title (≤65 chars)</label>
                <input
                  value={form.meta_title}
                  onChange={e => setForm({ ...form, meta_title: e.target.value })}
                  maxLength={65}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 mt-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Meta description (≤160 chars)</label>
                <textarea
                  value={form.meta_description}
                  onChange={e => setForm({ ...form, meta_description: e.target.value })}
                  maxLength={160}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 mt-1 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Focus keyword</label>
                <input
                  value={form.focus_keyword}
                  onChange={e => setForm({ ...form, focus_keyword: e.target.value })}
                  maxLength={100}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 mt-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Reading time (min)</label>
                <input
                  type="number"
                  value={form.reading_time || ""}
                  onChange={e => setForm({ ...form, reading_time: parseInt(e.target.value) || 0 })}
                  min={1} max={60}
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 mt-1 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-1">{children}</div>;
}

function Sep() { return <div className="w-px bg-gray-700 mx-1 my-1" />; }

function Btn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
    >
      {children}
    </button>
  );
}
