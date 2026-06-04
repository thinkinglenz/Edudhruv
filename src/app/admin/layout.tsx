"use client";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
