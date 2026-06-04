import AdminHeader from "@/components/admin/AdminHeader";
import Pagination from "@/components/admin/Pagination";
import { CATEGORIES } from "@/lib/categories";
import { MOCK_POSTS } from "@/lib/mock-data";
import Link from "next/link";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

const PAGE_SIZE = 20;

interface PostRow {
  id: string;
  title: string;
  slug: string;
  category_slug: string;
  status: string;
  created_at: string;
  reading_time?: number;
}

async function getPosts(category: string, status: string, search: string, page: number) {
  if (IS_MOCK) {
    let filtered = MOCK_POSTS as any[];
    if (category) filtered = filtered.filter(p => p.category_slug === category);
    if (status)   filtered = filtered.filter(p => p.status === status);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q)
      );
    }
    const total = filtered.length;
    const start = (page - 1) * PAGE_SIZE;
    return { posts: filtered.slice(start, start + PAGE_SIZE) as PostRow[], total };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  let query = db
    .from("posts")
    .select("id,title,slug,category_slug,status,created_at,reading_time", { count: "exact" })
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category_slug", category);
  if (status)   query = query.eq("status", status);
  if (search)   query = query.ilike("title", `%${search}%`);
  const start = (page - 1) * PAGE_SIZE;
  const { data, count } = await query.range(start, start + PAGE_SIZE - 1);
  return { posts: (data || []) as PostRow[], total: count || 0 };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { category?: string; status?: string; search?: string; page?: string };
}) {
  const category = searchParams.category || "";
  const status   = searchParams.status   || "";
  const search   = searchParams.search   || "";
  const page     = parseInt(searchParams.page || "1");

  const { posts, total } = await getPosts(category, status, search, page);

  // Stats — total per status
  const allPosts = MOCK_POSTS as any[];
  const publishedCount = allPosts.filter(p => p.status === "published").length;
  const draftCount     = allPosts.filter(p => p.status === "draft").length;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Posts"
        subtitle={`${publishedCount} published · ${draftCount} drafts · ${total} ${(category || status || search) ? "matching" : "total"}`}
        action={
          <Link href="/admin/posts/new"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: "#3AAFE5" }}>
            + New Post
          </Link>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {/* Filters — uses form GET so URL has the params */}
        <form action="/admin/posts" method="get" className="flex flex-wrap gap-2 mb-5 items-center">
          <select name="category" defaultValue={category}
            className="bg-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select name="status" defaultValue={status}
            className="bg-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <input name="search" defaultValue={search} placeholder="Search posts…"
            className="bg-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none w-56" />
          <button className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white"
            style={{ background: "#3AAFE5" }}>
            Apply
          </button>
          {(category || status || search) && (
            <Link href="/admin/posts" className="text-sm text-gray-400 hover:underline">Clear</Link>
          )}
        </form>

        {/* Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                {["Title","Category","Status","Date","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No posts match these filters.</td></tr>
              ) : posts.map((p, i) => {
                const cat = CATEGORIES.find(c => c.slug === p.category_slug);
                return (
                  <tr key={p.id} className={`border-t border-gray-800 hover:bg-gray-800/50 ${i % 2 ? "bg-gray-900/50" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium line-clamp-1 max-w-xs">{p.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 font-mono">/{p.category_slug}/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      {cat && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.icon} {cat.name}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        p.status === "published" ? "bg-green-900/60 text-green-400" : "bg-yellow-900/60 text-yellow-400"
                      }`}>{p.status || "published"}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{p.created_at ? fmt(p.created_at) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a href={`/${p.category_slug}/${p.slug}`} target="_blank"
                          className="text-xs hover:underline" style={{ color: "#3AAFE5" }}>View</a>
                        <Link href={`/admin/posts/${p.id}/edit`} className="text-xs text-yellow-400 hover:underline">Edit</Link>
                        <button className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/posts"
          extraParams={{ ...(category && { category }), ...(status && { status }), ...(search && { search }) }}
        />
      </div>
    </div>
  );
}
