import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/car";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const s = settings as SiteSettings | null;
  const shopName = s?.shop_name ?? "My Motors";
  const logo = s?.logo_url || "/logo.jpg";

  return (
    <header className="sticky top-0 z-50 border-b border-steel/70 bg-asphalt/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={shopName} className="h-14 w-auto object-contain" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/#inventory"
            className="hidden text-sm text-silver transition-colors hover:text-brass-soft sm:block"
          >
             View Collection
          </Link>
          <Link
            href="/#visit"
            className="hidden text-sm text-silver transition-colors hover:text-brass-soft sm:block"
          >
            Visit us
          </Link>
          <Link
            href="/admin/login"
            className="rounded-sm border border-steel-soft px-4 py-2 text-sm text-silver transition-colors hover:border-brass hover:text-brass-soft"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}