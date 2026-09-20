"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CarGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-steel bg-panel text-silver/60">
        No photos yet
      </div>
    );
  }

  return (
    <div>
      <div className="perspective-container relative aspect-[4/3] overflow-hidden rounded-md border border-steel bg-panel">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={name}
            initial={{ opacity: 0, rotateY: 8, scale: 1.02 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-sm border transition-colors ${
                i === active
                  ? "border-brass"
                  : "border-steel-soft opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
