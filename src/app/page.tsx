import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Carousel from "@/components/Carousel";
import CarCard from "@/components/CarCard";
import VisitSection from "@/components/VisitSection";
import type { Car, SiteSettings } from "@/types/car";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const [{ data: cars }, { data: settings }] = await Promise.all([
    supabase.from("cars").select("*").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);

  const carList = (cars ?? []) as Car[];
  const featuredId = carList.find((c) => c.featured)?.id;

  return (
    <>
      <Hero settings={settings as SiteSettings | null} />
      <AboutSection settings={settings as SiteSettings | null} />
      <Carousel />

      <section id="inventory" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm text-brass-soft">Current lineup</p>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-wide text-cream">
              What&apos;s on the floor
            </h2>
          </div>
          <p className="hidden text-sm text-silver sm:block">
            {carList.length} car{carList.length === 1 ? "" : "s"} listed
          </p>
        </div>

        {carList.length === 0 ? (
          <div className="rounded-md border border-dashed border-steel-soft p-12 text-center text-silver">
            No cars are listed yet. Once the admin adds inventory, it will
            show up here automatically.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {carList.map((car) => (
              <CarCard key={car.id} car={car} big={car.id === featuredId} />
            ))}
          </div>
        )}
      </section>

      <VisitSection settings={settings as SiteSettings | null} />
    </>
  );
}