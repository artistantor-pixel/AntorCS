"use client";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

interface Review {
  id: string;
  clientName: string;
  role: string;
  content: string;
  rating: number;
}

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setReviews(data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch reviews", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Use static reviews if none exist in the database or if loading
  const displayReviews = reviews.length > 0 ? reviews : [1, 2, 3].map((i) => ({
    id: `static-${i}`,
    clientName: t("testimonials.name"),
    role: t("testimonials.role"),
    content: t("testimonials.review"),
    rating: 5,
  }));

  if (isLoading && reviews.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 mb-32">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center font-serif">{t("testimonials.title")}</h2>
        <div className="flex justify-center"><p className="text-muted">Loading reviews...</p></div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-6 mb-32">
      <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center font-serif">{t("testimonials.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayReviews.slice(0, 6).map((review) => (
          <div key={review.id} className="bg-surface border border-border p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-yellow-500 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-lg italic mb-8">&quot;{review.content}&quot;</p>
            </div>
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-12 h-12 bg-surface-heavy rounded-full flex items-center justify-center font-bold text-lg text-brand-red">
                {review.clientName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold">{review.clientName}</h4>
                {review.role && <p className="text-sm text-muted">{review.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
