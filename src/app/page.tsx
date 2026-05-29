"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Section components
import HeroSection from "@/components/home/HeroSection";
import SocialProofSection from "@/components/home/SocialProofSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesSection from "@/components/home/ServicesSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import CtaSection from "@/components/home/CtaSection";
import FooterSection from "@/components/home/FooterSection";

export default function Home() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  const [sectionsConfig, setSectionsConfig] = useState<any[]>([
    { id: "hero",         enabled: true, order: 1 },
    { id: "socialProof",  enabled: true, order: 2 },
    { id: "features",     enabled: true, order: 3 },
    { id: "services",     enabled: true, order: 4 },
    { id: "experience",   enabled: true, order: 5 },
    { id: "process",      enabled: true, order: 6 },
    { id: "testimonials", enabled: true, order: 7 },
    { id: "faqs",         enabled: true, order: 8 },
    { id: "cta",          enabled: true, order: 9 },
    { id: "footer",       enabled: true, order: 10 },
  ]);

  useEffect(() => {
    // Increment visitor count on visit
    fetch("/api/visitors", { method: "POST" }).catch(() => {});

    fetch("/api/home-config")
      .then((res) => res.json())
      .then(setSectionsConfig)
      .catch(() => {});
  }, []);

  const sectionsMap: Record<string, React.ReactNode> = {
    hero: <HeroSection />,
    socialProof: <SocialProofSection />,
    features: <FeaturesSection />,
    services: <ServicesSection />,
    experience: <ExperienceSection />,
    process: <ProcessSection />,
    testimonials: <TestimonialsSection />,
    faqs: <FaqSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />,
    cta: <CtaSection />,
    footer: <FooterSection />,
  };

  const ordered = sectionsConfig
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen flex flex-col items-center overflow-hidden bg-background">
      {ordered.map((s) => (
        <section key={s.id} className="w-full">
          {sectionsMap[s.id]}
        </section>
      ))}
    </main>
  );
}
