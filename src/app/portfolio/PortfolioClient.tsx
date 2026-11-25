"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, Sparkles, Grid3X3, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { PortfolioProject } from "@/lib/portfolio-loader";

const categories = [
  "All",
  "Branding",
  "Motion Design",
  "3D Animation",
  "Creative Direction",
  "UI/UX",
  "Social Media Design",
];

const catKeyMap: Record<string, string> = {
  All: "all",
  Branding: "branding",
  "Motion Design": "motion",
  "3D Animation": "animation3d",
  "Creative Direction": "creative",
  "UI/UX": "uiux",
  "Social Media Design": "social",
};

const catColors: Record<string, string> = {
  Branding: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "Motion Design": "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "3D Animation": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "Creative Direction": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "UI/UX": "bg-pink-500/10 text-pink-700 border-pink-500/20",
  "Social Media Design": "bg-brand-red/10 text-brand-red border-brand-red/20",
};

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const catColor =
    catColors[project.catId] || "bg-brand-red/10 text-brand-red border-brand-red/20";

  const sourceLabel =
    project.source === "drive"
      ? project.videos?.length
        ? `${project.videos.length} Videos`
        : project.pdfPreviewUrl
        ? "PDF Portfolio"
        : `${project.gallery?.length || 10} Works`
      : "Case Study";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.35) }}
      className="h-full"
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className="bg-surface border border-border colorful-card rounded-3xl overflow-hidden flex flex-col h-full group shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-heavy/40">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-gradient-to-r from-surface-heavy/30 via-surface-heavy/60 to-surface-heavy/30 animate-pulse" />
          )}

          {!imgError && project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading={index < 6 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-heavy via-background to-surface">
              <div className="text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mx-auto mb-2">
                  <Layers size={20} className="text-brand-red" />
                </div>
                <p className="text-muted text-xs font-medium">{project.catId}</p>
              </div>
            </div>
          )}

          {/* Subtle top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-white/90 backdrop-blur-md shadow-sm ${catColor}`}
            >
              {project.catId}
            </span>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/90 text-foreground border border-border backdrop-blur-md shadow-sm">
              {sourceLabel}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-[11px] text-muted font-medium">
              <span className="truncate">{project.client || project.role || "Antor Biswas"}</span>
              <span className="font-mono shrink-0">{project.year}</span>
            </div>

            <h3 className="text-xl font-serif font-bold text-foreground leading-snug line-clamp-2 group-hover:text-brand-red transition-colors">
              {project.title}
            </h3>

            {project.overview && (
              <p className="text-sm text-muted leading-relaxed line-clamp-2">
                {project.overview}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted group-hover:text-brand-red transition-colors">
            <span>View Project</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border bg-surface shadow-sm">
      <span className="text-brand-red font-black text-base leading-none">{value}</span>
      <span className="text-muted text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function PortfolioClient({
  initialProjects,
}: {
  initialProjects: PortfolioProject[];
}) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { lang, t } = useLanguage();
  const isBn = lang === "bn";

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return initialProjects.filter((p) => {
      const matchesCat = filter === "All" || p.catId === filter;
      const matchesText =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.overview || "").toLowerCase().includes(q) ||
        (p.client || "").toLowerCase().includes(q) ||
        (p.catId || "").toLowerCase().includes(q);
      return matchesCat && matchesText;
    });
  }, [initialProjects, filter, searchQuery]);

  const uniqueCats = [...new Set(initialProjects.map((p) => p.catId))].length;

  return (
    <main className="relative min-h-screen pt-28 md:pt-36 pb-28 bg-transparent text-foreground overflow-hidden">
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-24 left-1/3 w-[520px] h-[520px] bg-brand-red/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-32 right-1/4 w-[420px] h-[420px] bg-brand-tan/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-red/25 bg-brand-red/10 text-brand-red text-xs font-bold tracking-wider uppercase mb-5">
            <Sparkles size={12} />
            {t("portfolio.badge")}
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight font-serif leading-[1.06] mb-5">
            {t("portfolio.title_1")}{" "}
            <span className="text-brand-red font-light italic">
              {t("portfolio.title_2")}
            </span>
          </h1>

          <p className="text-muted max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-8">
            {t("portfolio.subtitle")}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <StatBadge value={`${initialProjects.length}`} label={isBn ? "মোট প্রজেক্ট" : "Total Works"} />
            <StatBadge value={`${uniqueCats}`} label={isBn ? "ক্যাটাগরি" : "Categories"} />
            <StatBadge value="Drive" label="Showcases + Case Studies" />
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBn ? "প্রজেক্ট, ক্লায়েন্ট বা ক্যাটাগরি খুঁজুন..." : "Search works, clients, or categories..."
                }
                className="w-full bg-surface border border-border focus:border-brand-red rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted/70 focus:outline-none shadow-sm transition-colors"
              />
            </div>

            <div className="inline-flex flex-wrap justify-center gap-1.5 bg-surface border border-border p-1.5 rounded-2xl shadow-sm">
              {categories.map((cat) => {
                const catKey = catKeyMap[cat] || cat.toLowerCase();
                const translated = t(`portfolio.categories.${catKey}`);
                const displayCat = translated.startsWith("portfolio.categories.") ? cat : translated;
                const isActive = filter === cat;
                const count =
                  cat === "All"
                    ? initialProjects.length
                    : initialProjects.filter((p) => p.catId === cat).length;

                if (cat !== "All" && count === 0) return null;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
                        : "text-muted hover:text-foreground hover:bg-background"
                    }`}
                  >
                    <span>{displayCat}</span>
                    <span
                      className={`text-[10px] font-mono tabular-nums ${
                        isActive ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl py-20 px-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto">
              <Grid3X3 size={22} className="text-muted" />
            </div>
            <p className="text-base font-bold text-foreground">
              {isBn ? "এই ক্যাটাগরিতে কোনো কাজ পাওয়া যায়নি" : "No matching works found"}
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter("All");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-full bg-background border border-border text-xs font-bold hover:border-brand-red cursor-pointer"
            >
              {isBn ? "সব কাজ দেখুন" : "Show All Works"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={`${project.id}-${project.slug}`} project={project} index={index} />
            ))}
          </div>
        )}

        {/* BOTTOM CTA */}
        {filteredProjects.length > 0 && (
          <div className="mt-20 text-center space-y-4">
            <p className="text-muted text-sm font-medium">
              {isBn
                ? "আমার গুগল ড্রাইভে সকল মূল ফাইল ও সম্পূর্ণ আর্কাইভ দেখুন"
                : "Browse source archives and full-resolution files on Google Drive"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://drive.google.com/drive/folders/11gnUtx_ekf8B67Fuxs4-FK31roBToq6C"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-border bg-surface text-foreground hover:border-brand-red/40 hover:text-brand-red transition-all duration-300 text-sm font-bold shadow-sm group"
              >
                <Layers size={15} className="text-brand-red" />
                <span>{isBn ? "গুগল ড্রাইভ আর্কাইভ খুলুন" : "Open Google Drive Archive"}</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-red text-white hover:bg-foreground transition-all duration-300 text-sm font-bold shadow-sm"
              >
                <span>{isBn ? "হায়ার বা প্রজেক্টের জন্য যোগাযোগ" : "Hire Me"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
