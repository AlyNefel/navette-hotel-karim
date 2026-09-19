"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sophie Bertrand",
    country: "France 🇫🇷",
    rating: 5,
    text: "An absolutely magical stay. The hotel perfectly blends Tunisian heritage with modern luxury. The Sahara excursion was a once-in-a-lifetime experience that our family will never forget.",
    avatar: "SB",
    date: "August 2026",
    service: "Sahara Desert Tour",
  },
  {
    name: "James Mitchell",
    country: "United Kingdom 🇬🇧",
    rating: 5,
    text: "The airport transfer was seamlessly organized. Our driver was punctual, professional, and incredibly knowledgeable about Tunis. The hotel itself is breathtaking — a true hidden gem.",
    avatar: "JM",
    date: "July 2026",
    service: "Airport Transfer",
  },
  {
    name: "Isabella Romano",
    country: "Italy 🇮🇹",
    rating: 5,
    text: "The Sidi Bou Said day trip was incredible. Our guide made history come alive. Coming back for the Dougga tour next year — Hotel Karim is our Tunis home away from home.",
    avatar: "IR",
    date: "September 2026",
    service: "Sidi Bou Said Day Trip",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-jasmine-white dark:bg-slate-950 relative overflow-hidden">
      {/* Tunisian geometric lines accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-golden-sun-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mediterranean-blue/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-terracotta-warmth mb-4">
            Guest Experiences
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-mediterranean-blue dark:text-white font-heading mb-4">
            Words from Our Guests
          </h2>
          {/* Star Rating Summary */}
          <div className="flex items-center justify-center gap-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-golden-sun-gold text-golden-sun-gold" />)}
            <span className="ml-2 text-2xl font-bold text-slate-800 dark:text-white">4.9</span>
            <span className="text-slate-500 font-sans">(424 verified reviews)</span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              variants={cardVariants}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-mediterranean-blue/10 dark:text-white/10" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-golden-sun-gold text-golden-sun-gold" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed mb-6 text-sm italic">
                "{review.text}"
              </p>

              {/* Meta */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mediterranean-blue flex items-center justify-center text-white font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-terracotta-warmth font-semibold">{review.service}</p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
