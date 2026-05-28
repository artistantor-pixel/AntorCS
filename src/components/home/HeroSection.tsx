"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-28 md:pt-0 md:pb-0"
    >
      {/* ── SIMPLE GRADIENT BACKGROUND ── */}
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
            ease: "easeInOut"
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
            delay: 2
          }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(220,38,38,0.06),transparent)]" 
        />
      </div>

      {/* ── HERO CONTENT ── */}
      <motion.div
        style={{ y: yHero, opacity: opacityHero }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center"
      >

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.15] mb-6 max-w-4xl"
        >
          <span className="font-serif block font-light text-brand-red">
            {t("hero.title_1")}
          </span>
          <span className="font-sans font-bold block text-foreground">
            {t("hero.title_2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-muted md:text-xl max-w-2xl mx-auto mb-10 font-light"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/hire"
            className="bg-brand-red text-white px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-3 font-medium shadow-xl shadow-brand-red/20 w-full sm:w-auto justify-center"
          >
            {t("hero.cta")} <ArrowRight size={18} />
          </Link>
          <a
            href="/ANTOR_KUMAR_BISWAS.pdf"
            download="ANTOR_KUMAR_BISWAS.pdf"
            className="bg-surface/70 backdrop-blur-sm border border-brand-red text-brand-red px-8 py-4 rounded-full hover:bg-brand-red/10 hover:scale-105 transition-all duration-300 flex items-center gap-3 font-medium w-full sm:w-auto justify-center"
          >
            {t("hero.download_cv")} <Download size={18} />
          </a>
        </motion.div>

        {/* Workspace Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <Link href="/workspace" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/5 border border-brand-red/20 hover:border-brand-red/50 hover:bg-brand-red/10 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <span className="text-xs font-semibold text-muted group-hover:text-brand-red transition-colors">
              Live Creative Workspace
            </span>
            <ArrowRight size={12} className="text-brand-red opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
          </Link>
        </motion.div>
      </motion.div>


    </section>
  );
}
