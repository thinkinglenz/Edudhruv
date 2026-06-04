import AdminHeader from "@/components/admin/AdminHeader";
import Pagination from "@/components/admin/Pagination";
import Link from "next/link";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

const PAGE_SIZE = 20;

// Mock data — used when Supabase is not connected
const MOCK_COMMENTS = [
  { id: "1", author_name: "Rahul Sharma",  author_email: "rahul@example.com",  post_slug: "mpower-financing-student-loan-review-2025-6", content: "Very helpful article! I applied for MPOWER loan and got approved within 2 weeks.", status: "approved", created_at: "2026-05-20T10:00:00Z" },
  { id: "2", author_name: "Priya Nair",     author_email: "priya@example.com",  post_slug: "chevening-scholarship-2025-indian-students",  content: "Could you please update the application deadline? I think it has changed.",            status: "pending",  created_at: "2026-05-22T14:30:00Z" },
  { id: "3", author_name: "Amit Patel",     author_email: "amit@example.com",   post_slug: "life-in-canada-indian-students-honest-guide", content: "Great article but I'd add that winters are way colder than expected! 😂",                status: "approved", created_at: "2026-05-23T09:15:00Z" },
  { id: "4", author_name: "spammer123",     author_email: "spam@spam.com",      post_slug: "top-universities-canada-indian-students-2025",content: "Buy cheap followers!! Click here >>>",                                                  status: "spam",     created_at: "2026-05-24T22:00:00Z" },
  { id: "5", author_name: "Sneha Reddy",    author_email: "sneha@example.com",  post_slug: "sbi-education-loan-abroad-2025",              content: "Which NBFC do you recommend for loans above 40L without property collateral?",         status: "pending",  created_at: "2026-05-25T16:45:00Z" },
  { id: "6", author_name: "Anjali Verma",   author_email: "anjali@example.com", post_slug: "best-universities-canada-indian-students",    content: "Thank you for sharing this. Got admission to UofT thanks to your guide!",                status: "approved", created_at: "2026-05-26T11:20:00Z" },
  { id: "7", author_name: "Vikram Iyer",    author_email: "vikram@example.com", post_slug: "australia-student-visa-subclass-500",         content: "Visa was approved in 6 weeks following your checklist. Lifesaver! 🙏",                  status: "approved", created_at: "2026-05-27T08:00:00Z" },
  { id: "8", author_name: "buyrolex2025",   author_email: "fake@spam.net",      post_slug: "education-loan-without-collateral",           content: "ROLEX WATCHES 90% OFF!!! CLICK NOW LIMITED TIME!!!",                                   status: "spam",     created_at: "2026-05-27T19:30:00Z" },
];

async function getComments(status: string, page: number) {
  if (IS_MOCK) {
    const filtered = status === "all" ? MOCK_COMMENTS : MOCK_COMMENTS.filter(c => c.status === status);
    const start = (page - 1) * PAGE_SIZE;
    return { comments: filtered.slice(start, start + PAGE_SIZE), total: filtered.length };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  let query = db.from("comments")
    .select("id,author_name,author_email,post_slug,content,status,created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  const start = (page - 1) * PAGE_SIZE;
  const { data, count } = await query.range(start, start + PAGE_SIZE - 1);
  return { comments: data || [], total: count || 0 };
}

async function getStatusCounts() {
  if (IS_MOCK) {
    return {
      all:      MOCK_COMMENTS.length,
      pending:  MOCK_COMMENTS.filter(c => c.status === "pending").length,
      approved: MOCK_COMMENTS.filter(c => c.status === "approved").length,
      spam:     MOCK_COMMENTS.filter(c => c.status === "spam").length,
    };
  }
  const { getServiceClient } = await import("@/lib/supabase");
  const db = getServiceClient();
  const [
    { count: all }, { count: pending }, { count: approved }, { count: spam }
  ] = await Promise.all([
    db.from("comments").select("*", { count: "exact", head: true }),
    db.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db.from("comments").select("*", { count: "exact", head: true }).eq("status", "approved"),
    db.from("comments").select("*", { count: "exact", head: true }).eq("status", "spam"),
  ]);
  return { all: all || 0, pending: pending || 0, approved: approved || 0, spam: spam || 0 };
}

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-900/50 text-green-400",
  pending:  "bg-yellow-900/50 text-yellow-400",
  spam:     "bg-red-900/50 text-red-400",
  trash:    "bg-gray-700 text-gray-400",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

export default async function CommentsPage({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  const status = searchParams.status || "all";
  const page   = parseInt(searchParams.page || "1");

  const counts = await getStatusCounts();
  const { comments, total } = await getComments(status, page);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Comments Moderation"
        subtitle={`${counts.pending} pending · ${counts.approved} approved · ${counts.spam} spam`}
        action={
          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
            IS_MOCK ? "text-yellow-400 bg-yellow-900/40" : "text-green-400 bg-green-900/40"
          }`}>
            {IS_MOCK ? "⚠ Mock mode" : "✅ Live from Supabase"}
          </span>
        }
      />

      <div className="flex-1 p-6 space-y-5 overflow-auto">
        {/* Status filter tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {[
            { key: "all",      label: `All (${counts.all})` },
            { key: "pending",  label: `Pending (${counts.pending})` },
            { key: "approved", label: `Approved (${counts.approved})` },
            { key: "spam",     label: `Spam (${counts.spam})` },
          ].map(t => (
            <Link key={t.key} href={t.key === "all" ? "/admin/comments" : `/admin/comments?status=${t.key}`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                status === t.key ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              style={status === t.key ? { background: "#3AAFE5" } : {}}>
              {t.label}
            </Link>
          ))}
        </div>

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-400">No {status === "all" ? "" : status} comments.</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded" /></th>
                  {["Author","Comment","Post","Status","Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(comments as any[]).map(c => (
                  <tr key={c.id} className={`border-t border-gray-800 hover:bg-gray-800/40 group ${c.status === "pending" ? "bg-yellow-950/10" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm">{c.author_name}</p>
                      <p className="text-gray-500 text-xs">{c.author_email}</p>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <p className="text-gray-300 text-sm line-clamp-2">{c.content}</p>
                      <div className="flex gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.status !== "approved" && <button className="text-xs text-green-400 hover:underline">Approve</button>}
                        <button className="text-xs text-yellow-400 hover:underline">Reply</button>
                        <button className="text-xs text-blue-400 hover:underline">Edit</button>
                        {c.status !== "spam" && <button className="text-xs text-orange-400 hover:underline">Spam</button>}
                        <button className="text-xs text-red-400 hover:underline">Trash</button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px]">
                      <p className="line-clamp-2 font-mono">{c.post_slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_STYLES[c.status] || STATUS_STYLES.trash}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          basePath="/admin/comments"
          extraParams={{ status }}
        />
      </div>
    </div>
  );
}
