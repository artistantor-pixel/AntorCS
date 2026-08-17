"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

export default function SocialProofSection() {
  const { t } = useLanguage();
  const [logos, setLogos] = useState<string[]>(['Vogue', 'Spotify', 'Nike', 'Netflix', 'Sony']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialProof = async () => {
      try {
        const res = await fetch("/api/social-proof");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
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
    <section className="w-full border-y border-border bg-surface/50 py-12 mb-32">
      <div className={`max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-60'}`}>
        <p className="text-sm font-bold tracking-widest uppercase text-muted whitespace-nowrap">
          {t('social_proof.title')}
        </p>
        <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-16 w-full">
          {logos.map((logo, i) => (
            <span key={i} className="text-2xl font-black tracking-tighter text-foreground whitespace-nowrap">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
