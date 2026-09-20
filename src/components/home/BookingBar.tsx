"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, ArrowRight, Car, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const bookingTypes = [
  { id: "transfers", label: "Airport Transfer", icon: Car },
  { id: "tours", label: "Excursions", icon: MapPin },
];

export function BookingBar() {
  const [selectedType, setSelectedType] = useState("transfers");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [destination, setDestination] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const locale = "en";
    if (selectedType === "transfers") {
      const params = new URLSearchParams({ date, passengers: String(passengers) });
      if (returnDate) params.set('returnDate', returnDate);
      router.push(`/${locale}/transfers?${params.toString()}`);
    } else {
      const params = new URLSearchParams({ date, guests: String(passengers) });
      if (destination) {
        // Navigate directly to the specific tour page with prefilled date/guests
        router.push(`/${locale}/tours/${destination}?${params.toString()}`);
      } else {
        router.push(`/${locale}/tours?${params.toString()}`);
      }
    }
  };

  return (
    <div className="relative z-30 -mt-24 mx-4 sm:mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden"
      >
        {/* Booking Type Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {bookingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-300 ${
                  selectedType === type.id
                    ? "text-mediterranean-blue border-b-2 border-mediterranean-blue bg-mediterranean-blue/5"
                    : "text-slate-500 hover:text-mediterranean-blue"
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Form Fields */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

            {/* Date */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <CalendarDays className="w-3.5 h-3.5 text-terracotta-warmth" />
                {selectedType === "transfers" ? "Pickup Date" : "Tour Date"}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-mediterranean-blue/50 transition-all bg-white/70 dark:bg-slate-800/70 font-sans"
              />
            </div>

            {/* Return Date (Transfers only) */}
            {selectedType === "transfers" && (
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-terracotta-warmth" />
                  Return Date (Optional)
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={date || new Date().toISOString().split("T")[0]}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-mediterranean-blue/50 transition-all bg-white/70 dark:bg-slate-800/70 font-sans"
                />
              </div>
            )}

            {/* Tour Type selector (Tours only) */}
            {selectedType === "tours" && (
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-warmth" />
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-mediterranean-blue/50 transition-all bg-white/70 dark:bg-slate-800/70 font-sans appearance-none"
                >
                  <option value="">Any destination</option>
                  <option value="sidi-bou-said-carthage">Sidi Bou Said &amp; Carthage</option>
                  <option value="dougga-zaghouan">Dougga &amp; Zaghouan</option>
                  <option value="sahara-desert">Tozeur &amp; Sahara Desert</option>
                  <option value="custom-itinerary">Custom Itinerary</option>
                </select>
              </div>
            )}

            {/* Passengers */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-terracotta-warmth" />
                {selectedType === "transfers" ? "Passengers" : "Persons"}
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white/70 dark:bg-slate-800/70">
                <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="px-4 py-3 text-mediterranean-blue font-bold text-lg hover:bg-mediterranean-blue/10 transition-colors">-</button>
                <span className="flex-1 text-center text-sm font-semibold text-slate-800 dark:text-white">{passengers}</span>
                <button onClick={() => setPassengers(Math.min(4, passengers + 1))} className="px-4 py-3 text-mediterranean-blue font-bold text-lg hover:bg-mediterranean-blue/10 transition-colors">+</button>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-mediterranean-blue text-white rounded-xl px-6 py-3.5 font-semibold text-sm hover:bg-mediterranean-blue/90 transition-all shadow-lg shadow-mediterranean-blue/30 w-full"
            >
              {selectedType === "transfers" ? "Book Transfer" : "Find Tours"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
