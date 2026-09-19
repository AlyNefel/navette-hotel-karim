"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Users, ArrowRight, Star } from "lucide-react";

const tours = [
  {
    name: "Sidi Bou Said & Carthage",
    category: "Historical & Scenic",
    description: "Wander the cobblestone streets of the iconic blue-and-white village, then step through the millennia at the ancient Carthaginian ruins.",
    duration: "Full Day (8h)",
    groupSize: "Up to 12",
    price: 65,
    rating: 4.9,
    image: "/hero-sidi-bou-said.jpg",
    badge: "Most Popular",
    badgeColor: "bg-terracotta-warmth",
  },
  {
    name: "Dougga & Zaghouan",
    category: "UNESCO Archaeological",
    description: "Explore one of North Africa's best-preserved Roman cities. Marvel at the soaring Capitol temple set dramatically against the green Tunisian countryside.",
    duration: "Full Day (9h)",
    groupSize: "Up to 10",
    price: 75,
    rating: 4.8,
    image: "/tour-dougga.jpg",
    badge: "UNESCO Heritage",
    badgeColor: "bg-mediterranean-blue",
  },
  {
    name: "Tozeur & Sahara Desert",
    category: "Desert Safari",
    description: "Journey south through dramatic landscapes to the edge of the Sahara. Ride camels at dusk and sleep under a breathtaking canopy of stars.",
    duration: "2 Days / 3 Days",
    groupSize: "Up to 8",
    price: 220,
    rating: 5.0,
    image: "/hero-sahara.jpg",
    badge: "Premium",
    badgeColor: "bg-golden-sun-gold",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ToursSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Large decorative background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-bold text-mediterranean-blue/[0.03] select-none pointer-events-none whitespace-nowrap">
        TUNISIA
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
            Curated Experiences
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-mediterranean-blue dark:text-white font-heading mb-4">
            Regional Excursions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans text-lg">
            Let our expert local guides unveil the wonders of Tunisia — from ancient civilizations to timeless desert landscapes.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {tours.map((tour) => (
            <motion.div
              key={tour.name}
              variants={cardVariants}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-700 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-full ${tour.badgeColor}`}>
                  {tour.badge}
                </span>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-golden-sun-gold text-golden-sun-gold" />
                  <span className="text-sm font-bold text-white">{tour.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold text-terracotta-warmth uppercase tracking-wider mb-2">{tour.category}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-3">{tour.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed mb-4 flex-1">{tour.description}</p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{tour.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{tour.groupSize}</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-mediterranean-blue">€{tour.price}</p>
                    <p className="text-xs text-slate-400">per person</p>
                  </div>
                  <motion.button
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-mediterranean-blue text-white text-sm font-semibold rounded-full hover:bg-mediterranean-blue/90 transition-all"
                  >
                    Book Tour <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Itinerary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-mediterranean-blue to-mediterranean-blue/80 text-white"
        >
          <h3 className="text-2xl font-bold font-heading mb-2">Looking for a Custom Itinerary?</h3>
          <p className="text-white/80 font-sans mb-6">Our expert team will design a bespoke Tunisian experience just for you.</p>
          <motion.a
            href="/en/contact"
            whileHover={{ scale: 1.03, y: -2 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-golden-sun-gold text-white font-semibold rounded-full hover:bg-golden-sun-gold/90 transition-all shadow-lg"
          >
            Request Custom Tour <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
