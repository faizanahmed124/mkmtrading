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
            className="mb-6 flex items-center gap-2 rounded-sm bg-brass px-5 py-2.5 text-sm font-medium text-asphalt transition-colors hover:bg-brass-soft"
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
                        {new Intl.NumberFormat("en-PK", {
                          style: "currency",
                          currency: "PKR",
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
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = createClient();

    if (initialSettings?.id) {
      await supabase.from("site_settings").update(form).eq("id", initialSettings.id);
    } else {
      await supabase.from("site_settings").insert(form);
    }
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
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

      <button
        type="submit"
        disabled={saving}
        className="rounded-sm bg-brass px-6 py-2.5 text-sm font-medium text-asphalt transition-colors hover:bg-brass-soft disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
      {saved && <span className="ml-3 text-sm text-success">Saved.</span>}
    </form>
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
