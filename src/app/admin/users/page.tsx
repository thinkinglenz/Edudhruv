import AdminHeader from "@/components/admin/AdminHeader";

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY === "placeholder";

async function getUsers() {
  if (IS_MOCK) return [];
  const { getServiceClient } = await import("@/lib/supabase");
  // Users are students who submitted leads (registered via lead form)
  const { data } = await getServiceClient()
    .from("leads")
    .select("id,name,email,phone,status,created_at,destination,loan_amount")
    .order("created_at", { ascending: false });
  return data || [];
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

export default async function UsersPage() {
  const users = await getUsers() as any[];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Registered Users"
        subtitle="Students who submitted the lead form"
        action={
          <span className="text-sm bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg">
            {users.length} total
          </span>
        }
      />

      <div className="flex-1 p-6">
        {users.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-4xl mb-3">👤</p>
            <p className="text-gray-400">{IS_MOCK ? "Connect Supabase to see users." : "No registrations yet."}</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  {["Name","Email","Phone","Registered","Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                    <td className="px-4 py-3 text-gray-300">{u.phone}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{fmt(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-400 font-semibold capitalize">
                        {u.status}
                      </span>
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
