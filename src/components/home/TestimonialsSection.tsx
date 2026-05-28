"use client";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-7xl mx-auto px-6 mb-32">
      <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center font-serif">{t("testimonials.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border p-8 rounded-3xl">
            <div className="flex gap-1 text-yellow-500 mb-6">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="text-lg italic mb-8">&quot;{t("testimonials.review")}&quot;</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-heavy rounded-full" />
              <div>
                <h4 className="font-bold">{t("testimonials.name")}</h4>
                <p className="text-sm text-muted">{t("testimonials.role")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
