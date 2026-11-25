"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, Briefcase, GraduationCap, Layers, Tv } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_INFO } from "@/config/contact";

export default function HeroSection() {
  const { lang, t } = useLanguage();
  const isBn = lang === "bn";
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const highlights = [
    {
      icon: Briefcase,
      value: isBn ? "৩+ বছর" : "3+ Years",
      label: isBn ? "স্টুডিও ও প্রোডাকশন অভিজ্ঞতা" : "Studio & Brand Experience",
    },
    {
      icon: Tv,
      value: isBn ? "৩০+ কোর্স ও টিভি" : "30+ Courses & TV",
      label: isBn ? "ICT DIKKHA ও দীপ্ত টিভি" : "ICT DIKKHA & Deepto TV",
    },
    {
      icon: Layers,
      value: isBn ? "৪০+ প্রজেক্ট" : "40+ Projects",
      label: isBn ? "ব্র্যান্ডিং, মোশন ও UI" : "Branding, Motion & UI",
    },
    {
      icon: GraduationCap,
      value: isBn ? "বিএফএ ’২৬" : "BFA ’26",
      label: isBn ? "চারুকলা, ঢাকা বিশ্ববিদ্যালয়" : "Fine Arts, Univ. of Dhaka",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-background" />
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.1, 0.16, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,38,38,0.15),transparent)]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(220,38,38,0.06),transparent)]"
        />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y: yHero, opacity: opacityHero }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center"
      >
        {/* HR Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 bg-surface border border-border px-4 py-2 rounded-full text-xs font-bold text-foreground mb-7 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t("hero.badge")}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] tracking-tight leading-[1.1] mb-6 max-w-5xl"
        >
          <span className="font-serif block font-light text-brand-red">
            {t("hero.title_1")}
          </span>
          <span className="font-sans font-black block text-foreground mt-1">
            {t("hero.title_2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="text-muted text-base md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Primary HR CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-14"
        >
          <Link
            href="/hire"
            className="bg-brand-red text-white px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2.5 font-bold text-sm shadow-xl shadow-brand-red/20 w-full sm:w-auto justify-center"
          >
            {t("hero.cta")} <ArrowRight size={17} />
          </Link>
          <a
            href={CONTACT_INFO.cvPath}
            download={CONTACT_INFO.cvFileName}
            className="bg-surface/80 backdrop-blur-sm border border-brand-red text-brand-red px-8 py-4 rounded-full hover:bg-brand-red/10 hover:scale-105 transition-all duration-300 flex items-center gap-2.5 font-bold text-sm w-full sm:w-auto justify-center"
          >
            {t("hero.download_cv")} <Download size={17} />
          </a>
          <Link
            href="/portfolio"
            className="px-6 py-4 rounded-full border border-border bg-surface/60 hover:border-foreground/30 text-foreground font-bold text-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            {t("hero.view_works")}
          </Link>
        </motion.div>

        {/* HR Quick-Scan Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.value}
                className="bg-surface/85 backdrop-blur-md border border-border rounded-2xl p-4 sm:p-5 text-left flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-black text-foreground leading-tight">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-muted font-medium truncate mt-0.5">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
