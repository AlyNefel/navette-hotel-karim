"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Plane, Car, Users, CalendarDays, Clock, MapPin, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

const transferTypes = [
  {
    id: 'ranger',
    name: 'Ford Ranger XLT',
    desc: 'Spacious 4x4 pickup — air-conditioned & comfortable',
    pax: 4,
    suitcases: 4,
    price: 20,
    icon: Car,
    image: '/black-ford-ranger.jpg',
  },
];

export default function TransfersPage() {
  const searchParams = useSearchParams();
  const prefilledDate = searchParams.get('date') || '';
  const prefilledPassengers = parseInt(searchParams.get('passengers') || '1') || 1;

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'airport_to_hotel' | 'hotel_to_airport'>('airport_to_hotel');
  const [selectedVehicle, setSelectedVehicle] = useState(transferTypes[0]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    flightNumber: '',
    passengers: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // Hydrate from URL after mount to avoid Next.js SSR mismatch
  useEffect(() => {
    if (prefilledDate || prefilledPassengers > 1) {
      setFormData(prev => ({
        ...prev,
        date: prefilledDate || prev.date,
        passengers: prefilledPassengers || prev.passengers,
      }));
    }
  }, [prefilledDate, prefilledPassengers]);

  const t = useTranslations('Transfers');
  const router = useRouter();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'transfer',
          direction,
          date: formData.date,
          time: formData.time,
          flightNumber: formData.flightNumber,
          passengers: formData.passengers,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
          price: selectedVehicle.price,
        }),
      });
    } catch (err) {
      console.error('Failed to save booking:', err);
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-mediterranean-blue text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">{t('title')}</h1>
        <p className="text-white/80 font-sans max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Progress Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 mb-8 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-mediterranean-blue' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-mediterranean-blue text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className="font-semibold hidden sm:inline">{t('step1')}</span>
          </div>
          <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-mediterranean-blue' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-mediterranean-blue' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-mediterranean-blue text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className="font-semibold hidden sm:inline">{t('step2')}</span>
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
                
                {/* Direction Selection */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                    <MapPin className="text-terracotta-warmth" /> {t('direction')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setDirection('airport_to_hotel')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${direction === 'airport_to_hotel' ? 'border-mediterranean-blue bg-mediterranean-blue/5' : 'border-slate-200 dark:border-slate-700 hover:border-mediterranean-blue/50'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="w-5 h-5 text-mediterranean-blue" />
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <Hotel className="w-5 h-5 text-terracotta-warmth" />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-white">{t('airportToHotel')}</p>
                      <p className="text-xs text-slate-500">{t('airportPickup')}</p>
                    </button>
                    <button
                      onClick={() => setDirection('hotel_to_airport')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${direction === 'hotel_to_airport' ? 'border-mediterranean-blue bg-mediterranean-blue/5' : 'border-slate-200 dark:border-slate-700 hover:border-mediterranean-blue/50'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Hotel className="w-5 h-5 text-terracotta-warmth" />
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <Plane className="w-5 h-5 text-mediterranean-blue" />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-white">{t('hotelToAirport')}</p>
                      <p className="text-xs text-slate-500">{t('airportDropoff')}</p>
                    </button>
                  </div>
                </div>

                {/* Details Form */}
                <form id="transfer-form" onSubmit={handleNext} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
                  <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                    <CalendarDays className="text-terracotta-warmth" /> {t('journeyDetails')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('date')}</label>
                      <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{direction === 'airport_to_hotel' ? t('flightArrival') : t('pickupTime')}</label>
                      <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('flightNumber')}</label>
                      <input required type="text" placeholder="e.g. TU723" value={formData.flightNumber} onChange={e => setFormData({...formData, flightNumber: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('passengers')} <span className="text-slate-400 font-normal">{t('maxPax')}</span></label>
                      <input required type="number" min="1" max="4" value={formData.passengers} onChange={e => setFormData({...formData, passengers: Math.min(4, parseInt(e.target.value) || 1)})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800 my-8" />

                  <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Users className="text-terracotta-warmth" /> {t('contactInfo')}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('fullName')}</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('emailAddress')}</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('phone')}</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('specialRequests')}</label>
                      <textarea rows={3} value={formData.specialRequests} onChange={e => setFormData({...formData, specialRequests: e.target.value})} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-mediterranean-blue outline-none resize-none" />
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Vehicle Info & Summary */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-bold font-heading mb-4 text-slate-800 dark:text-white">{t('yourVehicle')}</h2>
                  
                  {/* Ford Ranger XLT Fixed Card */}
                  <div className="rounded-2xl border-2 border-mediterranean-blue bg-mediterranean-blue/5 overflow-hidden mb-6">
                    <div className="relative h-40 w-full">
                      <Image src="/black-ford-ranger.jpg" alt="Ford Ranger XLT" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-mediterranean-blue text-white text-xs font-bold px-3 py-1 rounded-full">Ford Ranger XLT</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300">{t('vehicleDesc')}</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                          <p className="text-lg font-bold text-mediterranean-blue">4</p>
                          <p className="text-[10px] text-slate-500">Max Pax</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                          <p className="text-lg font-bold text-mediterranean-blue">4×4</p>
                          <p className="text-[10px] text-slate-500">Drive</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                          <p className="text-lg font-bold text-mediterranean-blue">A/C</p>
                          <p className="text-[10px] text-slate-500">Climate</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800 my-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-slate-800 dark:text-white">{t('total')}</span>
                    <span className="text-3xl font-bold font-heading text-mediterranean-blue">€{selectedVehicle.price}</span>
                  </div>

                  <button
                    type="submit"
                    form="transfer-form"
                    className="w-full py-4 bg-terracotta-warmth text-white font-bold rounded-xl shadow-lg hover:bg-terracotta-warmth/90 transition-all flex items-center justify-center gap-2"
                  >
                    {t('continueToReview')} <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> {t('noPaymentNow')}
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
              <h2 className="text-3xl font-bold font-heading mb-4 text-slate-800 dark:text-white">{t('confirmed')}</h2>
              <p className="text-slate-600 dark:text-slate-300 font-sans mb-8">
                {t('confirmedDesc', { flight: formData.flightNumber, email: formData.email })}
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-left mb-8">
                <h3 className="font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{t('summary')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500 block">{t('summaryDirection')}</span><span className="font-semibold">{direction === 'airport_to_hotel' ? t('airportToHotel') : t('hotelToAirport')}</span></div>
                  <div><span className="text-slate-500 block">{t('summaryDateTime')}</span><span className="font-semibold">{formData.date} at {formData.time}</span></div>
                  <div><span className="text-slate-500 block">{t('summaryVehicle')}</span><span className="font-semibold">{selectedVehicle.name}</span></div>
                  <div><span className="text-slate-500 block">{t('summaryTotal')}</span><span className="font-semibold text-mediterranean-blue">€{selectedVehicle.price}</span></div>
                </div>
              </div>

              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-mediterranean-blue text-white font-bold rounded-xl shadow-lg hover:bg-mediterranean-blue/90 transition-all"
              >
                {t('returnHome')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple Hotel icon component since lucide doesn't have a perfect one
function Hotel(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/>
    </svg>
  );
}
