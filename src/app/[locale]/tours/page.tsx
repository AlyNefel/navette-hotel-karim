import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ToursGrid } from '@/components/tours/ToursGrid';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Excursions & Day Tours | Hotel Karim Tunis',
  description: 'Discover curated day trips and multi-day tours from Tunis: Sidi Bou Said, Carthage, Dougga UNESCO, and Sahara Desert safaris. Expert local guides, all-inclusive packages.',
  keywords: 'Tunisia tours, Sidi Bou Said tour, Dougga day trip, Sahara desert tour, Carthage excursion, Hotel Karim tours',
};

export const dynamic = 'force-dynamic';

import { getToursFromDB } from '@/lib/get-tours';

async function getTours() {
  return await getToursFromDB();
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tours = await getTours();
  const t = await getTranslations('Tours');

  return (
    <div className="min-h-screen bg-jasmine-white dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src="/hero-sidi-bou-said.jpg" alt="Tunisia Excursions" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-mediterranean-blue/50 via-mediterranean-blue/30 to-jasmine-white dark:to-slate-950" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-golden-sun-gold mb-4 border border-golden-sun-gold/40 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-heading mb-3">
            {t('title')}
          </h1>
          <p className="text-white/80 text-lg max-w-xl font-sans">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Tours Grid with Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ToursGrid tours={tours} />
      </div>

      {/* Custom Itinerary CTA */}
      <div className="bg-mediterranean-blue py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white font-heading mb-3">{t('customTitle')}</h2>
          <p className="text-white/70 font-sans mb-8">{t('customDesc')}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-golden-sun-gold text-white font-bold rounded-full hover:bg-golden-sun-gold/90 transition-all shadow-lg">
            {t('customCta')}
          </Link>
        </div>
      </div>
    </div>
  );
}

