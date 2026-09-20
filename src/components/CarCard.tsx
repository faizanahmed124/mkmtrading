"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import type { Car } from "@/types/car";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CarCard({ car, big = false }: { car: Car; big?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    setHovering(false);
  }

  const image = car.images?.[0];

  return (
    <Link href={`/cars/${car.id}`} className="block">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative overflow-hidden rounded-md border border-steel bg-panel transition-colors duration-300 hover:border-brass/70 ${
          big ? "md:col-span-2 md:row-span-2" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden bg-steel ${
            big ? "aspect-[16/10]" : "aspect-[4/3]"
          }`}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`${car.brand} ${car.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ transform: "translateZ(20px)" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-silver/60">
              No photo yet
            </div>
          )}

          {car.featured && (
            <span className="absolute left-3 top-3 rounded-sm bg-brass px-2 py-1 text-xs font-medium uppercase tracking-wide text-white">
              Featured
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-sm border border-steel-soft bg-asphalt/80 px-2 py-1 text-xs text-silver backdrop-blur-sm">
            {car.condition}
          </span>
        </div>

        <div
          className="p-5"
          style={{ transform: hovering ? "translateZ(30px)" : "translateZ(0px)" }}
        >
          <p className="text-xs uppercase tracking-widest text-silver/70">
            {car.year}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-wide text-cream">
            {car.brand} {car.model}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-silver">
            {car.mileage != null && <span>{car.mileage.toLocaleString()} km</span>}
            {car.fuel_type && <span>{car.fuel_type}</span>}
            {car.transmission && <span>{car.transmission}</span>}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-display text-2xl text-brass-soft">
              {formatPrice(car.price)}
            </span>
            <span className="text-sm text-silver transition-colors group-hover:text-brass-soft">
              View details
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}