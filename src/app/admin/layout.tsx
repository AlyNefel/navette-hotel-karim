import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard – Hotel Karim",
  description: "Hotel Karim admin dashboard — manage bookings, transfers, and tours.",
  robots: "noindex, nofollow",
  manifest: "/manifest.json",
  themeColor: "#0F4C81",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Karim Admin",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F4C81" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Karim Admin" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        ` }} />
      </head>
      <body className="bg-slate-50 text-slate-900 overflow-hidden dark:bg-slate-950 dark:text-white">
        <div className="flex h-screen bg-slate-50 overflow-hidden dark:bg-slate-950">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto pt-16 md:pt-0 h-[100dvh]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
