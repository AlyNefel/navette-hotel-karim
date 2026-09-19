import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard – Hotel Karim",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 overflow-hidden dark:bg-slate-950 dark:text-white">
        <div className="flex h-screen bg-slate-50 overflow-hidden dark:bg-slate-950">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
