"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

type TourBookingFormProps = {
  tourName: string;
  basePrice: number;
};

export function TourBookingForm({ tourName, basePrice }: TourBookingFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: "",
    passengers: 2,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tour",
          direction: tourName, // Use direction to store tourName since bookings table doesn't map tourName yet
          date: formData.date,
          passengers: formData.passengers,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
          price: basePrice > 0 ? basePrice * formData.passengers : 0, // Calculate total price
        }),
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Request Sent!</h3>
        <p className="text-sm text-slate-500 mt-2">
          We have received your booking request for <strong>{tourName}</strong>. Our team will review it and send a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">Request a Booking</p>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
          <input 
            type="date" 
            required
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" 
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Guests</label>
          <input 
            type="number" 
            min="1" 
            required
            value={formData.passengers}
            onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" 
          />
        </div>
      </div>

      <div className="space-y-3 pt-3">
        <input 
          type="text" 
          placeholder="Full Name" 
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          required
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" 
        />
        <input 
          type="tel" 
          placeholder="Phone Number (WhatsApp preferred)" 
          required
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" 
        />
        <textarea
          placeholder="Special Requests (Optional)"
          rows={2}
          value={formData.specialRequests}
          onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
        ></textarea>
      </div>

      {basePrice > 0 && (
        <div className="flex justify-between items-center py-2 text-sm">
          <span className="text-slate-500 font-semibold">Estimated Total:</span>
          <span className="text-terracotta-warmth font-bold">€{basePrice * formData.passengers}</span>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full mt-2 py-3.5 bg-terracotta-warmth text-white font-bold rounded-xl shadow-lg hover:bg-terracotta-warmth/90 transition-all disabled:opacity-50"
      >
        {loading ? "Sending Request..." : "Request Booking"}
      </button>
    </form>
  );
}
