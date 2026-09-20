"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= rating ? "fill-brass text-brass" : "text-steel-soft"}
        />
      ))}
    </div>
  );
}

export function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star
              width={26}
              height={26}
              className={filled ? "fill-brass text-brass" : "text-steel-soft"}
            />
          </button>
        );
      })}
    </div>
  );
}