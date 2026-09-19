"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BedDouble, Star, ArrowRight } from "lucide-react";

const rooms = [
  {
    name: "Deluxe Medina Room",
    description: "Immerse yourself in authentic Tunisian craftsmanship with hand-carved furnishings and traditional zellige tile accents.",
    price: 180,
    rating: 4.9,
    reviews: 124,
    image: "/room-deluxe.jpg",
    size: "35 m²",
    tags: ["King Bed", "City View", "Breakfast Included"],
  },
  {
    name: "Carthage Suite",
    description: "A panoramic suite overlooking the ancient ruins of Carthage and the shimmering Mediterranean, with a private balcony.",
    price: 320,
    rating: 5.0,
    reviews: 89,
    image: "/room-carthage.jpg",
    size: "58 m²",
    tags: ["King Bed", "Sea View", "Private Balcony"],
  },
  {
    name: "Riad Garden Room",
    description: "Retreat to our serene courtyard-facing room surrounded by jasmine blossoms and the gentle sound of our central fountain.",
    price: 145,
    rating: 4.8,
    reviews: 211,
    image: "/room-deluxe.jpg",
    size: "28 m²",
    tags: ["Twin Beds", "Garden View", "Hammam Access"],
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function RoomsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-jasmine-white dark:bg-slate-950 relative">
      {/* Zellige background accent */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F4C81' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-terracotta-warmth mb-4">
            Our Accommodations
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-mediterranean-blue dark:text-white font-heading mb-4">
            Featured Rooms & Suites
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans text-lg">
            Each space is thoughtfully designed to blend Tunisian artisanal heritage with contemporary comfort.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.name}
              variants={cardVariants}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {room.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-black/40 backdrop-blur-sm text-white rounded-full border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">{room.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-golden-sun-gold text-golden-sun-gold" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{room.rating}</span>
                      <span className="text-xs text-slate-400">({room.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-mediterranean-blue">€{room.price}</p>
                    <p className="text-xs text-slate-400">per night</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed mb-4">{room.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <BedDouble className="w-4 h-4" />
                    <span>{room.size}</span>
                  </div>
                  <motion.button
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-terracotta-warmth hover:text-mediterranean-blue transition-colors"
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
