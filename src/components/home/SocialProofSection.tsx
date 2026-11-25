"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

const DEFAULT_ORGANIZATIONS = [
  "Canvas",
  "Deepto TV",
  "ICT Division",
  "Bisorgo Technology",
  "CCJ-B",
  "Radiant Pharma",
  "University of Dhaka",
];

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
    <section className="w-full border-y border-border bg-surface/50 py-10 mb-28">
      <div className={`max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6 transition-opacity duration-500 ${isLoading ? 'opacity-40' : 'opacity-85'}`}>
        <p className="text-xs font-bold tracking-widest uppercase text-muted whitespace-nowrap">
          {t('social_proof.title')}
        </p>
        <div className="flex flex-wrap justify-center lg:justify-end gap-x-8 gap-y-3 w-full">
          {logos.map((logo, i) => (
            <span key={i} className="text-lg md:text-xl font-black tracking-tight text-foreground/80 whitespace-nowrap">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
