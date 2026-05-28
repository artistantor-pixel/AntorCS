"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Puzzle, Lightbulb, PlayCircle, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categories = ["All", "Branding", "Motion Design", "3D Animation", "Creative Direction", "UI/UX"];

// Local Translations for Case Studies page
const localT: Record<string, Record<string, string>> = {
  en: {
    badge: "CASE STUDIES",
    title_1: "Stories of Creative Strategy & ",
    title_2: "Measurable Impact",
    subtitle: "A detailed breakdown of how we translate abstract challenges into bold visual experiences that deliver real-world business outcomes.",
    filter_all: "All Projects",
    problem: "The Challenge",
    solution: "Creative Solution",
    results: "Key Outcomes",
    client: "Client",
    role: "Role & Timeline",
    read_more: "Read Full Case Study",
    connect_title: "Have a design challenge?",
    connect_subtitle: "Let's co-create an extraordinary narrative that scales your business to new heights.",
    connect_btn: "Let's Work Together",
  },
  bn: {
    badge: "কেইজ স্টাডি",
    title_1: "সৃজনশীল কৌশল ও ",
    title_2: "বাস্তব ফলাফলের গল্প",
    subtitle: "বিমূর্ত ডিজাইনের চ্যালেঞ্জগুলোকে কীভাবে বাস্তবধর্মী ভিজ্যুয়াল অভিজ্ঞতা এবং ব্যবসায়িক সফলতায় রূপান্তর করা হয়েছে তার বিস্তারিত রূপরেখা।",
    filter_all: "সব প্রজেক্ট",
    problem: "মূল চ্যালেঞ্জ",
    solution: "সৃজনশীল সমাধান",
    results: "অর্জিত ফলাফল",
    client: "ক্লায়েন্ট",
    role: "ভূমিকা ও সময়কাল",
    read_more: "সম্পূর্ণ কেইজ স্টাডি দেখুন",
    connect_title: "আপনার কি কোনো ভিজ্যুয়াল চ্যালেঞ্জ আছে?",
    connect_subtitle: "চলুন একসাথে এমন একটি গল্প তৈরি করি যা আপনার ব্র্যান্ডকে এক অনন্য উচ্চতায় নিয়ে যাবে।",
    connect_btn: "একত্রে কাজ শুরু করুন",
  }
};

