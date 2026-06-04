"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/useUser";

interface Props {
  postSlug:        string;
  initialLikes?:   number;
  initialBookmarks?: number;
  views?:          number;
  comments?:       number;
}

export default function ReactionButtons({
  postSlug, initialLikes = 0, initialBookmarks = 0, views = 0, comments = 0,
}: Props) {
  const { user } = useUser();
  const [likes, setLikes]         = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [liked, setLiked]         = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/social/reaction?slug=${encodeURIComponent(postSlug)}&email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(d => { setLiked(!!d.liked); setBookmarked(!!d.bookmarked); })
      .catch(() => {});
  }, [user?.email, postSlug]);

  async function toggle(type: "like" | "bookmark") {
    if (!user?.email) {
      window.location.href = "/loan-portal";
      return;
    }
    const isOn  = type === "like" ? liked : bookmarked;
    const action = isOn ? "remove" : "add";

    // Optimistic UI
    if (type === "like") {
      setLiked(!liked);
      setLikes(c => c + (liked ? -1 : 1));
    } else {
      setBookmarked(!bookmarked);
      setBookmarks(c => c + (bookmarked ? -1 : 1));
    }

    try {
      await fetch("/api/social/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_slug: postSlug, type, action, user }),
      });
    } catch {
      // Revert on error
      if (type === "like") {
        setLiked(liked);
        setLikes(c => c + (liked ? 1 : -1));
      } else {
        setBookmarked(bookmarked);
        setBookmarks(c => c + (bookmarked ? 1 : -1));
      }
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap py-4 border-y border-gray-100">
      {/* Like */}
      <button
        onClick={() => toggle("like")}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:scale-105 ${
          liked ? "text-white" : "text-gray-600 hover:border-red-300"
        }`}
        style={liked
          ? { background: "#EF4444", borderColor: "#EF4444" }
          : { borderColor: "#E5E7EB" }}
      >
        <span className={liked ? "" : ""}>{liked ? "❤️" : "🤍"}</span>
        <span>{likes}</span>
        <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
      </button>

      {/* Bookmark */}
      <button
        onClick={() => toggle("bookmark")}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:scale-105 ${
          bookmarked ? "text-white" : "text-gray-600 hover:border-yellow-300"
        }`}
        style={bookmarked
          ? { background: "#F5A71A", borderColor: "#F5A71A" }
          : { borderColor: "#E5E7EB" }}
      >
        <span>{bookmarked ? "🔖" : "📑"}</span>
        <span>{bookmarks}</span>
        <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
      </button>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-gray-400 ml-auto">
        <span title="Views">👁 {views.toLocaleString()}</span>
        <span title="Comments">💬 {comments}</span>
      </div>
    </div>
  );
}
