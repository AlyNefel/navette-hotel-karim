import { setRequestLocale, getTranslations } from 'next-intl/server';
import { HeroSlider } from '@/components/home/HeroSlider';
import { BookingBar } from '@/components/home/BookingBar';
import { ToursSection } from '@/components/home/ToursSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotel Karim Tunis | Airport Transfers & Tunisian Excursions',
  description: 'Hotel Karim in Tunis offers premium airport transfers from Tunis-Carthage Airport, and curated day tours to Sidi Bou Said, Dougga, Sahara Desert, and Carthage.',
  keywords: 'Tunis airport transfer, Sidi Bou Said day tour, Hotel Karim Tunis excursions, Dougga tour, Sahara desert tour Tunisia',
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  return (
    <div className="flex flex-col">
      {/* 1. Full-screen Hero Slider */}
      <HeroSlider />

      {/* 2. Quick Booking Bar (overlaps hero) */}
      <div className="relative z-20 -mt-16 pb-16">
        <BookingBar />
      </div>

      {/* 3. Why Choose Us Stats */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "2,400+", label: t('stats.happyGuests'), icon: "😊" },
            { value: "98%", label: t('stats.onTimeTransfers'), icon: "✈️" },
            { value: "15+", label: t('stats.destinations'), icon: "🗺️" },
            { value: "24/7", label: t('stats.concierge'), icon: "💬" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-3xl font-bold text-mediterranean-blue font-heading">{stat.value}</div>
              <div className="text-sm text-slate-500 font-sans">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Regional Excursions */}
      <ToursSection />

      {/* 5. Airport Transfer Feature Block */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-terracotta-warmth">{t('transfers.badge')}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-mediterranean-blue dark:text-white font-heading leading-tight">
              {t('transfers.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-sans leading-relaxed">
              {t('transfers.desc')}
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-2xl">🚘</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">Ford Ranger XLT 4x4</p>
                  <p className="text-xs text-slate-500">{t('transfers.vehicleDesc')}</p>
                </div>
              </div>
            </div>
            <Link
              href="/transfers"
              className="inline-flex items-center gap-2 px-8 py-4 bg-mediterranean-blue text-white font-bold rounded-full shadow-lg hover:bg-mediterranean-blue/90 transition-all"
            >
              {t('transfers.cta')}
            </Link>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img src="/black-ford-ranger.jpg" alt="Premium Transfer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-mediterranean-blue/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-terracotta-warmth uppercase tracking-wider">{t('transfers.fareEstimate')}</span>
                  <span className="text-xs text-slate-400">{t('transfers.airportToHotel')}</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-3xl">🚘</span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Ford Ranger XLT 4×4</p>
                    <p className="text-3xl font-bold text-mediterranean-blue">€20</p>
                    <p className="text-xs text-slate-500">{t('transfers.upTo4Pax')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guest Reviews */}
      <ReviewsSection />

      {/* 7. Final CTA Banner */}
      <section className="py-20 px-4 bg-mediterranean-blue relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40L0 0h80L40 40zm0 0L80 80H0L40 40zm0 0L80 0v80L40 40zm0 0L0 80V0l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">
            {t('cta.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <p className="text-white/70 text-lg font-sans mb-8 max-w-2xl mx-auto">
            {t('cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/transfers" className="px-8 py-4 bg-golden-sun-gold text-white font-bold rounded-full hover:bg-golden-sun-gold/90 transition-all shadow-lg text-base">
              {t('cta.bookTransfer')}
            </Link>
            <Link href="/tours" className="px-8 py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all text-base">
              {t('cta.viewExcursions')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
