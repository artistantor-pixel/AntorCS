"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function SocialProofSection() {
  const { t } = useLanguage();
  return (
    <section className="w-full border-y border-border bg-surface/50 py-12 mb-32">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
        <p className="text-sm font-bold tracking-widest uppercase text-muted">{t('social_proof.title')}</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {['Vogue', 'Spotify', 'Nike', 'Netflix', 'Sony'].map((logo, i) => (
            <span key={i} className="text-2xl font-black tracking-tighter text-foreground">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
