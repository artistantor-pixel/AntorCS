"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tv,
  Sparkles,
  GraduationCap,
  Layers,
  Clapperboard,
  Building2,
  BookOpen,
  Briefcase,
} from "lucide-react";
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

interface OrgMeta {
  tagEn: string;
  tagBn: string;
  accent: string;
  icon: typeof Briefcase;
}

const ORG_META: Record<string, OrgMeta> = {
  Canvas: {
    tagEn: "Visual & Creative Design",
    tagBn: "ভিজ্যুয়াল ও ক্রিয়েটিভ ডিজাইন",
    accent: "from-rose-500/15 to-brand-red/5 text-brand-red border-brand-red/20",
    icon: Sparkles,
  },
  "Deepto TV": {
    tagEn: "Broadcast Motion & 3D",
    tagBn: "ব্রডকাস্ট মোশন ও ৩ডি",
    accent: "from-amber-500/15 to-orange-500/5 text-amber-700 border-amber-500/20",
    icon: Tv,
  },
  "ICT Division": {
    tagEn: "National EdTech & DIKKHA",
    tagBn: "জাতীয় ই-লার্নিং ও দীক্ষা",
    accent: "from-emerald-500/15 to-teal-500/5 text-emerald-700 border-emerald-500/20",
    icon: BookOpen,
  },
  "Bisorgo Technology": {
    tagEn: "UI Systems & Brand Motion",
    tagBn: "UI সিস্টেম ও ব্র্যান্ড মোশন",
    accent: "from-blue-500/15 to-indigo-500/5 text-blue-700 border-blue-500/20",
    icon: Layers,
  },
  "CCJ-B": {
    tagEn: "Documentary & Visual Media",
    tagBn: "ডকুমেন্টারি ও ভিজ্যুয়াল মিডিয়া",
    accent: "from-violet-500/15 to-purple-500/5 text-violet-700 border-violet-500/20",
    icon: Clapperboard,
  },
  "Radiant Pharma": {
    tagEn: "Corporate Brand Collateral",
    tagBn: "কর্পোরেট ব্র্যান্ড ডিজাইন",
    accent: "from-cyan-500/15 to-sky-500/5 text-cyan-700 border-cyan-500/20",
    icon: Building2,
  },
  "University of Dhaka": {
    tagEn: "Fine Arts & Festival Lead",
    tagBn: "চারুকলা ও ফেস্টিভ্যাল লিড",
    accent: "from-brand-tan/25 to-brand-red/5 text-foreground border-brand-tan/40",
    icon: GraduationCap,
  },
};

function getInitials(name: string): string {
  const words = name.trim().split(/[\s-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

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

  const marqueeItems = [...logos, ...logos];

  return (
    <section className="w-full py-16 md:py-24 mb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Glass Container Frame */}
        <div className="relative rounded-[2.25rem] border border-border/80 bg-white/65 backdrop-blur-xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(28,27,24,0.04)] overflow-hidden">
          {/* Subtle decorative radial wash inside card */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-red/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-tan/[0.14] blur-3xl" />

          {/* Header row */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/80 border border-border text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                <span>{isBn ? "বিশ্বস্ত কোলাবোরেশন" : "Trusted Collaborations"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">
                {t("social_proof.title")}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {isBn
                  ? "ব্রডকাস্ট মিডিয়া, জাতীয় ই-লার্নিং প্রজেক্ট, টেক স্টার্টআপ এবং চারুকলা ইভেন্টগুলোতে ব্র্যান্ডিং, মোশন ও ভিজ্যুয়াল ডিজাইনের অভিজ্ঞতা।"
                  : "Proven creative impact across broadcast television, national EdTech platforms, corporate brands, and Fine Arts cultural initiatives."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-white/90 border border-border shadow-sm text-left">
                <span className="block text-xl font-black text-brand-red leading-none">
                  {logos.length}+
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted">
                  {isBn ? "টিম ও প্রজেক্ট" : "Organizations"}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Organization Grid */}
          <div
            className={`relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 transition-opacity duration-500 ${
              isLoading ? "opacity-60" : "opacity-100"
            }`}
          >
            {logos.map((org, idx) => {
              const meta = ORG_META[org];
              const Icon = meta?.icon || Briefcase;
              const accentClass =
                meta?.accent || "from-brand-red/10 to-brand-tan/10 text-brand-red border-border";
              const subtitle = meta
                ? isBn
                  ? meta.tagBn
                  : meta.tagEn
                : isBn
                ? "ক্রিয়েটিভ প্রজেক্ট"
                : "Creative Collaboration";

              return (
                <motion.div
                  key={`${org}-${idx}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
                  className="group relative rounded-2xl border border-border/80 bg-white/85 hover:bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-[0_14px_30px_rgba(234,63,64,0.07)] flex items-center gap-3.5"
                >
                  {/* Monogram / Icon Crest */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${accentClass}`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Organization Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-foreground truncate group-hover:text-brand-red transition-colors">
                        {org}
                      </h3>
                      <span className="text-[10px] font-mono text-muted/60 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-muted truncate mt-0.5">{subtitle}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Open Seat / "Your Team Next" Card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.35 }}
            >
              <Link
                href="/hire"
                className="group h-full rounded-2xl border border-dashed border-brand-red/35 bg-gradient-to-br from-brand-red/[0.04] to-brand-tan/[0.08] hover:from-brand-red hover:to-brand-red p-4 transition-all duration-300 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-red/10 group-hover:bg-white/20 text-brand-red group-hover:text-white flex items-center justify-center font-black text-sm shrink-0 transition-colors">
                  +
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-brand-red group-hover:text-white transition-colors truncate">
                    {isBn ? "আপনার টিম?" : "Your Team Next"}
                  </h3>
                  <p className="text-[11px] font-medium text-muted group-hover:text-white/85 transition-colors truncate mt-0.5">
                    {isBn ? "ফুল-টাইম ও প্রজেক্টের জন্য প্রস্তুত" : "Open for full-time & studio roles"}
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Infinite Kinetic Typography Strip */}
          <div className="relative z-10 mt-8 pt-6 border-t border-border/60 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/90 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent z-10" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-6 w-max"
            >
              {marqueeItems.map((item, i) => (
                <div key={`${item}-strip-${i}`} className="flex items-center gap-6 shrink-0">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted/80">
                    <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[10px] font-mono text-brand-red">
                      {getInitials(item)}
                    </span>
                    <span>{item}</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-brand-tan/70" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
