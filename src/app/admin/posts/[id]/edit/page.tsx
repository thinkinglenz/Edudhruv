import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import PostEditor from "@/components/admin/PostEditor";
import Link from "next/link";
import { MOCK_POSTS } from "@/lib/mock-data";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

async function getPost(id: string) {
  if (IS_MOCK) return MOCK_POSTS.find(p => p.id === id);
  const { getServiceClient } = await import("@/lib/supabase");
  const { data } = await getServiceClient()
    .from("posts").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={`Edit: ${(post as any).title?.slice(0, 60) || "Post"}…`}
        subtitle={`/${(post as any).category_slug}/${(post as any).slug}`}
        action={
          <div className="flex gap-2">
            <a href={`/${(post as any).category_slug}/${(post as any).slug}`} target="_blank"
              className="text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg px-4 py-2">
              View →
            </a>
            <Link href="/admin/posts"
              className="text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg px-4 py-2">
              ← Back
            </Link>
          </div>
        }
      />
      <div className="flex-1 p-6 overflow-auto">
        <PostEditor existing={post as any} isEditing />
      </div>
    </div>
  );
}
