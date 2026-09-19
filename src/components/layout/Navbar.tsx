"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, CalendarDays, ChevronDown, Gift } from "lucide-react";
import { LuckyRouletteModal } from "@/components/roulette/LuckyRouletteModal";

const locales = [
  { code: "en", label: "EN", full: "English" },
  { code: "fr", label: "FR", full: "Français" },
  { code: "ar", label: "AR", full: "العربية" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Nav");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/transfers", label: t("transfers") },
    { href: "/tours", label: t("tours") },
    { href: "/booking-status", label: t("trackBooking") },
    { href: "/contact", label: t("contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  const currentLocale = locales.find((l) => l.code === locale) ?? locales[0];

  const isHomePage = pathname === '/';
  const navThemeActive = !isHomePage || scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          navThemeActive
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20"
            : "bg-transparent"
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-mediterranean-blue flex items-center justify-center">
              <span className="text-golden-sun-gold font-bold text-lg">K</span>
            </div>
            <div>
              <span className={`text-lg font-bold block leading-tight transition-colors duration-300 ${navThemeActive ? "text-mediterranean-blue" : "text-white"}`}>
                Hotel Karim
              </span>
              <span className={`text-xs leading-none tracking-wider transition-colors duration-300 ${navThemeActive ? "text-terracotta-warmth" : "text-white/70"}`}>
                TUNIS
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-300 relative group ${
                  pathname === link.href
                    ? navThemeActive ? "text-terracotta-warmth" : "text-golden-sun-gold"
                    : navThemeActive ? "text-slate-700 hover:text-mediterranean-blue" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-terracotta-warmth transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Roulette Button */}
            <motion.button
              onClick={() => setRouletteOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse ${
                navThemeActive 
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>{t("spinAndWin")}</span>
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  navThemeActive
                    ? "border-slate-200 text-slate-700 hover:border-mediterranean-blue hover:text-mediterranean-blue"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {currentLocale.label}
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          loc.code === locale ? "text-mediterranean-blue font-bold" : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>{loc.full}</span>
                        <span className="text-xs text-slate-400">{loc.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Book Now CTA */}
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/transfers"
                className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-warmth text-white rounded-full text-sm font-semibold shadow-md shadow-terracotta-warmth/30 hover:bg-terracotta-warmth/90 transition-all"
              >
                <CalendarDays className="w-4 h-4" />
                {t("bookNow")}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex md:hidden transition-colors ${navThemeActive ? "text-mediterranean-blue" : "text-white"}`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-lg"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    pathname === link.href
                      ? "bg-mediterranean-blue text-white"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => switchLocale(loc.code)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      loc.code === locale
                        ? "border-mediterranean-blue bg-mediterranean-blue text-white"
                        : "border-slate-200 text-slate-600 hover:border-mediterranean-blue"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setRouletteOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-amber-100 text-amber-700 border border-amber-300 rounded-xl text-sm font-bold shadow-sm"
              >
                <Gift className="w-4 h-4" />
                {t("spinAndWin")}
              </button>
              <Link
                href="/transfers"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-terracotta-warmth text-white rounded-xl text-sm font-semibold shadow-md"
              >
                <CalendarDays className="w-4 h-4" />
                {t("bookNow")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <LuckyRouletteModal isOpen={rouletteOpen} onClose={() => setRouletteOpen(false)} />
    </>
  );
}
