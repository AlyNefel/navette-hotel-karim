"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, ArrowRight, Star } from "lucide-react";
import type { Tour } from "@/lib/tours-data";

export function ToursGrid({ tours }: { tours: Tour[] }) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(tours.map(t => t.category)))];

  const filteredTours = filter === "All" ? tours : tours.filter(t => t.category === filter);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === cat
                ? "bg-mediterranean-blue text-white shadow-md shadow-mediterranean-blue/30"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-mediterranean-blue hover:text-mediterranean-blue"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTours.map((tour) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={tour.slug}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-full ${tour.badgeColor}`}>
                  {tour.badge}
                </span>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-golden-sun-gold text-golden-sun-gold" />
                  <span className="font-bold text-white">{tour.rating}</span>
                  <span className="text-white/80 text-sm">({tour.reviewCount})</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold text-terracotta-warmth uppercase tracking-wider mb-2">{tour.category}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-2">{tour.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed mb-6 flex-1 line-clamp-3">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-mediterranean-blue" />{tour.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-mediterranean-blue" />{tour.groupSize}</span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    {tour.price > 0 ? (
                      <>
                        <p className="text-sm text-slate-400 mb-0.5">From</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-mediterranean-blue">€{tour.price}</span>
                          <span className="text-xs text-slate-500">/ person</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-mediterranean-blue">Custom Price</p>
                    )}
                  </div>
                  <a
                    href={`/en/tours/${tour.slug}`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-mediterranean-blue text-white text-sm font-semibold rounded-full hover:bg-mediterranean-blue/90 transition-all shadow-md hover:shadow-lg"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
