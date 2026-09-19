"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plane,
  Map,
  Clock,
  Users,
  Phone,
  Mail,
  X,
  CalendarCheck,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminSidebar";

type Booking = {
  _id: string;
  type: "transfer" | "tour";
  status: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  flight_number: string;
  direction: string;
  passengers: number;
  vehicle: string;
  price: number;
  tour_name: string;
  special_requests: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function BookingDot({ type }: { type: "transfer" | "tour" }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${
        type === "transfer" ? "bg-violet-500" : "bg-teal-500"
      }`}
    />
  );
}

export default function AdminCalendarClient({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  // Group bookings by date string "YYYY-MM-DD"
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      if (!b.date) continue;
      const key = b.date.slice(0, 10); // ensure "YYYY-MM-DD"
      if (!map[key]) map[key] = [];
      map[key].push(b);
    }
    return map;
  }, [bookings]);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const selectedKey = selectedDay;
  const selectedBookings = selectedKey ? (bookingsByDate[selectedKey] ?? []) : [];

  // Stats
  const totalConfirmed = bookings.length;
  const transfers = bookings.filter(b => b.type === "transfer").length;
  const tours = bookings.filter(b => b.type === "tour").length;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-900">
      <AdminTopBar title="Calendar" />

      {/* Detail Modal */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className={`px-6 py-4 flex items-center justify-between ${detailBooking.type === "transfer" ? "bg-violet-600" : "bg-teal-600"} text-white`}>
              <div className="flex items-center gap-3">
                {detailBooking.type === "transfer" ? <Plane className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                <div>
                  <p className="font-bold text-lg leading-tight">{detailBooking.name}</p>
                  <p className="text-white/80 text-sm capitalize">
                    {detailBooking.type === "transfer" ? "Airport Transfer" : `Excursion — ${detailBooking.tour_name || "Tour"}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setDetailBooking(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={<CalendarCheck className="w-4 h-4" />} label="Date" value={detailBooking.date} />
                <InfoRow icon={<Clock className="w-4 h-4" />} label="Time" value={detailBooking.time || "—"} />
                <InfoRow icon={<Users className="w-4 h-4" />} label="Passengers" value={String(detailBooking.passengers)} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={detailBooking.phone} />
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={detailBooking.email} />
                {detailBooking.type === "transfer" && (
                  <>
                    <InfoRow icon={<Plane className="w-4 h-4" />} label="Flight" value={detailBooking.flight_number || "—"} />
                    <div className="col-span-2">
                      <InfoRow icon={<Map className="w-4 h-4" />} label="Direction" value={
                        detailBooking.direction === "airport_to_hotel" ? "✈️ Airport → Hotel" :
                        detailBooking.direction === "hotel_to_airport" ? "🏨 Hotel → Airport" :
                        detailBooking.direction || "—"
                      } />
                    </div>
                  </>
                )}
                {detailBooking.price > 0 && (
                  <InfoRow icon={<span className="text-sm font-bold">€</span>} label="Price" value={`€${detailBooking.price}`} />
                )}
              </div>
              {detailBooking.special_requests && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Special Requests</p>
                  <p className="text-sm text-amber-900 dark:text-amber-300">{detailBooking.special_requests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalConfirmed}</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Confirmed Total</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-5 border border-violet-200 dark:border-violet-700 shadow-sm text-center">
            <p className="text-3xl font-bold text-violet-700 dark:text-violet-400">{transfers}</p>
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider mt-1">Transfers</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-700 shadow-sm text-center">
            <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">{tours}</p>
            <p className="text-xs font-semibold text-teal-500 uppercase tracking-wider mt-1">Excursions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
              {DAYS.map(d => (
                <div key={d} className="text-center py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[88px] border-b border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const key = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
                const dayBookings = bookingsByDate[key] ?? [];
                const isToday = year === today.getFullYear() && month === today.getMonth() && dayNum === today.getDate();
                const isSelected = key === selectedDay;
                const hasTrans = dayBookings.some(b => b.type === "transfer");
                const hasTour = dayBookings.some(b => b.type === "tour");

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDay(isSelected ? null : key)}
                    className={`min-h-[88px] border-b border-r border-slate-100 dark:border-slate-700/50 p-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      isToday
                        ? "bg-[#0F4C81] text-white"
                        : isSelected
                        ? "bg-[#0F4C81]/20 text-[#0F4C81] dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {dayNum}
                    </div>
                    <div className="space-y-0.5">
                      {dayBookings.slice(0, 3).map(b => (
                        <div
                          key={b._id}
                          onClick={e => { e.stopPropagation(); setDetailBooking(b); }}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold truncate cursor-pointer transition-opacity hover:opacity-80 ${
                            b.type === "transfer"
                              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                              : "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300"
                          }`}
                        >
                          <BookingDot type={b.type} />
                          <span className="truncate hidden md:inline">{b.name}</span>
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <p className="text-[10px] text-slate-400 px-1">+{dayBookings.length - 3} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 px-6 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-3 h-3 rounded-full bg-violet-500" /> Airport Transfer
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-3 h-3 rounded-full bg-teal-500" /> Excursion
              </div>
            </div>
          </div>

          {/* Selected Day Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white">
                {selectedDay
                  ? new Date(selectedDay + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Select a day"}
              </h3>
              {selectedDay && (
                <p className="text-xs text-slate-400 mt-0.5">{selectedBookings.length} confirmed booking{selectedBookings.length !== 1 ? "s" : ""}</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
              {!selectedDay ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                  <CalendarCheck className="w-10 h-10 text-slate-200 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-400">Click a day on the calendar to view bookings</p>
                </div>
              ) : selectedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                  <CalendarCheck className="w-10 h-10 text-slate-200 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No confirmed bookings on this day</p>
                </div>
              ) : (
                selectedBookings.map(b => (
                  <button
                    key={b._id}
                    onClick={() => setDetailBooking(b)}
                    className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        b.type === "transfer" ? "bg-violet-100 dark:bg-violet-900/40" : "bg-teal-100 dark:bg-teal-900/40"
                      }`}>
                        {b.type === "transfer"
                          ? <Plane className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                          : <Map className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{b.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {b.type === "transfer"
                            ? (b.direction === "airport_to_hotel" ? "✈️ → 🏨" : "🏨 → ✈️") + (b.flight_number ? ` · ${b.flight_number}` : "")
                            : b.tour_name || "Excursion"}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {b.time && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Clock className="w-3 h-3" /> {b.time}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Users className="w-3 h-3" /> {b.passengers} pax
                          </span>
                          {b.price > 0 && (
                            <span className="text-[11px] font-bold text-[#0F4C81] dark:text-blue-400">€{b.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming list */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Upcoming Confirmed Bookings</h3>
            <p className="text-slate-400 text-sm mt-0.5">Sorted by date — all confirmed bookings</p>
          </div>
          {bookings.length === 0 ? (
            <div className="p-16 text-center">
              <CalendarCheck className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">No confirmed bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Guest</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Time</th>
                    <th className="px-6 py-3 text-left">Details</th>
                    <th className="px-6 py-3 text-left">Pax</th>
                    <th className="px-6 py-3 text-left">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {bookings.map(b => (
                    <tr
                      key={b._id}
                      onClick={() => setDetailBooking(b)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.type === "transfer"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                            : "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                        }`}>
                          {b.type === "transfer" ? <Plane className="w-3 h-3" /> : <Map className="w-3 h-3" />}
                          {b.type === "transfer" ? "Transfer" : "Excursion"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-white">{b.name}</p>
                        <p className="text-slate-400 text-xs">{b.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{b.date}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{b.time || "—"}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {b.type === "transfer"
                          ? (b.direction === "airport_to_hotel" ? "Airport → Hotel" : "Hotel → Airport") + (b.flight_number ? ` (${b.flight_number})` : "")
                          : b.tour_name || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{b.passengers}</td>
                      <td className="px-6 py-4 font-bold text-[#0F4C81] dark:text-blue-400">{b.price ? `€${b.price}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <span className="text-slate-400">{icon}</span> {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}
