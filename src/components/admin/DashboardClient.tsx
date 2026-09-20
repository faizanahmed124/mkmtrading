"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CarFormModal from "@/components/admin/CarFormModal";
import type { Car, SiteSettings } from "@/types/car";

type Tab = "inventory" | "settings";

export default function DashboardClient({
  initialCars,
  initialSettings,
  adminEmail,
}: {
  initialCars: Car[];
  initialSettings: SiteSettings | null;
  adminEmail: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("inventory");
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function upsertCar(car: Car) {
    setCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      return exists ? prev.map((c) => (c.id === car.id ? car : c)) : [car, ...prev];
    });
    setModalOpen(false);
    setEditingCar(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this car? This can't be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    setCars((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-brass-soft">Admin panel</p>
          <h1 className="mt-1 font-display text-4xl tracking-wide text-cream">
            Manage your showroom
          </h1>
          {adminEmail && (
            <p className="mt-1 text-sm text-silver">Signed in as {adminEmail}</p>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-sm border border-steel-soft px-4 py-2 text-sm text-silver transition-colors hover:border-signal hover:text-signal"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <div className="mt-8 flex gap-2 border-b border-steel">
        {(
          [
            ["inventory", "Cars"],
            ["settings", "Shop settings"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-3 text-sm transition-colors ${
              tab === key
                ? "border-b-2 border-brass text-cream"
                : "text-silver hover:text-cream"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <div className="mt-8">
          <button
            onClick={() => {
              setEditingCar(null);
              setModalOpen(true);
            }}
            className="mb-6 flex items-center gap-2 rounded-sm bg-brass px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brass-soft"
          >
            <Plus className="h-4 w-4" />
            Add car
          </button>

          {cars.length === 0 ? (
            <div className="rounded-md border border-dashed border-steel-soft p-10 text-center text-silver">
              No cars yet. Click &quot;Add car&quot; to list your first one.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-steel">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-steel bg-panel text-silver">
                    <th className="px-4 py-3 font-normal">Car</th>
                    <th className="px-4 py-3 font-normal">Year</th>
                    <th className="px-4 py-3 font-normal">Price</th>
                    <th className="px-4 py-3 font-normal">Condition</th>
                    <th className="px-4 py-3 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, i) => (
                    <motion.tr
                      key={car.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-steel/60 bg-panel-raised last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {car.featured && (
                            <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                          )}
                          <span className="text-cream">
                            {car.brand} {car.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-silver">{car.year}</td>
                      <td className="px-4 py-3 text-silver">
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          maximumFractionDigits: 0,
                        }).format(car.price)}
                      </td>
                      <td className="px-4 py-3 text-silver">{car.condition}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditingCar(car);
                              setModalOpen(true);
                            }}
                            className="text-silver transition-colors hover:text-brass-soft"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="text-silver transition-colors hover:text-signal"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "settings" && <SettingsForm initialSettings={initialSettings} />}

      <CarFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCar(null);
        }}
        onSaved={upsertCar}
        editingCar={editingCar}
      />
    </div>
  );
}

function SettingsForm({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const [form, setForm] = useState({
    shop_name: initialSettings?.shop_name ?? "",
    address: initialSettings?.address ?? "",
    phone: initialSettings?.phone ?? "",
    whatsapp: initialSettings?.whatsapp ?? "",
    map_url: initialSettings?.map_url ?? "",
    hero_eyebrow: initialSettings?.hero_eyebrow ?? "Premium cars / Trusted dealer",
    hero_heading: initialSettings?.hero_heading ?? "Find the car that fits your drive.",
    hero_subtext:
      initialSettings?.hero_subtext ??
      "Quality vehicles, verified condition, and transparent deals. Your next car is just a few clicks away.",
    about_tagline:
      initialSettings?.about_tagline ??
      "Quality used vehicles at competitive prices. Browse our collection and find your perfect car today.",
    about_paragraph:
      initialSettings?.about_paragraph ??
      "We are proud to offer first class customer service and competitive pricing on every car we sell.",
  });
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings?.hero_image_url ?? "");
  const [logoUrl, setLogoUrl] = useState(initialSettings?.logo_url ?? "");
  const [aboutImageUrl, setAboutImageUrl] = useState(initialSettings?.about_image_url ?? "");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadImage(
    file: File,
    setUploading: (v: boolean) => void,
    setUrl: (v: string) => void
  ) {
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(path, file);

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("car-images").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const supabase = createClient();

    const payload = {
      ...form,
      hero_image_url: heroImageUrl || null,
      logo_url: logoUrl || null,
      about_image_url: aboutImageUrl || null,
    };

    const { error: saveError } = initialSettings?.id
      ? await supabase.from("site_settings").update(payload).eq("id", initialSettings.id)
      : await supabase.from("site_settings").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
      <p className="text-xs uppercase tracking-widest text-silver/70">Shop details</p>
      <Field label="Shop name">
        <input
          value={form.shop_name}
          onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Address">
        <textarea
          rows={2}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="input resize-none"
        />
      </Field>
      <Field label="Phone">
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="WhatsApp number">
        <input
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="input"
          placeholder="+923000000000"
        />
      </Field>
      <Field label="Google Maps link (optional)">
        <input
          value={form.map_url}
          onChange={(e) => setForm({ ...form, map_url: e.target.value })}
          className="input"
          placeholder="https://maps.google.com/..."
        />
      </Field>

      <div className="hud-rule !my-6" />
      <p className="text-xs uppercase tracking-widest text-silver/70">Homepage banner</p>

      <Field label="Small label above heading">
        <input
          value={form.hero_eyebrow}
          onChange={(e) => setForm({ ...form, hero_eyebrow: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Main heading">
        <input
          value={form.hero_heading}
          onChange={(e) => setForm({ ...form, hero_heading: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Subtext">
        <textarea
          rows={2}
          value={form.hero_subtext}
          onChange={(e) => setForm({ ...form, hero_subtext: e.target.value })}
          className="input resize-none"
        />
      </Field>

      <Field label="Banner photo (shows behind the homepage heading)">
        <ImageUploadField
          url={heroImageUrl}
          uploading={uploadingHero}
          onUpload={(file) => uploadImage(file, setUploadingHero, setHeroImageUrl)}
          onRemove={() => setHeroImageUrl("")}
        />
      </Field>

      <Field label="Logo (shown top-right of the banner)">
        <ImageUploadField
          url={logoUrl}
          uploading={uploadingLogo}
          onUpload={(file) => uploadImage(file, setUploadingLogo, setLogoUrl)}
          onRemove={() => setLogoUrl("")}
        />
      </Field>

      <div className="hud-rule !my-6" />
      <p className="text-xs uppercase tracking-widest text-silver/70">
        About section (shows below the banner)
      </p>

      <Field label="Tagline">
        <textarea
          rows={2}
          value={form.about_tagline}
          onChange={(e) => setForm({ ...form, about_tagline: e.target.value })}
          className="input resize-none"
        />
      </Field>
      <Field label="Paragraph (each line becomes its own paragraph)">
        <textarea
          rows={5}
          value={form.about_paragraph}
          onChange={(e) => setForm({ ...form, about_paragraph: e.target.value })}
          className="input resize-none"
        />
      </Field>
      <Field label="About photo">
        <ImageUploadField
          url={aboutImageUrl}
          uploading={uploadingAbout}
          onUpload={(file) => uploadImage(file, setUploadingAbout, setAboutImageUrl)}
          onRemove={() => setAboutImageUrl("")}
        />
      </Field>

      {error && <p className="text-sm text-signal">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploadingHero || uploadingLogo || uploadingAbout}
        className="rounded-sm bg-brass px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brass-soft disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
      {saved && <span className="ml-3 text-sm text-success">Saved.</span>}
    </form>
  );
}

function ImageUploadField({
  url,
  uploading,
  onUpload,
  onRemove,
}: {
  url: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {url ? (
        <div className="group relative h-20 w-28 overflow-hidden rounded-sm border border-steel-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute inset-0 flex items-center justify-center bg-asphalt/70 text-xs text-signal opacity-0 transition-opacity group-hover:opacity-100"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-steel-soft text-silver transition-colors hover:border-brass hover:text-brass-soft">
          <span className="text-xs">{uploading ? "Uploading…" : "Upload"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
        {label}
      </span>
      {children}
    </label>
  );
}