"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CtaSection() {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-6xl mx-auto px-6 mb-32">
      <div className="bg-brand-red text-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-tan/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">{t("cta.title")}</h2>
          <p className="text-white/80 md:text-xl max-w-2xl mx-auto mb-10">{t("cta.subtitle")}</p>
          <Link href="/contact" className="inline-flex bg-white text-brand-red px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
