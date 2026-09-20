import { MapPin, Phone, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/types/car";

export default function VisitSection({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const shopName = settings?.shop_name ?? "My Motors";
  const address = settings?.address ?? "Address coming soon";
  const phone = settings?.phone;
  const whatsapp = settings?.whatsapp;
  const mapQuery = encodeURIComponent(address);
  const embedSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const directionsUrl =
    settings?.map_url ?? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section id="visit" className="border-t border-steel/70 bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm text-brass-soft">Ready to buy</p>
          <h2 className="mt-1 font-display text-4xl font-semibold tracking-wide text-cream">
            Found one you like? Come see it in person.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-silver">
            Every price you see online is the price on the floor. Visit the
            shop, take it for a look, and buy directly from us.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
              <div>
                <p className="font-medium text-cream">{shopName}</p>
                <p className="text-sm text-silver">{address}</p>
              </div>
            </div>
            {phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brass" />
                <a
                  href={`tel:${phone}`}
                  className="text-sm text-silver transition-colors hover:text-brass-soft"
                >
                  {phone}
                </a>
              </div>
            )}
            {whatsapp && (
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-brass" />
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-silver transition-colors hover:text-brass-soft"
                >
                  Message on WhatsApp
                </a>
              </div>
            )}
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-sm bg-brass px-6 py-3 text-sm font-medium text-asphalt transition-colors hover:bg-brass-soft"
          >
            Get directions
          </a>
        </div>

        <div className="overflow-hidden rounded-md border border-steel-soft">
          <iframe
            title="Shop location"
            src={embedSrc}
            className="h-full min-h-[320px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
