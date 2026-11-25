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
  const { lang, t } = useLanguage();
  const isBn = lang === "bn";
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

  const fallbackHighlights: Review[] = [
    {
      id: "highlight-1",
      clientName: t("testimonials.name"),
      role: t("testimonials.role"),
      content: t("testimonials.review"),
      rating: 5,
    },
    {
      id: "highlight-2",
      clientName: isBn ? "কাইয়ুম চৌধুরী স্মৃতি পুরস্কার" : "Qayyum Chowdhury Memorial Award",
      role: isBn ? "বার্ষিক প্রদর্শনী, ঢাকা বিশ্ববিদ্যালয় (২০২৫)" : "Graphic Design Annual Exhibition, DU (2025)",
      content: isBn
        ? "ঢাকা বিশ্ববিদ্যালয়ের গ্রাফিক ডিজাইন বিভাগের বার্ষিক প্রদর্শনীতে ভিজ্যুয়াল কমিউনিকেশন ও শৈল্পিক দক্ষতার স্বীকৃতিস্বরূপ সম্মাননা অর্জন।"
        : "Awarded for artistic excellence and visual storytelling at the Graphic Design Department Annual Exhibition, University of Dhaka.",
      rating: 5,
    },
    {
      id: "highlight-3",
      clientName: isBn ? "স্পেশাল মেনশন অ্যাওয়ার্ড (TIB)" : "Special Mention Award — TIB",
      role: isBn ? "২০তম দুর্নীতিবিরোধী কার্টুন প্রতিযোগিতা (২০২৫)" : "20th Anti-Corruption Cartoon Competition (2025)",
      content: isBn
        ? "ডিজিটাল কার্টুন ক্যাটাগরিতে প্রভাবশালী ভিজ্যুয়াল কমেন্টারি এবং স্টোরিটেলিংয়ের জন্য ট্রান্সপারেন্সি ইন্টারন্যাশনাল বাংলাদেশ কর্তৃক সম্মানিত।"
        : "Recognized by Transparency International Bangladesh in the Digital Cartoon category for impactful visual commentary.",
      rating: 5,
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackHighlights;

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
