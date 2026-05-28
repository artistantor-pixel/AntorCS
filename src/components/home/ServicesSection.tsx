"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Palette, LayoutTemplate, Code2, Film, Box, Lightbulb, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const { t } = useLanguage();
  const services = [
    { title: t('services.items.brand.title'), desc: t('services.items.brand.desc'), icon: Palette },
    { title: t('services.items.uiux.title'), desc: t('services.items.uiux.desc'), icon: LayoutTemplate },
    { title: t('services.items.web.title'), desc: t('services.items.web.desc'), icon: Code2 },
    { title: t('services.items.motion.title'), desc: t('services.items.motion.desc'), icon: Film },
    { title: t('services.items.3d.title'), desc: t('services.items.3d.desc'), icon: Box },
    { title: t('services.items.creative.title'), desc: t('services.items.creative.desc'), icon: Lightbulb },
  ];
  return (
    <section className="w-full max-w-7xl mx-auto px-6 mb-32">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">{t('services.title')}</h2>
          <p className="text-muted">{t('services.subtitle')}</p>
        </div>
        <a href="/services" className="text-brand-red font-bold hover:underline mt-4 md:mt-0">{t('services.view_all')} →</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div key={i} className="bg-surface border border-border p-8 rounded-3xl flex flex-col group hover:border-brand-red/50 hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mb-8 text-foreground group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-colors duration-300">
              <service.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
            <p className="text-muted leading-relaxed flex-1">{service.desc}</p>
            <div className="mt-8 flex items-center text-sm font-bold tracking-widest uppercase text-muted group-hover:text-brand-red transition-colors">
              <span>{t('services.explore')}</span>
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
