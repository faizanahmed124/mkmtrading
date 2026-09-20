import { createClient } from "@/lib/supabase/server";
import ReviewsClient from "@/components/ReviewsClient";
import type { Review } from "@/types/review";

export default async function ReviewsSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <section id="reviews" className="border-t border-steel/70 bg-asphalt">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <ReviewsClient initialReviews={(data ?? []) as Review[]} />
      </div>
    </section>
  );
}