"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Drop your photos in /public/carousel/ using these exact file names.
// Add or remove entries here if you use more or fewer than 5 images.
const images = [
  "/carousel/1.jpg",
  "/carousel/2.jpg",
  "/carousel/3.jpg",
  "/carousel/4.jpg",
  "/carousel/5.jpg",
];

const SLIDE_DURATION = 4500;

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden border-b border-steel/70 bg-asphalt">
      {/* Rotating background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility overlay — stays constant while slides change underneath */}
      <div aria-hidden className="absolute inset-0 bg-asphalt/60" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/30 to-transparent"
      />

      {/* Static text, unaffected by the slide transitions */}
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brass-soft">
          Featured collection
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-wide text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl">
          Every car, one destination.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/80">
          A closer look at what&apos;s currently on our floor — check full
          specs and pricing in the collection.
        </p>

        <Link
          href="#inventory"
          className="mt-8 inline-flex items-center gap-1 rounded-sm bg-brass px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brass-soft"
        >
          View collection
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-brass" : "w-1.5 bg-cream/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}