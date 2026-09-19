"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const infoCards = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: "123 Avenue Habib Bourguiba, Tunis 1000, Tunisia",
    delay: 0.1,
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+216 71 123 456\n+216 22 987 654",
    delay: 0.2,
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "contact@hotelkarim.tn\nbooking@hotelkarim.tn",
    delay: 0.3,
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: "Mon-Sat: 8:00 AM - 8:00 PM\nSun: 9:00 AM - 5:00 PM",
    delay: 0.4,
  },
];

export function ContactInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
      {infoCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: card.delay }}
            className="group relative p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start justify-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-golden-sun-gold/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="p-3 bg-mediterranean-blue/10 dark:bg-mediterranean-blue/20 rounded-xl mb-4 group-hover:bg-mediterranean-blue group-hover:text-white transition-colors duration-300 text-mediterranean-blue">
              <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 font-heading">
              {card.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-sans whitespace-pre-line">
              {card.details}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
