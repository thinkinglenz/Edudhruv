import AdminHeader from "@/components/admin/AdminHeader";
import { MOCK_POSTS } from "@/lib/mock-data";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

async function getLeads() {
  if (IS_MOCK) return [];
  const { getServiceClient } = await import("@/lib/supabase");
  const { data } = await getServiceClient()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

const STATUS_COLORS: Record<string, string> = {
  new:       "bg-blue-900/60 text-blue-400",
  contacted: "bg-yellow-900/60 text-yellow-400",
  converted: "bg-green-900/60 text-green-400",
  closed:    "bg-gray-700 text-gray-400",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

export default async function LeadsPage() {
  const leads = await getLeads() as any[];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Student Leads"
        subtitle={`${leads.length} total leads`}
        action={
          <a
            href={`data:text/csv;charset=utf-8,Name,Email,Phone,Source,Status,Date\n${leads.map((l:any)=>`"${l.name}","${l.email}","${l.phone}","${l.source_post_slug||'direct'}","${l.status}","${l.created_at}"`).join('\n')}`}
            download="edudhruv-leads.csv"
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            ↓ Export CSV
          </a>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {["new","contacted","converted","closed"].map(s => (
            <div key={s} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className={`text-2xl font-extrabold ${STATUS_COLORS[s].split(" ")[1]}`}>
                {leads.filter((l:any) => l.status === s).length}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">{s}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {leads.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-400">No leads yet.</p>
            <p className="text-gray-600 text-sm mt-1">
              {IS_MOCK ? "Connect Supabase to see real leads." : "Share the site to start collecting leads!"}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  {["Name","Email","Phone","Source","Status","Date","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l: any) => (
                  <tr key={l.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-white font-medium">{l.name}</td>
                    <td className="px-4 py-3 text-gray-300">{l.email}</td>
                    <td className="px-4 py-3 text-gray-300">{l.phone}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">{l.source_post_slug || "direct"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[l.status] || STATUS_COLORS.new}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(l.created_at)}</td>
                    <td className="px-4 py-3">
                      <select
                        className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 focus:outline-none"
                        defaultValue={l.status}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
