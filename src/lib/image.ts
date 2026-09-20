"use client";

/**
 * Resizes and compresses an image in the browser before it's uploaded.
 * This is the single biggest lever for site speed when a car has 20-40
 * photos: a phone photo is often 4-8MB, but a car listing photo only
 * ever needs to be viewed at a few hundred to ~1600px wide.
 *
 * Returns a new File (same name, jpeg content) that's dramatically
 * smaller — typically 100-400KB instead of several MB — with no
 * visible quality loss for web viewing.
 */
export async function compressImage(
  file: File,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.8 } = {}
): Promise<File> {
  // Only compress actual images; pass anything else through untouched.
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) return file;

  // If compression somehow made it bigger (rare, tiny images), keep the original.
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}