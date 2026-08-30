import { Star } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

export async function generateMetadata() {
  return { title: "Reseñas" };
}

export default async function ReviewsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from("google_reviews")
    .select("id, author_name, author_photo_url, rating, review_text, review_date")
    .order("display_order");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold">{dict.nav.reviews}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews?.map((review) => (
          <GlassCard key={review.id}>
            <div className="flex gap-1 text-yellow-400" aria-label={`${review.rating} de 5 estrellas`}>
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="mt-3 text-sm opacity-80">"{review.review_text}"</p>
            <p className="mt-4 text-sm font-medium">{review.author_name}</p>
            {review.review_date && (
              <p className="text-xs opacity-60">{new Date(review.review_date).toLocaleDateString(params.locale)}</p>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