export default function CaseStudiesPage() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lang, t } = useLanguage();

  const currentT = localT[lang] || localT["en"];

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects for case studies:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.catId === filter);

  return (
    <main className="relative min-h-screen pt-32 pb-32 bg-background">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 1. Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <span className="text-brand-red text-sm tracking-[0.2em] uppercase mb-4 font-bold inline-block px-4 py-1.5 border border-brand-red/20 rounded-full bg-brand-red/5 shadow-sm">
            {currentT.badge}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 font-serif max-w-4xl leading-[1.1]">
            {currentT.title_1}
            <span className="text-brand-red font-light italic block md:inline-block">
              {currentT.title_2}
            </span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto mb-12 text-base md:text-lg leading-relaxed font-light">
            {currentT.subtitle}
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto bg-surface/50 p-2 rounded-[2rem] border border-border backdrop-blur-sm">
            {categories.map((cat) => {
              const catKey = cat.toLowerCase().replace(" ", "").replace("/", "");
              const displayCat =
                cat === "All"
                  ? currentT.filter_all
                  : lang === "bn"
                  ? t(`portfolio.categories.${catKey}`)
                  : cat;

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
              );
            })}
          </div>
        </motion.div>

        {/* 2. Case Studies List */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted animate-pulse">Loading Case Studies...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center bg-surface border border-border rounded-3xl p-12">
            <p className="text-muted text-lg font-light">No case studies found in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-24">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                // Parse results/metrics from JSON if stored as JSON in DB
                let metricsList: Array<{ label: string; value: string }> = [];
                if (project.results) {
                  try {
                    metricsList = typeof project.results === "string" 
                      ? JSON.parse(project.results) 
                      : project.results;
                  } catch (e) {
                    console.error("Error parsing results JSON:", e);
                  }
                }

                // Check if video exists
                const hasVideo = project.videoUrl || (project.image && project.image.includes("vimeo"));

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group bg-surface border border-border rounded-[2.5rem] p-6 md:p-10 flex flex-col lg:grid lg:grid-cols-12 gap-10 hover:border-brand-red/30 hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Visual Media Container (Left 5 Cols) */}
                    <div className="lg:col-span-5 h-[300px] md:h-[400px] lg:h-full rounded-2xl overflow-hidden relative border border-border bg-background">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

                      {hasVideo && (
                        <div className="absolute top-4 right-4 bg-brand-red text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-brand-red/20 z-20">
                          <PlayCircle size={14} className="animate-pulse" />
                          <span>VIDEO READY</span>
                        </div>
                      )}

                      {/* Overlaid Title on Mobile/Tablet */}
                      <div className="absolute bottom-6 left-6 right-6 z-20 lg:hidden text-white pointer-events-none">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-brand-red bg-white/95 px-2 py-0.5 rounded shadow-sm inline-block mb-2">
                          {project.catId}
                        </span>
                        <h2 className="text-2xl font-bold font-serif">{project.title}</h2>
                      </div>
                    </div>

                    {/* Technical Narrative (Right 7 Cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        {/* Desktop Header */}
                        <div className="hidden lg:flex justify-between items-start mb-6">
                          <div>
                            <span className="inline-block px-3 py-1.5 rounded-full border border-brand-red/20 text-brand-red text-[10px] font-bold tracking-widest uppercase mb-3 bg-brand-red/5">
                              {project.catId}
                            </span>
                            <h2 className="text-4xl font-serif font-bold text-foreground group-hover:text-brand-red transition-colors duration-300">
                              {project.title}
                            </h2>
                          </div>
                          <span className="text-muted/60 text-sm font-medium tracking-widest">{project.year}</span>
                        </div>

                        {/* Summary */}
                        <p className="text-muted leading-relaxed font-light mb-8 text-base">
                          {project.overview}
                        </p>

                        {/* Process Splits (Challenge & Solution) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-y border-border py-8">
                          <div>
                            <p className="text-foreground font-bold text-sm tracking-wide mb-3 flex items-center gap-2">
                              <Puzzle size={16} className="text-brand-red" />
                              <span>{currentT.problem}</span>
                            </p>
                            <p className="text-muted text-sm leading-relaxed font-light">
                              {project.challenge}
                            </p>
                          </div>
                          <div>
                            <p className="text-foreground font-bold text-sm tracking-wide mb-3 flex items-center gap-2">
                              <Lightbulb size={16} className="text-brand-red" />
                              <span>{currentT.solution}</span>
                            </p>
                            <p className="text-muted text-sm leading-relaxed font-light">
                              {project.solution}
                            </p>
                          </div>
                        </div>

                        {/* Metrics Row */}
                        {metricsList.length > 0 && (
                          <div className="mb-8">
                            <p className="text-muted/80 uppercase tracking-widest text-[10px] font-bold mb-4 flex items-center gap-2">
                              <BarChart3 size={12} className="text-brand-red" />
                              <span>{currentT.results}</span>
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                              {metricsList.slice(0, 3).map((met, i) => (
                                <div key={i} className="bg-background border border-border p-3.5 rounded-2xl text-center group/metric hover:border-brand-red/20 hover:shadow-lg transition-all duration-300">
                                  <h4 className="text-xl md:text-2xl font-black text-brand-red tracking-tight mb-1 group-hover/metric:scale-105 transition-transform duration-300">
                                    {met.value}
                                  </h4>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground truncate leading-none">
                                    {met.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-4 border-t border-border/50">
                        {/* Meta badge */}
                        <div className="flex gap-6 text-[11px] text-muted font-light">
                          <div>
                            <span className="font-bold text-foreground block">{currentT.client}</span>
                            <span>{project.client || "Antor Studio"}</span>
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">{currentT.role}</span>
                            <span>{project.role || "Lead Designer"} ({project.duration})</span>
                          </div>
                        </div>

                        {/* Read Full Button */}
                        <Link
                          href={`/portfolio/${project.slug}`}
                          className="bg-brand-red text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 text-xs font-bold shadow-lg shadow-brand-red/25 self-stretch sm:self-auto justify-center group/btn"
                        >
                          <span>{currentT.read_more}</span>
                          <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* 3. Immersive CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 bg-brand-red text-white rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-brand-red/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-tan/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
              {currentT.connect_title}
            </h2>
            <p className="text-white/80 md:text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              {currentT.connect_subtitle}
            </p>
            <Link
              href="/contact"
              className="inline-flex bg-white text-brand-red px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-2xl shadow-black/10 text-sm tracking-wide"
            >
              {currentT.connect_btn}
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
