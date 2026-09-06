"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Grid3X3, LayoutList } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categories = ["All", "Branding", "Motion Design", "3D Animation", "Creative Direction", "UI/UX"];

const catKeyMap: Record<string, string> = {
  "All": "all",
  "Branding": "branding",
  "Motion Design": "motion",
  "3D Animation": "animation3d",
  "Creative Direction": "creative",
  "UI/UX": "uiux",
};

const catColors: Record<string, string> = {
  "Branding": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Motion Design": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "3D Animation": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Creative Direction": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "UI/UX": "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

// Animated card that reveals on scroll
function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isLarge = project.size === "large";
  const isMedium = project.size === "medium";

  const catColor = catColors[project.catId] || "bg-rose-500/20 text-rose-300 border-rose-500/30";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative ${isLarge ? "md:col-span-2" : ""}`}
    >
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111] hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/40">

          {/* Image Area */}
          <div className={`relative overflow-hidden ${isLarge ? "aspect-[16/9]" : isMedium ? "aspect-[4/3]" : "aspect-square"} bg-[#0a0a0a]`}>
            
            {/* Shimmer skeleton while loading */}
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] animate-pulse" />
            )}

            {!imgError && project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                loading={index < 4 ? "eager" : "lazy"}
              />
            ) : (
              // Beautiful fallback when no image
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                <div className="text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-white/30" />
                  </div>
                  <p className="text-white/20 text-sm font-light">Creative Work</p>
                </div>
              </div>
            )}

            {/* Gradient overlay — always visible at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

            {/* Hover arrow */}
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 group-hover:bg-red-500 group-hover:border-red-500">
              <ArrowUpRight size={15} className="text-white" />
            </div>

            {/* Category badge — always visible */}
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border backdrop-blur-md ${catColor}`}>
                {project.catId}
              </span>
            </div>
          </div>

          {/* Text Content — ALWAYS visible below image */}
          <div className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                  {project.title}
                </h3>
                {project.overview && (
                  <p className="text-white/40 text-xs leading-relaxed mt-1.5 line-clamp-2 font-light">
                    {project.overview}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-white/25 text-[11px] font-medium tabular-nums mt-0.5">
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Stats ticker
function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur-sm">
      <span className="text-brand-red font-bold text-lg leading-none">{value}</span>
      <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function PortfolioClient({ initialProjects }: { initialProjects: any[] }) {
  const [filter, setFilter] = useState("All");
  const { t } = useLanguage();

  const filteredProjects =
    filter === "All"
      ? initialProjects
      : initialProjects.filter((p) => p.catId === filter);

  const uniqueCats = [...new Set(initialProjects.map((p) => p.catId))].length;

  return (
    <main className="relative min-h-screen pt-28 md:pt-36 pb-32 bg-background overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-red-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-red/25 bg-brand-red/8 text-brand-red text-[11px] font-bold tracking-[0.2em] uppercase mb-6"
          >
            <Sparkles size={11} className="animate-pulse" />
            {t("portfolio.badge")}
          </motion.span>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-serif leading-[1.05] mb-5">
            {t("portfolio.title_1")}{" "}
            <span className="text-brand-red font-light italic">
              {t("portfolio.title_2")}
            </span>
          </h1>

          <p className="text-muted max-w-lg mx-auto text-sm md:text-base leading-relaxed font-light mb-8">
            {t("portfolio.subtitle")}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <StatBadge value={`${initialProjects.length}`} label="Projects" />
            <StatBadge value={`${uniqueCats}`} label="Categories" />
            <StatBadge value="Live" label="Behance Sync" />
          </div>

          {/* ── FILTERS ── */}
          <div className="inline-flex flex-wrap justify-center gap-1.5 bg-white/[0.03] border border-white/[0.07] p-1.5 rounded-2xl backdrop-blur-md">
            {categories.map((cat) => {
              const catKey = catKeyMap[cat] || cat.toLowerCase();
              const displayCat = t(`portfolio.categories.${catKey}`);
              const isActive = filter === cat;
              const count =
                cat === "All"
                  ? initialProjects.length
                  : initialProjects.filter((p) => p.catId === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-250 flex items-center gap-2 ${
                    isActive
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/25"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {displayCat}
                  {count > 0 && (
                    <span className={`text-[10px] tabular-nums ${isActive ? "text-white/70" : "text-white/25"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── GRID ── */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Grid3X3 size={24} className="text-white/20" />
              </div>
              <p className="text-white/30 font-light">No works found in this category.</p>
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTTOM CTA ── */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 text-center"
          >
            <p className="text-white/30 text-sm mb-4 font-light">
              See all work on Behance
            </p>
            <a
              href="https://www.behance.net/antorkumarbiswas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300 text-sm font-medium group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#1769ff]">
                <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H13.96c.13 2.344 1.867 2.587 3.108 2.587 1.22 0 2.27-.734 2.658-1.558zm-5.648-5.078H18.5c-.184-1.587-1.3-2.084-2.408-2.084-1.244 0-2.258.59-2.514 2.084zM7.484 0C10.61 0 12 1.897 12 4.192 12 6.098 10.997 7.43 9.188 7.812 11.212 8.128 12.5 9.586 12.5 11.9c0 2.808-2.087 4.1-5.199 4.1H0V0h7.484zm-.404 6.699c1.462 0 2.297-.54 2.297-1.82 0-1.276-.803-1.879-2.274-1.879H2.556v3.699h4.524zm.299 6.408c1.64 0 2.586-.659 2.586-2.118 0-1.425-.944-2.021-2.713-2.021H2.556v4.139h4.823z"/>
              </svg>
              behance.net/antorkumarbiswas
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        )}
      </div>
    </main>
  );
}
