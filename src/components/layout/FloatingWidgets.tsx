"use client";

import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function FloatingWidgets() {
  const [showWaTooltip, setShowWaTooltip] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappNumber = "21628580539";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20Hotel%20Karim%20services.`;

  return (
    <>
      {/* Live Chat Widget (AI + Pusher) */}
      <LiveChatWidget />

      {/* WhatsApp Direct Link */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showWaTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-slate-100 whitespace-nowrap"
            >
              Chat on WhatsApp 💬
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowWaTooltip(true)}
          onMouseLeave={() => setShowWaTooltip(false)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          title="Chat on WhatsApp"
        >
          {/* WhatsApp SVG icon */}
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </motion.a>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-slate-800/80 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700 transition border border-slate-600/50"
            title="Scroll to top"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2">
              <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
