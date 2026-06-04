import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Post } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PostCard({ post }: { post: Post }) {
  const cat = getCategoryBySlug(post.category_slug);
  const href = `/${post.category_slug}/${post.slug}`;

  return (
    <article className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      {post.featured_image_url && (
        <Link href={href} className="block aspect-[16/9] relative overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="p-5">
        {cat && (
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${cat.color}`}>
            {cat.icon} {cat.name}
          </span>
        )}
        <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-brand transition-colors">
          <Link href={href}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatDate(post.created_at)}</span>
          {post.reading_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time} min read
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
