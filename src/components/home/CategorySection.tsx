import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import type { Post } from "@/lib/types";
import type { Category } from "@/lib/types";

interface Props {
  category: { slug: string; name: string; description: string; color: string; icon: string };
  posts: Post[];
}

export default function CategorySection({ category, posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 pb-3 border-b-2" style={{ borderColor: "#3AAFE5" }}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${category.color}`}>
            {category.icon} {category.name}
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#333" }}>
            Latest in {category.name}
          </h2>
        </div>
        <Link
          href={`/${category.slug}`}
          className="text-sm font-semibold hover:underline whitespace-nowrap"
          style={{ color: "#3AAFE5" }}
        >
          View all →
        </Link>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.slice(0, 4).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
