"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Check, ArrowRight, ShieldCheck, Users, Hotel } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import type { Tour } from '@/lib/tours-data';

export function TourBookingClient({ tour }: { tour: Tour }) {
  const searchParams = useSearchParams();
  const prefilledDate = searchParams.get('date') || '';
  const prefilledGuests = parseInt(searchParams.get('guests') || '1') || 1;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    passengers: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    pickupLocation: 'Hotel Karim Lobby',
  });

  useEffect(() => {
    if (prefilledDate || prefilledGuests > 1) {
      setFormData(prev => ({
        ...prev,
        date: prefilledDate || prev.date,
        passengers: prefilledGuests || prev.passengers,
      }));
    }
  }, [prefilledDate, prefilledGuests]);

  const router = useRouter();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tour',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          passengers: formData.passengers,
          specialRequests: `Pickup: ${formData.pickupLocation} | Notes: ${formData.specialRequests}`,
          price: tour.price * formData.passengers,
          direction: tour.name,
          tour_name: tour.name,
        }),
      });
    } catch (err) {
      console.error('Failed to save booking:', err);
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPrice = tour.price * formData.passengers;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 mb-8 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-mediterranean-blue' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-mediterranean-blue text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <span className="font-semibold hidden sm:inline">Booking Details</span>
        </div>
        <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-mediterranean-blue' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-mediterranean-blue' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-mediterranean-blue text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          <span className="font-semibold hidden sm:inline">Confirmation</span>
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-8">
              
              <form id="tour-form" onSubmit={handleNext} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
                <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                  <CalendarDays className="text-terracotta-warmth" /> Tour Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Passengers</label>
                    <input required type="number" min="1" value={formData.passengers} onChange={e => setFormData({...formData, passengers: Math.max(1, parseInt(e.target.value) || 1)})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pickup Location</label>
                    <input required type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                  </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-800 my-8" />

                <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                  <Users className="text-terracotta-warmth" /> Contact Info
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Special Requests</label>
                    <textarea rows={3} value={formData.specialRequests} onChange={e => setFormData({...formData, specialRequests: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none resize-none" />
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column: Tour Info & Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold font-heading mb-4 text-slate-800 dark:text-white">Tour Summary</h2>
                
                <div className="rounded-2xl border-2 border-mediterranean-blue bg-mediterranean-blue/5 overflow-hidden mb-6">
                  <div className="relative h-40 w-full">
                    <img src={tour.image} alt={tour.name} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white text-sm font-bold px-3 py-1 rounded-full">{tour.name}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-mediterranean-blue" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-mediterranean-blue" />
                      <span>{tour.meetingPoint}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-800 my-4" />

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Price per person</span>
                    <span>€{tour.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Passengers</span>
                    <span>x {formData.passengers}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-white">Total</span>
                  <span className="text-3xl font-bold font-heading text-mediterranean-blue">€{totalPrice}</span>
                </div>

                <button
                  type="submit"
                  form="tour-form"
                  className="w-full py-4 bg-terracotta-warmth text-white font-bold rounded-xl shadow-lg hover:bg-terracotta-warmth/90 transition-all flex items-center justify-center gap-2"
                >
                  Confirm Booking <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Pay later with driver/guide
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold font-heading mb-4 text-slate-800 dark:text-white">Booking Confirmed!</h2>
            <p className="text-slate-600 dark:text-slate-300 font-sans mb-8">
              Thank you for booking the <strong>{tour.name}</strong> tour. A confirmation has been sent to {formData.email}.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-left mb-8">
              <h3 className="font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500 block">Tour</span><span className="font-semibold">{tour.name}</span></div>
                <div><span className="text-slate-500 block">Date</span><span className="font-semibold">{formData.date}</span></div>
                <div><span className="text-slate-500 block">Passengers</span><span className="font-semibold">{formData.passengers} people</span></div>
                <div><span className="text-slate-500 block">Total Due</span><span className="font-semibold text-mediterranean-blue">€{totalPrice}</span></div>
              </div>
            </div>

            <button
              onClick={() => router.push('/tours')}
              className="px-8 py-3 bg-mediterranean-blue text-white font-bold rounded-xl shadow-lg hover:bg-mediterranean-blue/90 transition-all"
            >
              Back to Tours
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
