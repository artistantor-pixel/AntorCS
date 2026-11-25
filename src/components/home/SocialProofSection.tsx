"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_ORGANIZATIONS = [
  "Canvas",
  "Mont Marte",
  "Deepto TV",
  "ICT Division",
  "Bisorgo Technology",
  "CCJ-B",
  "Radiant Pharma",
  "University of Dhaka",
];

interface OrgLogoConfig {
  src: string;
  /** "wordmark" logos already carry the full brand name; "emblem" logos sit beside text. */
  variant: "wordmark" | "emblem";
  imgClass: string;
}

const ORG_LOGOS: Record<string, OrgLogoConfig> = {
  Canvas: {
    src: "/logos/canvas.png",
    variant: "wordmark",
    imgClass: "h-4 sm:h-5 w-auto object-contain",
  },
  "Mont Marte": {
    src: "/logos/mont-marte.jpg",
    variant: "wordmark",
    imgClass: "h-8 sm:h-9 w-auto object-contain mix-blend-multiply",
  },
  "Deepto TV": {
    src: "/logos/deepto-tv.svg",
    variant: "emblem",
    imgClass: "h-6 w-6 object-contain",
  },
  "ICT Division": {
    src: "/logos/ict-division.png",
    variant: "emblem",
    imgClass: "h-6 w-6 object-contain",
  },
  "Bisorgo Technology": {
    src: "/logos/bisorgo.png",
    variant: "wordmark",
    imgClass: "h-5 sm:h-6 w-auto object-contain",
  },
  "Radiant Pharma": {
    src: "/logos/radiant.png",
    variant: "wordmark",
    imgClass: "h-6 sm:h-7 w-auto object-contain",
  },
  "University of Dhaka": {
    src: "/logos/dhaka-university.svg",
    variant: "emblem",
    imgClass: "h-6 w-6 object-contain",
  },
};

export default function SocialProofSection() {
  const { t } = useLanguage();
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
            const merged = [...data];
            if (!merged.includes("Mont Marte")) merged.splice(1, 0, "Mont Marte");
            setLogos(merged);
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
    <section className="w-full border-y border-border/60 bg-white/40 backdrop-blur-sm py-9 md:py-11 mb-24">
      <div
        className={`max-w-7xl mx-auto px-6 flex flex-col items-center gap-6 transition-opacity duration-500 ${
          isLoading ? "opacity-65" : "opacity-100"
        }`}
      >
        {/* Minimal Centered Eyebrow */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted text-center">
            {t("social_proof.title")}
          </p>
        </div>

        {/* Clean Minimal Logo Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 w-full">
          {logos.map((org, idx) => {
            const config = ORG_LOGOS[org];

            return (
              <motion.div
                key={`${org}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.25) }}
                title={org}
                className="group h-12 px-4 sm:px-5 rounded-full bg-white/80 hover:bg-white border border-border/75 hover:border-brand-red/30 shadow-[0_2px_10px_rgba(28,27,24,0.02)] hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2.5 grayscale-[30%] opacity-90 hover:grayscale-0 hover:opacity-100"
              >
                {config ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={config.src}
                      alt={org}
                      className={`${config.imgClass} shrink-0 transition-transform duration-300 group-hover:scale-105`}
                      loading="lazy"
                    />
                    {config.variant === "emblem" && (
                      <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
                        {org}
                      </span>
                    )}
                  </>
                ) : org === "CCJ-B" ? (
                  <>
                    <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                      <Leaf size={13} />
                    </span>
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
                      CCJ-B
                    </span>
                  </>
                ) : (
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
                    {org}
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
