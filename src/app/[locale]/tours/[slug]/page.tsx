import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getToursFromDB } from '@/lib/get-tours';
import { Clock, Users, Star, MapPin, Check, X, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import { TourBookingClient } from '@/components/tours/TourBookingClient';
import type { Tour } from '@/lib/tours-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tours = await getToursFromDB();
  const tour = tours.find((t: Tour) => t.slug === slug);
  if (!tour) return { title: 'Tour Not Found' };
  
  return {
    title: `${tour.name} | Hotel Karim Excursions`,
    description: tour.description,
  };
}

export default async function TourDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tours = await getToursFromDB();
  const tour = tours.find((t: Tour) => t.slug === slug);
  if (!tour) notFound();

  return (
    <div className="bg-jasmine-white dark:bg-slate-950 pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider rounded-full ${tour.badgeColor}`}>
              {tour.badge}
            </span>
            <span className="px-4 py-1.5 text-xs font-bold text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              {tour.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-heading mb-4">
            {tour.name}
          </h1>
          <p className="text-xl text-white/90 font-sans max-w-3xl">
            {tour.tagline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12 space-y-12">
        
        {/* Quick Stats */}
        <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 gap-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-mediterranean-blue" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Duration</p>
              <p className="font-bold dark:text-white">{tour.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-mediterranean-blue" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Group Size</p>
              <p className="font-bold dark:text-white">{tour.groupSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-golden-sun-gold fill-golden-sun-gold" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Rating</p>
              <p className="font-bold dark:text-white">{tour.rating} <span className="text-sm font-normal text-slate-500">({tour.reviewCount})</span></p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold font-heading text-mediterranean-blue dark:text-white mb-6">Overview</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {tour.longDescription}
          </div>
        </section>

        {/* Highlights */}
        <section>
          <h2 className="text-2xl font-bold font-heading text-mediterranean-blue dark:text-white mb-6">Highlights</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tour.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 bg-golden-sun-gold/20 p-1 rounded-full">
                  <Star className="w-4 h-4 text-golden-sun-gold fill-golden-sun-gold" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Itinerary */}
        <section>
          <h2 className="text-2xl font-bold font-heading text-mediterranean-blue dark:text-white mb-8">Itinerary</h2>
          <div className="space-y-8">
            {tour.itinerary.map((stop, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                  <div className="hidden md:block col-span-1 text-right pt-1">
                    <span className="text-mediterranean-blue font-bold">{stop.time}</span>
                  </div>
                  <div className="relative md:col-span-4 pb-8 md:pb-0 border-l-2 border-slate-200 dark:border-slate-800 md:pl-8 last:border-0 last:pb-0">
                    <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-terracotta-warmth border-4 border-jasmine-white dark:border-slate-950" />
                    
                    {/* Mobile time display */}
                    <span className="md:hidden text-mediterranean-blue font-bold text-sm mb-2 block">{stop.time}</span>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{stop.place}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{stop.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Includes / Excludes */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5" /> What's Included
            </h3>
            <ul className="space-y-3">
              {tour.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300/80">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
              <X className="w-5 h-5" /> Not Included
            </h3>
            <ul className="space-y-3">
              {tour.excludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300/80">
                  <X className="w-4 h-4 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>

      <div className="bg-slate-100 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
         <TourBookingClient tour={tour} />
      </div>
    </div>
  );
}
