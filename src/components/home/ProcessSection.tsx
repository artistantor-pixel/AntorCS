"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function ProcessSection() {
  const { t } = useLanguage();
  return (
    <section className="w-full bg-surface py-32 mb-32 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">{t("process.title")}</h2>
          <p className="text-muted max-w-2xl mx-auto">{t("process.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <span className="text-6xl font-serif text-brand-tan/20 absolute -top-8 -left-4 z-0">0{i + 1}</span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">{t(`process.steps.${i}.title`)}</h3>
                <p className="text-muted text-sm">{t(`process.steps.${i}.desc`)}</p>
              </div>
              {i < 3 && <div className="hidden md:block absolute top-4 -right-4 w-8 h-[1px] bg-border" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
