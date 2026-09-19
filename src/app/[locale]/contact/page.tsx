import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');

  return (
    <div className="min-h-screen bg-jasmine-white dark:bg-slate-950 pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-mediterranean-blue/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-golden-sun-gold/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-terracotta-warmth/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mediterranean-blue dark:text-white font-heading">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-sans">
            {t('subtitle')}
          </p>
        </div>

        {/* Top Section: Info Cards & 3D Car */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 h-full">
            <ContactInfo />
          </div>
          <div className="order-1 lg:order-2 h-[400px] lg:h-full min-h-[400px] bg-gradient-to-br from-mediterranean-blue/5 to-transparent rounded-3xl border border-mediterranean-blue/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 right-4 text-center z-10 pointer-events-none">
              <p className="text-sm font-semibold text-mediterranean-blue/50 tracking-widest uppercase shadow-sm">{t('premiumTransfers')}</p>
            </div>
            <img src="/black-ford-ranger.jpg" alt="Ford Ranger XLT" className="w-full h-full object-cover mix-blend-multiply opacity-90 dark:mix-blend-normal" />
          </div>
        </div>

        {/* Bottom Section: Contact Form */}
        <div className="max-w-4xl mx-auto">
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
