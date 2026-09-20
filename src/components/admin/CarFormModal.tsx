"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Car } from "@/types/car";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (car: Car) => void;
  editingCar: Car | null;
};

const emptyForm = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel_type: "Petrol",
  transmission: "Manual",
  color: "",
  condition: "Used",
  description: "",
  featured: false,
};

export default function CarFormModal({ open, onClose, onSaved, editingCar }: Props) {
  const [form, setForm] = useState(() =>
    editingCar
      ? {
          brand: editingCar.brand,
          model: editingCar.model,
          year: editingCar.year,
          price: editingCar.price,
          mileage: editingCar.mileage ?? 0,
          fuel_type: editingCar.fuel_type ?? "Petrol",
          transmission: editingCar.transmission ?? "Manual",
          color: editingCar.color ?? "",
          condition: editingCar.condition,
          description: editingCar.description ?? "",
          featured: editingCar.featured,
        }
      : emptyForm
  );
  const [images, setImages] = useState<string[]>(editingCar?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(path, file);

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        continue;
      }
      const { data } = supabase.storage.from("car-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = { ...form, images };

    if (editingCar) {
      const { data, error } = await supabase
        .from("cars")
        .update(payload)
        .eq("id", editingCar.id)
        .select()
        .single();
      setSaving(false);
      if (error) return setError(error.message);
      onSaved(data as Car);
    } else {
      const { data, error } = await supabase
        .from("cars")
        .insert(payload)
        .select()
        .single();
      setSaving(false);
      if (error) return setError(error.message);
      onSaved(data as Car);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-asphalt/80 px-4 py-10 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.form
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl rounded-md border border-steel-soft bg-panel-raised p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wide text-cream">
              {editingCar ? "Edit car" : "Add a new car"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-silver transition-colors hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand">
              <input
                required
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="input"
                placeholder="Toyota"
              />
            </Field>
            <Field label="Model">
              <input
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="input"
                placeholder="Corolla"
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="input"
              />
            </Field>
            <Field label="Price (£)">
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="input"
              />
            </Field>
            <Field label="Mileage (km)">
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })}
                className="input"
              />
            </Field>
            <Field label="Color">
              <input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Fuel type">
              <select
                value={form.fuel_type}
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                className="input"
              >
                {["Petrol", "Diesel", "Hybrid", "Electric"].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Transmission">
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="input"
              >
                {["Manual", "Automatic"].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Condition">
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="input"
              >
                {["New", "Used"].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <label className="mt-6 flex items-center gap-2 text-sm text-silver">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 accent-[var(--brass)]"
              />
              Show as featured on homepage
            </label>
          </div>

          <Field label="Description" className="mt-4">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
              placeholder="Well-maintained, single owner, full service history…"
            />
          </Field>

          <div className="mt-5">
            <span className="mb-2 block text-xs uppercase tracking-widest text-silver/70">
              Photos
            </span>
            <div className="flex flex-wrap gap-3">
              {images.map((url) => (
                <div key={url} className="group relative h-20 w-24 overflow-hidden rounded-sm border border-steel-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute inset-0 flex items-center justify-center bg-asphalt/70 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-signal" />
                  </button>
                </div>
              ))}
              <label className="flex h-20 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-steel-soft text-silver transition-colors hover:border-brass hover:text-brass-soft">
                <Upload className="h-4 w-4" />
                <span className="text-xs">{uploading ? "Uploading…" : "Add photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-signal">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-steel-soft px-5 py-2.5 text-sm text-silver transition-colors hover:text-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-sm bg-brass px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brass-soft disabled:opacity-60"
            >
              {saving ? "Saving…" : editingCar ? "Save changes" : "Add car"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
        {label}
      </span>
      {children}
    </label>
  );
}