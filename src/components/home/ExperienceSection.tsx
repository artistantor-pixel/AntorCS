"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function ExperienceSection() {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-7xl mx-auto px-6 mb-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">{t('experience.title')}</h2>
        <p className="text-muted max-w-2xl mx-auto">{t('experience.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border p-8 rounded-3xl flex flex-col justify-between group hover:border-brand-red/50 hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-6 text-brand-tan/10 group-hover:text-brand-red/5 transition-colors duration-300 pointer-events-none">
              <span className="text-[8rem] font-serif font-black leading-none">{i+1}</span>
            </div>
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full border border-border text-xs font-bold tracking-widest uppercase mb-8 bg-background">
                {t(`experience.jobs.${i}.period`)}
              </span>
              <h3 className="text-2xl font-bold mb-2 pr-12">{t(`experience.jobs.${i}.role`)}</h3>
              <p className="text-brand-red font-medium mb-6">{t(`experience.jobs.${i}.company`)}</p>
              <p className="text-muted leading-relaxed text-sm">{t(`experience.jobs.${i}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
