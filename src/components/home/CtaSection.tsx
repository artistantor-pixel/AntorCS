"use client";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_INFO } from "@/config/contact";

export default function CtaSection() {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-6xl mx-auto px-6 mb-32">
      <div className="bg-brand-red text-white rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-tan/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-6xl font-serif mb-6">{t("cta.title")}</h2>
          <p className="text-white/85 md:text-xl max-w-2xl mx-auto mb-10">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/hire" className="inline-flex items-center gap-2 bg-white text-brand-red px-9 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl text-sm">
              <span>{t("cta.button")}</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={CONTACT_INFO.cvPath}
              download={CONTACT_INFO.cvFileName}
              className="inline-flex items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors text-sm"
            >
              <Download size={16} />
              <span>{t("cta.secondary_button")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
