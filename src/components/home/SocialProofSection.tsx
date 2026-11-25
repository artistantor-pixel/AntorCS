"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_ORGANIZATIONS = [
  "Canvas",
  "Deepto TV",
  "ICT Division",
  "Bisorgo Technology",
  "CCJ-B",
  "Radiant Pharma",
  "University of Dhaka",
];

const ORG_ROLES: Record<string, { en: string; bn: string }> = {
  Canvas: { en: "Editorial & Visuals", bn: "ভিজ্যুয়াল ডিজাইন" },
  "Deepto TV": { en: "Broadcast & 3D", bn: "ব্রডকাস্ট ও ৩ডি" },
  "ICT Division": { en: "National EdTech", bn: "জাতীয় ই-লার্নিং" },
  "Bisorgo Technology": { en: "UI & Motion", bn: "UI ও মোশন" },
  "CCJ-B": { en: "Documentary Media", bn: "ডকুমেন্টারি মিডিয়া" },
  "Radiant Pharma": { en: "Brand Collateral", bn: "ব্র্যান্ড ডিজাইন" },
  "University of Dhaka": { en: "Fine Arts & Fest", bn: "চারুকলা ও ফেস্ট" },
};

export default function SocialProofSection() {
  const { lang, t } = useLanguage();
  const isBn = lang === "bn";
  const [logos, setLogos] = useState<string[]>(DEFAULT_ORGANIZATIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialProof = async () => {
      try {
        const res = await fetch("/api/social-proof");
        if (res.ok) {
          const data = await res.json();
          const legacySet = new Set(["Vogue", "Spotify", "Nike", "Netflix", "Sony"]);
          if (
            Array.isArray(data) &&
            data.length > 0 &&
            !data.every((item: string) => legacySet.has(item))
          ) {
            setLogos(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch social proof:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialProof();
  }, []);

  return (
    <section className="w-full border-y border-border/60 bg-white/35 backdrop-blur-sm py-10 md:py-12 mb-24">
      <div
        className={`max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-opacity duration-500 ${
          isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
        {/* Minimal Left Eyebrow */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-brand-red/80" />
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted whitespace-nowrap">
            {t("social_proof.title")}
          </p>
        </div>

        {/* Clean Minimal Organization Pills */}
        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5">
          {logos.map((org, idx) => {
            const role = ORG_ROLES[org];
            return (
              <motion.div
                key={`${org}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.25) }}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 hover:bg-white border border-border/75 hover:border-brand-red/30 shadow-[0_2px_10px_rgba(28,27,24,0.02)] hover:shadow-sm transition-all duration-300"
              >
                <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-brand-red transition-colors whitespace-nowrap">
                  {org}
                </span>
                {role && (
                  <span className="hidden sm:inline-block text-[10px] font-medium text-muted/80 border-l border-border pl-2 whitespace-nowrap">
                    {isBn ? role.bn : role.en}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
