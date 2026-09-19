"use client";

import { useState } from "react";
import { Search, CheckCircle, Clock, XCircle, Plane, MapPin, Users, Car, CalendarDays, Hash, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type BookingData = {
  id: string;
  reference: string;
  status: "pending" | "confirmed" | "cancelled";
  type: "transfer" | "tour";
  name: string;
  email: string;
  date?: string;
  time?: string;
  direction?: string;
  tour_name?: string;
  flight_number?: string;
  passengers?: number;
  vehicle?: string;
  price?: number;
  special_requests?: string;
  created_at?: string;
};

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    desc: "Your booking request has been received and is awaiting confirmation from our team.",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  confirmed: {
    icon: CheckCircle,
    label: "Confirmed ✓",
    desc: "Great news! Your booking is confirmed. We look forward to welcoming you!",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    desc: "This booking has been cancelled. Please contact us if you believe this is an error.",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

export default function BookingStatusPage() {
  const [ref, setRef] = useState("");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("BookingStatus");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const res = await fetch(`/api/bookings/lookup?ref=${ref.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setBooking(data);
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const status = booking ? statusConfig[booking.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#0F4C81]/20 py-24 px-4">
      {/* Back link */}
      <div className="max-w-lg mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          {t('backToHotel')}
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-lg mx-auto text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#0F4C81]/30 border border-[#0F4C81]/40 flex items-center justify-center mx-auto mb-5">
          <Search className="w-7 h-7 text-[#5b9fd4]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-3">
          {t('title')}
        </h1>
        <p className="text-slate-400 font-sans">
          {t('subtitle')}
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {t('reference')}
          </label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4">
              <Hash className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder={t('referencePlaceholder')}
                className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-slate-600 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !ref.trim()}
              className="px-5 py-3.5 bg-[#0F4C81] hover:bg-[#1a6bb5] text-white font-bold rounded-xl transition disabled:opacity-40 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {t('searching')}
                </span>
              ) : t('search')}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-3 font-sans">
            {t('referenceHint')}
          </p>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 font-sans">{error}</p>
          </div>
        )}

        {/* Booking Result */}
        {booking && status && StatusIcon && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status header */}
            <div className={`${status.bg} border-b ${status.border} px-6 py-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl ${status.bg} border ${status.border} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`w-6 h-6 ${status.text}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('statusTitle')}</p>
                <p className={`text-lg font-bold ${status.text}`}>{t(`${booking.status}Label`)}</p>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{t(`${booking.status}Desc`)}</p>
              </div>
            </div>

            {/* Booking details */}
            <div className="p-6 space-y-0">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t('details')}</h3>

              <div className="space-y-0 divide-y divide-slate-800">
                <DetailRow icon={Hash} label={t('refLabel')} value={
                  <span className="font-mono text-xs text-[#E0A96D]">{booking.reference}</span>
                } />
                <DetailRow icon={booking.type === "transfer" ? Plane : MapPin} label={t('typeLabel')} value={
                  <span className="capitalize">{booking.type === "transfer" ? t('typeTransfer') : t('typeTour')}</span>
                } />
                {booking.type === "transfer" && booking.direction && (
                  <DetailRow icon={Plane} label={t('directionLabel')} value={
                    booking.direction === "airport_to_hotel" ? t('airportToHotel') : t('hotelToAirport')
                  } />
                )}
                {booking.type === "tour" && (
                  <DetailRow icon={MapPin} label={t('tourLabel')} value={booking.tour_name || booking.direction || "—"} />
                )}
                {booking.flight_number && (
                  <DetailRow icon={Plane} label={t('flightLabel')} value={booking.flight_number} />
                )}
                {booking.date && (
                  <DetailRow icon={CalendarDays} label={t('dateLabel')} value={booking.date} />
                )}
                {booking.time && (
                  <DetailRow icon={Clock} label={t('timeLabel')} value={booking.time} />
                )}
                <DetailRow icon={Users} label={t('passengersLabel')} value={`${booking.passengers || 1}`} />
                <DetailRow icon={Car} label={t('vehicleLabel')} value={booking.vehicle || "Ford Ranger XLT"} />
                {booking.price && (
                  <DetailRow icon={Hash} label={t('totalLabel')} value={
                    <span className="text-[#E0A96D] font-bold text-base">€{booking.price}</span>
                  } />
                )}
              </div>

              {booking.special_requests && (
                <div className="mt-4 bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('specialRequestsLabel')}</p>
                  <p className="text-sm text-slate-300 font-sans">{booking.special_requests}</p>
                </div>
              )}

              {/* Contact CTA */}
              <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                <p className="text-sm text-slate-500 font-sans mb-3">{t('questions')}</p>
                <a
                  href="https://wa.me/21620125082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 text-sm font-semibold rounded-full transition"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('whatsapp')}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex items-center justify-between flex-1 min-w-0">
        <span className="text-sm text-slate-500 font-sans">{label}</span>
        <span className="text-sm text-slate-200 font-sans font-medium text-right">{value}</span>
      </div>
    </div>
  );
}
