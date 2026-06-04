import AdminHeader from "@/components/admin/AdminHeader";
import PostEditor from "@/components/admin/PostEditor";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="New Post"
        subtitle="Create a new blog post, sponsored article, or college listing"
        action={
          <Link href="/admin/posts"
            className="text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg px-4 py-2">
            ← Back to Posts
          </Link>
        }
      />
      <div className="flex-1 p-6 overflow-auto">
        <PostEditor />
      </div>
    </div>
  );
}
