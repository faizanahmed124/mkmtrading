import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/admin/DashboardClient";
import type { Car, SiteSettings } from "@/types/car";
import type { Review } from "@/types/review";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: cars }, { data: settings }, { data: userData }, { data: reviews }] =
    await Promise.all([
      supabase.from("cars").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.auth.getUser(),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    ]);

  return (
    <DashboardClient
      initialCars={(cars ?? []) as Car[]}
      initialSettings={(settings as SiteSettings) ?? null}
      adminEmail={userData.user?.email ?? ""}
      initialReviews={(reviews ?? []) as Review[]}
    />
  );
}