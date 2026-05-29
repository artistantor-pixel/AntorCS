"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categories = ["All", "Branding", "Motion Design", "3D Animation", "Creative Direction", "UI/UX"];

function ProjectCard({ project, index, t }: { project: any, index: number, t: (key: string) => string }) {
  const spanClass = 
    project.size === "large" ? "md:col-span-8 md:row-span-2" :
    project.size === "medium" ? "md:col-span-4 md:row-span-2" :
    "md:col-span-4 md:row-span-1";

  // Check if priority loading is needed (first 2 projects)
  const isPriority = index < 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`${spanClass} w-full h-[320px] md:h-full relative group bg-surface border border-border overflow-hidden rounded-[2rem] cursor-pointer hover:border-brand-red/40 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] transition-all duration-500`}
    >
      <Link href={`/portfolio/${project.slug}`} className="block w-full h-full p-2.5">
        <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-surface-heavy">
          
          {/* Next.js Optimized Image with Premium Fallback & Shimmer */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <ImageWithFallback 
              src={project.image} 
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isPriority}
              className="transition-transform duration-1000 group-hover:scale-105 group-hover:blur-[1px]"
              objectFit="cover"
            />
          </div>
          
          {/* Sophisticated dark gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Glassmorphic arrow icon */}
          <div className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl group-hover:bg-brand-red group-hover:border-brand-red">
            <ArrowUpRight className="text-white" size={20} />
          </div>

          {/* Project Details Overlay */}
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end pointer-events-none">
            <div className="transform transition-transform duration-500 translate-y-3 group-hover:translate-y-0">
              <div className="flex items-center gap-2.5 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span className="text-white text-[10px] tracking-[0.15em] uppercase font-bold bg-brand-red px-2.5 py-1 rounded-full shadow-lg shadow-brand-red/20">
                  {project.catId}
                </span>
                <span className="text-white/70 text-[10px] tracking-widest font-medium bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {project.year}
                </span>
              </div>
              <h3 className="text-2xl md:text-3.5xl font-bold text-white tracking-tight font-serif leading-tight">
                {project.title}
              </h3>
              <p className="text-white/60 text-xs font-light mt-2 max-w-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                {project.overview}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lang, t } = useLanguage();

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.catId === filter);

  return (
    <main className="relative min-h-screen pt-32 pb-32 bg-background overflow-hidden">
      
      {/* Visual background flares */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-rose-500/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <span className="text-brand-red text-xs tracking-[0.2em] uppercase mb-4 font-bold inline-flex items-center gap-1.5 px-4 py-1.5 border border-brand-red/20 rounded-full bg-brand-red/5 shadow-inner">
            <Sparkles size={12} className="animate-pulse" /> {t('portfolio.badge')}
          </span>
          <h1 className="text-5xl md:text-7.5xl font-bold tracking-tight mb-6 font-serif leading-[1.05]">
            {t('portfolio.title_1')}{" "}
            <span className="text-brand-red font-light italic">{t('portfolio.title_2')}</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed font-light">
            {t('portfolio.subtitle')}
          </p>
          
          {/* Glassmorphic Filters */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto bg-surface/50 p-2 rounded-[2rem] border border-border backdrop-blur-md shadow-sm">
            {categories.map((cat) => {
              const catKey = cat.toLowerCase().replace(" ", "").replace("/", "");
              const displayCat = cat === "All" ? t('portfolio.categories.all') : t(`portfolio.categories.${catKey}`);
              
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-bold ${
                    filter === cat 
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-105" 
                      : "bg-transparent text-muted hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  {displayCat}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Dynamic Grid Layout */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted text-sm font-light animate-pulse">Loading creative showcase...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-surface border border-border rounded-3xl p-12">
            <p className="text-muted font-light">No works found in this category.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[360px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} t={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
