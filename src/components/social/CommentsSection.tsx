"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/useUser";
import type { Comment } from "@/lib/social";

interface Props { postSlug: string; }

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getInitial(name: string): string {
  return (name || "?").charAt(0).toUpperCase();
}

function getColor(name: string): string {
  const colors = ["#3AAFE5", "#F5A71A", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#84CC16"];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function CommentsSection({ postSlug }: Props) {
  const { user, isLoading: userLoading } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [text, setText]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]           = useState("");
  const [msgType, setMsgType]   = useState<"success" | "error">("success");

  // Load comments
  useEffect(() => {
    fetch(`/api/social/comments?slug=${encodeURIComponent(postSlug)}`)
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .finally(() => setLoading(false));
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSubmitting(true); setMsg("");
    try {
      const res = await fetch("/api/social/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_slug: postSlug, content: text.trim(), user }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message); setMsgType("success");
        setText("");
        if (data.autoApproved) {
          // Refresh comment list
          const r2 = await fetch(`/api/social/comments?slug=${encodeURIComponent(postSlug)}`);
          const d2 = await r2.json();
          setComments(d2.comments || []);
        }
      } else {
        setMsg(data.error || "Could not post comment"); setMsgType("error");
      }
    } catch {
      setMsg("Network error. Please try again."); setMsgType("error");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-12" id="comments">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: "#3AAFE5" }}>
        <h2 className="text-2xl font-extrabold text-gray-900">
          💬 Discussion <span className="text-base font-normal text-gray-400">({comments.length})</span>
        </h2>
        <p className="text-xs text-gray-400 hidden sm:block">Comments are moderated before publishing</p>
      </div>

      {/* ── Comment form ── */}
      {userLoading ? (
        <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
      ) : user ? (
        <form onSubmit={handleSubmit} className="rounded-xl border-2 p-5 mb-8"
              style={{ borderColor: "#3AAFE5", background: "#F9FCFE" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
                 style={{ background: getColor(user.name) }}>
              {getInitial(user.name)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {user.name} <span className="text-gray-400 font-normal">· Logged in as {user.email}</span>
              </p>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Share your thoughts, questions, or experience..."
                rows={3}
                maxLength={5000}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand resize-none"
              />
              <div className="flex items-center justify-between mt-2 gap-3 flex-wrap">
                <p className="text-xs text-gray-400">
                  {text.length}/5000 · Be respectful · Spam will be removed
                </p>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="text-white font-semibold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-opacity"
                  style={{ background: "#3AAFE5" }}
                >
                  {submitting ? "Posting…" : "Post Comment"}
                </button>
              </div>
              {msg && (
                <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  msgType === "success" ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {msg}
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-xl p-6 mb-8 text-center border-2" style={{ borderColor: "#3AAFE5", background: "#EBF7FD" }}>
          <p className="text-4xl mb-2">🔒</p>
          <h3 className="font-bold text-lg mb-1" style={{ color: "#3AAFE5" }}>Join the Discussion</h3>
          <p className="text-sm text-gray-600 mb-4">Login or create a free account to comment, rate, and bookmark articles.</p>
          <Link
            href="/loan-portal"
            className="inline-block text-white font-semibold px-6 py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#3AAFE5" }}
          >
            Login / Register →
          </Link>
        </div>
      )}

      {/* ── Comments list ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">💭</p>
          <p>No comments yet. Be the first to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                   style={{ background: getColor(c.author_name) }}>
                {getInitial(c.author_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-gray-800">{c.author_name}</span>
                    <span className="text-xs text-gray-400">· {timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{c.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1.5 px-1">
                  <button className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors">
                    ❤ {c.likes_count > 0 && c.likes_count}
                  </button>
                  <button className="text-xs text-gray-400 hover:text-brand font-medium transition-colors"
                          style={{ color: "#3AAFE5" }} disabled={!user}>
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pre-moderation notice */}
      {user && (
        <p className="text-xs text-gray-400 text-center mt-8 pt-6 border-t border-gray-100">
          All comments are moderated before being published to keep the discussion respectful and spam-free.
        </p>
      )}
    </section>
  );
}
