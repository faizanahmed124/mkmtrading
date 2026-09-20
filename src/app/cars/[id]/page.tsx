import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Car, SiteSettings } from "@/types/car";
import VisitSection from "@/components/VisitSection";
import CarGallery from "@/components/CarGallery";

export const revalidate = 0;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: car }, { data: settings }] = await Promise.all([
    supabase.from("cars").select("*").eq("id", id).maybeSingle(),
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);

  if (!car) notFound();

  const c = car as Car;
  const specs = [
    { label: "Year", value: String(c.year) },
    { label: "Price", value: formatPrice(c.price) },
    { label: "Mileage", value: c.mileage != null ? `${c.mileage.toLocaleString()} km` : "—" },
    { label: "Fuel type", value: c.fuel_type ?? "—" },
    { label: "Transmission", value: c.transmission ?? "—" },
    { label: "Color", value: c.color ?? "—" },
    { label: "Condition", value: c.condition },
  ];

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/#inventory"
          className="text-sm text-silver transition-colors hover:text-brass-soft"
        >
          ← Back to inventory
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <CarGallery images={c.images ?? []} name={`${c.brand} ${c.model}`} />

          <div>
            <p className="text-sm text-brass-soft">{c.year}</p>
            <h1 className="mt-1 font-display text-4xl font-semibold tracking-wide text-cream sm:text-5xl">
              {c.brand} {c.model}
            </h1>
            <p className="mt-4 font-display text-3xl text-brass-soft">
              {formatPrice(c.price)}
            </p>

            {c.description && (
              <p className="mt-6 max-w-lg leading-relaxed text-silver">
                {c.description}
              </p>
            )}

            <div className="mt-8 hud-rule" />
            <dl className="mt-6 grid grid-cols-2 gap-y-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-widest text-silver/70">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-lg text-cream">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 hud-rule" />

            <a
              href="#visit"
              className="mt-8 inline-block rounded-sm bg-brass px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brass-soft"
            >
              I want this one — show me the shop
            </a>
          </div>
        </div>
      </div>

      <VisitSection settings={settings as SiteSettings | null} />
    </>
  );
}