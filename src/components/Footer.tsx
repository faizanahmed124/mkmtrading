import Link from "next/link";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/car";

export default async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const s = settings as SiteSettings | null;
  const shopName = s?.shop_name ?? "My Motors";
  const logo = s?.logo_url || "/logo.jpg";
  const address = s?.address;
  const phone = s?.phone;
  const whatsapp = s?.whatsapp;

  return (
    <footer className="border-t border-steel/70 bg-panel">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={shopName} className="h-12 w-auto object-contain" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-silver">
              Quality vehicles, verified condition, and transparent deals —
              built for people who&apos;d rather drive than scroll.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs uppercase tracking-widest text-silver/70">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-silver transition-colors hover:text-brass-soft">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#inventory"
                  className="text-silver transition-colors hover:text-brass-soft"
                >
                  Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/#visit"
                  className="text-silver transition-colors hover:text-brass-soft"
                >
                  Visit us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-silver/70">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-silver">
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-brass" />
                  <a href={`tel:${phone}`} className="transition-colors hover:text-brass-soft">
                    {phone}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brass" />
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brass-soft"
                  >
                    WhatsApp us
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <p className="text-xs uppercase tracking-widest text-silver/70">
              Dealer
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/admin/login"
                  className="text-silver transition-colors hover:text-brass-soft"
                >
                 Login in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="hud-rule my-10" />

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-silver">
            &copy; {new Date().getFullYear()} {shopName}. All rights reserved.
          </p>
          <p className="text-sm text-silver/70">Every price shown is the price on the floor.</p>
        </div>
      </div>
    </footer>
  );
}