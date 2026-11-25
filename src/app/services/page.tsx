"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Palette,
  LayoutTemplate,
  PenTool,
  Film,
  Box,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { EXPERTISE_LIST, type ExpertiseIconName } from "@/config/expertise";

const ICON_MAP: Record<ExpertiseIconName, typeof Palette> = {
  palette: Palette,
  layout: LayoutTemplate,
  pen: PenTool,
  film: Film,
  box: Box,
  lightbulb: Lightbulb,
};

export default function ServicesPage() {
  const { lang, t } = useLanguage();

  return (
    <main className="min-h-screen bg-transparent text-foreground pt-32 pb-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16 space-y-5"
        >
          <span className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            {lang === "bn" ? "সব সার্ভিস ও দক্ষতা" : "Creative Services"}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight">
            {t("services.title")}
          </h1>
          <p className="text-muted text-lg leading-relaxed">{t("services.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERTISE_LIST.map((service, idx) => {
            const Icon = ICON_MAP[service.icon];
            const content = lang === "bn" ? service.bn : service.en;

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="bg-surface border border-border colorful-card p-8 rounded-3xl flex flex-col h-full group transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:border-brand-red/40"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center text-foreground group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-mono font-bold text-muted bg-background border border-border px-3 py-1 rounded-full">
                      {content.timeline}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 group-hover:text-brand-red transition-colors">
                    {content.title}
                  </h2>
                  <p className="text-muted leading-relaxed flex-1 mb-6">{content.shortDesc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-background border border-border text-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/60 text-sm font-bold tracking-widest uppercase text-muted group-hover:text-brand-red transition-colors">
                    <span>{t("services.explore")}</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
