"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminTopBar } from "@/components/admin/AdminSidebar";
import { CreateBookingModal } from "@/components/admin/CreateBookingModal";
import {
  CalendarCheck, Search, Filter, CheckCircle,
  XCircle, Clock, Mail, Phone, Users, RefreshCw, ChevronDown, Car, Plane, Plus
} from "lucide-react";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  date: string;
  time: string;
  direction: string;
  flight_number: string;
  passengers: number;
  vehicle: string;
  price: number;
  special_requests: string;
  created_at: string;
};

const statusStyles: Record<string, { badge: string; icon: any }> = {
  pending: { badge: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  confirmed: { badge: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  cancelled: { badge: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    setBookings(list);
    setFiltered(list);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  useEffect(() => {
    let list = bookings;
    if (statusFilter !== "all") list = list.filter(b => b.status === statusFilter);
    if (search) list = list.filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [search, statusFilter, bookings]);

  const updateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: newStatus }),
      });
      if (res.ok) {
        setToast(`Booking ${newStatus} successfully!`);
        setSelected(null);
        fetchBookings();
        setTimeout(() => setToast(""), 3000);
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminTopBar title="Booking Management" />

      {toast && (
        <div className="fixed top-24 right-8 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-right">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Table & Filters */}
        <div className="flex-1 space-y-6">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] transition text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] appearance-none text-sm font-medium text-slate-700 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button
                onClick={fetchBookings}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0F4C81]" : ""}`} />
              </button>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#1a6bb5] transition-colors whitespace-nowrap h-10"
              >
                <Plus className="w-4 h-4" /> New Booking
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium">Loading bookings...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                <p className="font-medium">No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Client Info</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((b) => {
                      const style = statusStyles[b.status] || statusStyles.pending;
                      const Icon = style.icon;
                      return (
                        <tr 
                          key={b.id} 
                          className={`group transition cursor-pointer hover:bg-blue-50/50 ${selected?.id === b.id ? "bg-blue-50" : ""}`}
                          onClick={() => setSelected(b)}
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 group-hover:text-[#0F4C81] transition-colors">{b.name}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{b.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="capitalize font-medium text-slate-700">{b.type}</span>
                            <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[120px]">{b.direction}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
                              <Icon className="w-3 h-3" />
                              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">
                            {b.date || "—"} <span className="text-slate-400 text-xs block">{b.time}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-[#0F4C81] text-xs font-bold hover:underline">
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details Panel */}
        <div className="w-full md:w-96 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-24 overflow-hidden">
            {selected ? (
              <div>
                <div className="bg-slate-50 border-b border-slate-100 p-6 text-center relative">
                  <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md mb-3">
                    {selected.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{selected.name}</h3>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <a href={`mailto:${selected.email}`} className="text-slate-500 hover:text-[#0F4C81] transition flex items-center gap-1.5 text-xs font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <Mail className="w-3 h-3" /> Email
                    </a>
                    <a href={`tel:${selected.phone}`} className="text-slate-500 hover:text-green-600 transition flex items-center gap-1.5 text-xs font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Booking Details</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-2"><Car className="w-4 h-4" /> Service</span>
                        <span className="font-semibold text-slate-800 capitalize">{selected.type}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Schedule</span>
                        <span className="font-semibold text-slate-800">{selected.date} {selected.time}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-2"><Users className="w-4 h-4" /> Passengers</span>
                        <span className="font-semibold text-slate-800">{selected.passengers} Pax</span>
                      </div>
                      {selected.flight_number && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 flex items-center gap-2"><Plane className="w-4 h-4" /> Flight</span>
                          <span className="font-semibold text-slate-800">{selected.flight_number}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100">
                    <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <span className="text-sm font-bold text-[#0F4C81]">Total Price</span>
                      <span className="text-xl font-bold text-[#0F4C81]">€{selected.price || 35}</span>
                    </div>
                  </div>

                  {selected.special_requests && (
                    <div className="pt-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Special Requests</p>
                      <p className="text-sm text-slate-600 bg-amber-50 border border-amber-100 p-3 rounded-lg leading-relaxed">
                        {selected.special_requests}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  {selected.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(selected.id, "confirmed")}
                        disabled={actionLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50"
                      >
                        {actionLoading ? "Processing..." : "Confirm & Send Email"}
                      </button>
                      <button
                        onClick={() => updateStatus(selected.id, "cancelled")}
                        disabled={actionLoading}
                        className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition disabled:opacity-50"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                  {selected.status !== "pending" && (
                    <div className="text-center">
                      <p className="text-sm text-slate-500 mb-3">
                        This booking is currently <strong className="capitalize">{selected.status}</strong>.
                      </p>
                      <button
                        onClick={() => updateStatus(selected.id, "pending")}
                        disabled={actionLoading}
                        className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold py-2.5 rounded-xl transition disabled:opacity-50"
                      >
                        Revert to Pending
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 p-8 text-center bg-slate-50/50">
                <CalendarCheck className="w-16 h-16 mb-4 text-slate-200" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Booking Selected</h3>
                <p className="text-sm">Click on any row in the table to view the full details and take action.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateBookingModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
          fetchBookings();
          setToast("Booking created successfully!");
          setTimeout(() => setToast(""), 3000);
        }} 
      />
    </div>
  );
}
