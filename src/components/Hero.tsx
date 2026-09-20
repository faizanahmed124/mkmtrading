"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import type { SiteSettings } from "@/types/car";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), {
    stiffness: 60,
    damping: 20,
  });
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [-10, 10]), {
    stiffness: 60,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const eyebrow = settings?.hero_eyebrow ?? "Premium cars / Trusted dealer";
  const heading =
    settings?.hero_heading ?? "Find the car that fits your drive.";
  const subtext =
    settings?.hero_subtext ??
    "Quality vehicles, verified condition, and transparent deals. Your next car is just a few clicks away.";
  const heroImage = settings?.hero_image_url || "/hero.jpg";

  const headingWords = heading.trim().split(" ");
  const lastWord = headingWords.pop();

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="perspective-container relative flex min-h-[640px] items-start overflow-hidden border-b border-steel/70 bg-asphalt"
    >
      {/* Background photo (or a designed placeholder until the admin uploads one) */}
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="absolute inset-[-20px]"
      >
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <PlaceholderBackground />
        )}
      </motion.div>

      {/* Legibility overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-asphalt via-asphalt/80 to-asphalt/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-16 sm:pt-20">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-brass-soft"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-bold leading-[1.08] tracking-wide text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-6xl"
          >
            {headingWords.join(" ")}{" "}
            <span className="text-brass">{lastWord}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md text-base leading-relaxed text-cream/80"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="#inventory"
              className="flex items-center gap-2 rounded-sm bg-brass px-6 py-3 text-sm font-medium text-asphalt transition-colors hover:bg-brass-soft"
            >
              <ArrowLeft className="h-4 w-4" />
              Check New Collection
            </Link>
            <Link
              href="#visit"
              className="flex items-center gap-2 rounded-sm border border-cream/30 bg-asphalt/30 px-6 py-3 text-sm text-cream backdrop-blur-sm transition-colors hover:border-brass hover:text-brass-soft"
            >
              <MapPin className="h-4 w-4" />
              Visit Showroom
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PlaceholderBackground() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_75%_50%,rgba(212,161,58,0.16),transparent_60%)] bg-panel">
      <svg
        viewBox="0 0 900 500"
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          d="M120 330 L170 250 Q210 210 280 205 L560 200 Q620 200 655 245 L700 330 L760 335 Q790 340 790 375 L790 400 L110 400 L110 375 Q110 335 120 330 Z"
          fill="none"
          stroke="var(--brass)"
          strokeWidth="4"
        />
        <circle cx="230" cy="400" r="42" fill="none" stroke="var(--brass)" strokeWidth="4" />
        <circle cx="660" cy="400" r="42" fill="none" stroke="var(--brass)" strokeWidth="4" />
      </svg>
    </div>
  );
}