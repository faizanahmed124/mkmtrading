"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ShieldCheck, BadgeCheck, Handshake } from "lucide-react";
import type { SiteSettings } from "@/types/car";

const features = [
  { icon: ShieldCheck, text: "Finance options available Contact us for more info" },
  { icon: BadgeCheck, text: "Fully inspected before it ever reaches the floor" },
  { icon: Handshake, text: "No pressure, no hidden fees — just honest advice" },
];

export default function AboutSection({ settings }: { settings: SiteSettings | null }) {
  const shopName = settings?.shop_name ?? "My Motors";
  const logo = settings?.logo_url || "/logo.jpg";
  const tagline =
    settings?.about_tagline ??
    "Quality used vehicles at competitive prices. Browse our collection and find your perfect car today.";
  const paragraph =
    settings?.about_paragraph ??
    "We are proud to offer first class customer service and competitive pricing on every car we sell.\n\nEvery car we list is fully inspected before it goes on the floor, and priced fairly from the start.\n\nWe realise buying a car can be a big decision, so our team is here to answer questions and help you find the right fit — no pressure, no hidden fees.\n\nWhether you're after your first car or your fifth, we look forward to helping you find it.";
  const image = settings?.about_image_url || "/about.jpg";
  const paragraphs = paragraph.split("\n").filter((p) => p.trim().length > 0);

  return (
    <section className="border-b border-steel/70 bg-panel">
      {/* Centered intro */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-2xl px-6 pb-14 pt-20 text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={shopName}
          className="mx-auto h-14 w-auto object-contain"
        />
        <p className="mx-auto mt-5 max-w-xl text-silver">{tagline}</p>
      </motion.div>

      {/* Image + copy */}
      <div className="grid gap-0 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative min-h-[320px] overflow-hidden md:min-h-[560px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={shopName} className="h-full w-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col justify-center px-6 py-14 md:px-14"
        >
          <div className="space-y-4 text-silver">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8 space-y-4 border-t border-steel pt-8">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span className="text-sm text-cream/90">{text}</span>
              </div>
            ))}
          </div>

          <Link
            href="#inventory"
            className="mt-8 inline-flex w-fit items-center gap-1 rounded-sm bg-brass px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brass-soft"
          >
            Browse our showroom
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}