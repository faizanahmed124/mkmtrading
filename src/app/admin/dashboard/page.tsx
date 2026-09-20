import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/admin/DashboardClient";
import type { Car, SiteSettings } from "@/types/car";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: cars }, { data: settings }, { data: userData }] =
    await Promise.all([
      supabase.from("cars").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.auth.getUser(),
    ]);

  return (
    <DashboardClient
      initialCars={(cars ?? []) as Car[]}
      initialSettings={(settings as SiteSettings) ?? null}
      adminEmail={userData.user?.email ?? ""}
    />
  );
}
