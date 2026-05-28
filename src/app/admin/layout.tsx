import type { Metadata } from "next";

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
      {children}
    </div>
  );
}
