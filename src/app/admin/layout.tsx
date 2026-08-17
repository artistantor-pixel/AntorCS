import type { Metadata } from "next";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export const metadata: Metadata = {
  title: "AntorOS | Admin Dashboard",
  description: "Antor Creative Studio Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminAuthGuard>
        {children}
      </AdminAuthGuard>
    </div>
  );
}
