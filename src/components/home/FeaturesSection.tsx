"use client";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2 } from "lucide-react";

export default function FeaturesSection() {
  const { t } = useLanguage();
  const features = [
    { t: t('features.feat1_t'), d: t('features.feat1_d') },
    { t: t('features.feat2_t'), d: t('features.feat2_d') },
    { t: t('features.feat3_t'), d: t('features.feat3_d') },
  ];
  return (
    <section className="w-full max-w-7xl mx-auto px-6 mb-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">{t('features.title')}</h2>
        <p className="text-muted max-w-2xl mx-auto">{t('features.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat, i) => (
          <div key={i} className="bg-surface border border-border p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">{feat.t}</h3>
            <p className="text-muted leading-relaxed">{feat.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
