"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { StarDisplay, StarInput } from "@/components/StarRating";
import type { Review } from "@/types/review";

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !comment.trim()) {
      setError("Please add your name and a short review.");
      return;
    }
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("reviews")
      .insert({ name: name.trim(), rating, comment: comment.trim() })
      .select()
      .single();

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setReviews((prev) => [data as Review, ...prev]);
    setName("");
    setRating(0);
    setComment("");
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      {/* Existing reviews */}
      <div>
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="font-display text-4xl font-semibold tracking-wide text-cream">
            Customer reviews
          </h2>
          {average && (
            <span className="flex items-center gap-2 text-sm text-silver">
              <StarDisplay rating={Math.round(Number(average))} />
              {average} / 5 ({reviews.length})
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-silver">
            No reviews yet — be the first to share your experience.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
                className="rounded-md border border-steel bg-panel p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-cream">{r.name}</p>
                  <StarDisplay rating={r.rating} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-silver">{r.comment}</p>
                <p className="mt-3 text-xs text-silver/60">
                  {new Date(r.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Leave a review */}
      <div className="rounded-md border border-steel bg-panel p-6 sm:p-8">
        <h3 className="font-display text-2xl font-semibold tracking-wide text-cream">
          Leave a review
        </h3>
        <p className="mt-1 text-sm text-silver">
          Bought a car from us? Let other customers know how it went.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="John Smith"
            />
          </label>

          <div>
            <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
              Your rating
            </span>
            <StarInput value={rating} onChange={setRating} />
          </div>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
              Your review
            </span>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input resize-none"
              placeholder="Tell us about your experience…"
            />
          </label>

          {error && <p className="text-sm text-signal">{error}</p>}
          {done && (
            <p className="text-sm text-success">
              Thanks for your review — it&apos;s live below!
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-sm bg-brass px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brass-soft disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
}