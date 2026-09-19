"use client";

import { useState, useEffect } from "react";
import { AdminTopBar } from "@/components/admin/AdminSidebar";
import {
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

type Booking = {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  date: string;
  direction: string;
  passengers: number;
  price: number;
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default function AdminOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const total = bookings.length;
  const revenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((acc, b) => acc + (b.price || 35), 0);

  const stats = [
    { label: "Total Bookings", value: total, icon: CalendarCheck, color: "from-[#0F4C81] to-blue-600", change: "+12%" },
    { label: "Pending Review", value: pending, icon: Clock, color: "from-amber-500 to-orange-400", change: "Needs action" },
    { label: "Confirmed", value: confirmed, icon: CheckCircle, color: "from-emerald-500 to-green-400", change: "This month" },
    { label: "Est. Revenue", value: `€${revenue}`, icon: TrendingUp, color: "from-[#E0A96D] to-amber-500", change: "Confirmed only" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <AdminTopBar title="Dashboard Overview" />
      
      <div className="p-4 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Here is what's happening with your hotel today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{loading ? "…" : s.value}</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">{s.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shadow-slate-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area: Recent Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-slate-800 font-bold text-lg">Recent Bookings</h3>
                <Link href="/admin/bookings" className="text-sm font-semibold text-[#0F4C81] hover:text-blue-700 hover:underline flex items-center gap-1 transition">
                  View all <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-slate-400 font-medium">Loading data...</div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                  <p className="font-medium">No bookings yet.</p>
                  <p className="text-sm">They will appear here once clients submit the form.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-lg">Client</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 rounded-tr-lg">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-slate-800 font-bold">{b.name}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{b.email}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{b.date || "—"}</td>
                          <td className="px-6 py-4 text-slate-600 capitalize">{b.type}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-6 py-4 text-[#0F4C81] font-bold">€{b.price || 35}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-slate-800 font-bold text-lg mb-4">Quick Actions</h3>
            
            <Link href="/admin/bookings" className="block bg-white border border-slate-200 hover:border-[#0F4C81]/30 hover:shadow-md rounded-2xl p-5 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold group-hover:text-[#0F4C81] transition-colors">Manage Bookings</p>
                  <p className="text-slate-500 text-sm mt-1">Review, confirm, or cancel client reservations.</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/chat" className="block bg-white border border-slate-200 hover:border-green-500/30 hover:shadow-md rounded-2xl p-5 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold group-hover:text-green-600 transition-colors">Live Chat</p>
                  <p className="text-slate-500 text-sm mt-1">Chat with website visitors in real-time.</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/gifts" className="block bg-white border border-slate-200 hover:border-amber-500/30 hover:shadow-md rounded-2xl p-5 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold group-hover:text-amber-600 transition-colors">Roulette Gifts</p>
                  <p className="text-slate-500 text-sm mt-1">View the latest winners from the Lucky Spin wheel.</p>
                </div>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}
