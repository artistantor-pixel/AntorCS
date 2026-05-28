"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categories = ["All", "Branding", "Motion Design", "3D Animation", "Creative Direction", "UI/UX"];

function ProjectCard({ project, index, t }: { project: any, index: number, t: (key: string) => string }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const spanClass = 
    project.size === "large" ? "md:col-span-8 md:row-span-2" :
    project.size === "medium" ? "md:col-span-4 md:row-span-2" :
    "md:col-span-4 md:row-span-1";

  return (
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`${spanClass} w-full h-full relative group bg-surface border border-border overflow-hidden rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-brand-red/10 transition-all duration-500`}
    >
      <Link href={`/portfolio/${project.slug}`} className="block w-full h-full p-2">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <motion.div style={{ y }} className="absolute inset-0 z-0 overflow-hidden h-[110%] -top-[5%]">
            <img 
              src={project.image} 
              alt={t(`portfolio.projects.${project.titleKey}`)}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 opacity-60 group-hover:opacity-90" />
          
          <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
            <ArrowUpRight className="text-brand-red" size={20} />
          </div>

          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end pointer-events-none">
            <motion.div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <p className="text-white text-xs tracking-widest uppercase font-bold bg-brand-red/90 px-2 py-1 rounded">{t(`portfolio.categories.${project.categoryKey}`)}</p>
                <p className="text-white/70 text-xs tracking-widest font-medium">{project.year}</p>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-serif">
                {project.title}
              </h3>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setProjects(data);
      });
  }, []);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.catId === filter);

  return (
    <main className="relative min-h-screen pt-32 pb-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <span className="text-brand-red text-sm tracking-[0.2em] uppercase mb-4 font-bold inline-block px-4 py-1.5 border border-brand-red/20 rounded-full bg-brand-red/5">
            {t('portfolio.badge')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-serif">
            {t('portfolio.title_1')} <span className="text-brand-red font-light italic">{t('portfolio.title_2')}</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto mb-12">
            {t('portfolio.subtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {categories.map((cat) => {
              const catKey = cat.toLowerCase().replace(" ", "").replace("/", "");
              const displayCat = cat === "All" ? t('portfolio.categories.all') : t(`portfolio.categories.${catKey}`);
              
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-bold ${
                    filter === cat 
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" 
                      : "bg-surface text-muted border border-border hover:border-brand-red/30 hover:text-foreground"
                  }`}
                >
                  {displayCat}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[350px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} t={t} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
