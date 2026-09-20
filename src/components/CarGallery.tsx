"use client";

import { useState } from "react";

export default function CarGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-steel bg-panel text-silver/60">
        No photos yet
      </div>
    );
  }

  const activeSrc = images[active];
  const activeFailed = failed[activeSrc];

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-steel bg-panel">
        {activeFailed ? (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-silver/60">
            This photo couldn&apos;t load.
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeSrc}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setFailed((prev) => ({ ...prev, [activeSrc]: true }))}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-sm border transition-colors ${
                i === active
                  ? "border-brass"
                  : "border-steel-soft opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}