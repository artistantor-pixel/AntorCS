"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PlayCircle } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

// Helper to check if URL is a video
const isVideoUrl = (url: string) => {
  if (!url) return false;
  return url.includes('vimeo.com') || url.includes('youtube.com') || url.match(/\.(mp4|webm)$/i);
};

// Helper to format video URL for embed if needed
const getEmbedUrl = (url: string) => {
  if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
    const vimeoMatch = url.match(/vimeo\.com\/(?:manage\/videos\/)?(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?background=1&autoplay=1&loop=1&byline=0&title=0`;
  }
  if (url.includes('youtube.com/watch')) {
    const ytMatch = url.match(/v=([^&]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&controls=0`;
  }
  return url;
};

const MediaRenderer = ({ url, className, style }: { url: string, className?: string, style?: any }) => {
  const isVideo = isVideoUrl(url);
  
  if (isVideo) {
    const embedUrl = getEmbedUrl(url);
    return (
      <div className={`relative overflow-hidden ${className}`} style={style}>
        {url.match(/\.(mp4|webm)$/i) ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none">
            <source src={url} />
          </video>
        ) : (
          <iframe 
            src={embedUrl}
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
          />
        )}
      </div>
    );
  }

  return (
    <div style={style} className={`relative overflow-hidden ${className}`}>
      <ImageWithFallback
        src={url}
        alt="Project Media"
        fill
        objectFit="cover"
      />
    </div>
  );
};

// Render block structures in simple but sleek ways
const BlockRenderer = ({ block }: { block: any }) => {
  if (!block) return null;

  switch (block.type) {
    case "text":
      // A raw rich-text paragraph helper with subtle styling
      const lines = (block.content || "").split("\n");
      return (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4 text-foreground/80 leading-relaxed font-light text-base md:text-lg">
            {lines.map((line: string, i: number) => {
              if (line.startsWith("### ")) {
                return <h3 key={i} className="text-xl md:text-3xl font-serif text-foreground font-bold pt-4">{line.replace("### ", "")}</h3>;
              }
              if (line.startsWith("## ")) {
                return <h2 key={i} className="text-2xl md:text-4xl font-serif text-foreground font-bold pt-4">{line.replace("## ", "")}</h2>;
              }
              if (line.startsWith("# ")) {
                return <h1 key={i} className="text-3.5xl md:text-5xl font-serif text-foreground font-bold pt-4">{line.replace("# ", "")}</h1>;
              }
              return <p key={i} className="whitespace-pre-line">{line}</p>;
            })}
          </div>
        </div>
      );

    case "image":
      const urls = Array.isArray(block.urls) ? block.urls : ["/uploads/placeholder.jpg"];
      const gridCols = block.gridColumns || 1;
      const marginZero = !!block.marginZero;

      let gridClass = "grid grid-cols-1 gap-6";
      if (gridCols === 2) gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6";
      if (gridCols === 3) gridClass = "grid grid-cols-1 md:grid-cols-3 gap-6";

      return (
        <div className={`w-full ${marginZero ? "px-0 py-2" : "px-6 md:px-12 max-w-[100rem] mx-auto py-6"}`}>
          <div className={gridClass}>
            {urls.map((url: string, i: number) => (
              <div key={i} className={`overflow-hidden relative bg-surface/40 ${marginZero ? "rounded-none" : "rounded-3xl"}`}>
                <ImageWithFallback 
                  src={url} 
                  alt="Behance artwork element" 
                  className="w-full h-auto block" 
                  objectFit="contain"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "video":
      if (!block.content) return null;
      return (
        <div className="px-6 md:px-12 max-w-[100rem] mx-auto py-6">
          <div className="rounded-3xl overflow-hidden relative aspect-video bg-black/20">
            {block.content.match(/\.(mp4|webm)$/i) ? (
              <video autoPlay loop muted playsInline controls className="w-full h-full object-cover block">
                <source src={block.content} />
              </video>
            ) : (
              <iframe 
                src={getEmbedUrl(block.content)} 
                className="w-full h-full block" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
              />
            )}
          </div>
        </div>
      );

    case "embed":
      if (!block.content) return null;
      return (
        <div className="px-6 md:px-12 max-w-[100rem] mx-auto py-8">
          <div className="rounded-3xl overflow-hidden border border-border bg-surface/20 p-2 flex justify-center">
            <div className="w-full overflow-x-auto flex justify-center" dangerouslySetInnerHTML={{ __html: block.content }} />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default function CaseStudyPage({ params }: { params: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState<string>("");
  const [project, setProject] = useState<any>(null);
  const [nextProject, setNextProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Robust parameter resolver supporting both Next.js 14 and 15 dynamic routing conventions
  useEffect(() => {
    if (params) {
      if (typeof params.then === "function") {
        params.then((resolved: any) => {
          setSlug(resolved.slug);
        });
      } else {
        setSlug(params.slug);
      }
    }
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    fetch("/api/projects", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const index = data.findIndex(p => p.slug === slug || p.slug === decodeURIComponent(slug));
          if (index !== -1) {
            setProject(data[index]);
            setNextProject(data[(index + 1) % data.length]);
          } else {
            setProject(null);
            setNextProject(null);
          }
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [slug]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects for Hero
  const { scrollYProgress: heroScroll } = useScroll();
  const yHero = useTransform(heroScroll, [0, 1000], ["0%", "30%"]);
  const scaleHero = useTransform(heroScroll, [0, 1000], [1, 1.1]);
  const opacityHero = useTransform(heroScroll, [0, 800], [1, 0]);

  // Map custom theme backgrounds
  const themeBgMap: Record<string, string> = {
    white: "bg-white text-black selection:bg-brand-red selection:text-white",
    gray: "bg-[#1F2937] text-gray-100 selection:bg-brand-red selection:text-white",
    black: "bg-background text-foreground selection:bg-brand-red selection:text-white"
  };

  const bgStyle = themeBgMap[project?.themeBackground || "black"] || themeBgMap.black;

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="w-16 h-16 border-4 border-brand-red/10 border-t-brand-red rounded-full animate-spin mb-6" />
          <p className="text-muted tracking-[0.25em] text-xs uppercase animate-pulse font-bold">Project Loading...</p>
        </div>
      ) : !project ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10 max-w-md p-10 rounded-[2.5rem] bg-surface/50 border border-border backdrop-blur-md shadow-2xl"
          >
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red/10 text-brand-red mb-6 border border-brand-red/20">
              <ArrowLeft size={24} className="rotate-45" />
            </span>
            <h1 className="text-3xl font-serif font-bold mb-4 tracking-tight">Case Study Not Found</h1>
            <p className="text-muted text-sm font-light mb-8 leading-relaxed">
              The project study you are trying to view does not exist or has been relocated to another workspace.
            </p>
            <Link 
              href="/portfolio" 
              className="inline-flex bg-brand-red text-white px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-all text-xs tracking-wider uppercase shadow-lg shadow-brand-red/20"
            >
              Return to Portfolio Home
            </Link>
          </motion.div>
        </div>
      ) : (
        <main className={`min-h-screen transition-colors duration-750 ${bgStyle}`}>
          
          {/* Progress Bar */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-red to-blood-red origin-left z-[100] rounded-r-full shadow-[0_0_10px_rgba(255,0,0,0.5)]" 
            style={{ scaleX }} 
          />

          {/* Navigation Top Bar */}
          <div className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 pointer-events-none flex justify-between items-center mix-blend-difference text-white">
            <Link href="/portfolio" className="pointer-events-auto flex items-center gap-3 hover:gap-5 transition-all uppercase tracking-widest text-xs font-bold group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="mt-0.5 group-hover:text-brand-red transition-colors">Back to Archive</span>
            </Link>
          </div>

          {/* 1. Header Section */}
          <section className="pt-48 pb-24 px-6 md:px-12 max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
            >
              <div className="max-w-5xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-red/30 text-brand-red uppercase tracking-[0.2em] text-xs font-bold mb-8 bg-brand-red/5"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                  {project.catId}
                </motion.div>
                <h1 className="text-5xl md:text-[8vw] font-serif leading-[0.9] tracking-tighter capitalize hover:text-brand-red transition-colors duration-700">
                  {project.title}
                </h1>
              </div>
              
              <div className="lg:w-1/3 text-lg md:text-xl font-light text-muted leading-relaxed border-l border-brand-red/30 pl-6">
                {project.overview}
              </div>
            </motion.div>
          </section>

          {/* 2. Massive Hero Parallax Media */}
          <section className="px-6 md:px-12 max-w-[100rem] mx-auto relative h-[70vh] md:h-[90vh] overflow-hidden rounded-[2.5rem] group cursor-default">
            <motion.div className="w-full h-full" style={{ scale: scaleHero, opacity: opacityHero }}>
              <MediaRenderer 
                url={project.image} 
                style={{ y: yHero }}
                className="w-full h-[140%] absolute -top-[20%] left-0 will-change-transform" 
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
            
            {/* Floating Metadata Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-surface/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl max-w-sm hidden md:block border border-border"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-1">Client</p>
                  <p className="font-bold text-sm text-foreground">{project.client || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-1">Role</p>
                  <p className="font-bold text-sm text-foreground">{project.role || "Lead Artist"}</p>
                </div>
                <div>
                  <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-1">Timeline</p>
                  <p className="font-bold text-sm text-foreground">{project.duration || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-1">Live Project</p>
                  {project.liveLink ? (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-sm text-brand-red hover:text-blood-red transition-colors group/link">
                      View Live <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="font-bold text-sm text-muted">N/A</span>
                  )}
                </div>
              </div>
            </motion.div>
          </section>

          {/* DYNAMIC BEHANCE BLOCKS RENDERING CANVAS */}
          <section className="py-20 flex flex-col gap-4">
            {Array.isArray(project.blocks) && project.blocks.length > 0 ? (
              project.blocks.map((block: any, idx: number) => (
                <BlockRenderer key={block.id || idx} block={block} />
              ))
            ) : (
              // Fallback to legacy challenge/solution/gallery layout if no dynamic blocks exist
              <>
                <div className="py-24 md:py-48 px-6 md:px-12 max-w-[100rem] mx-auto relative">
                  <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                    <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
                      <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">Process & <span className="text-brand-red italic">Execution</span></h2>
                      <p className="text-lg text-muted leading-relaxed">
                        Every pixel, every frame, and every interaction is designed with intention.
                      </p>
                    </div>
                    <div className="lg:w-2/3 flex flex-col gap-24">
                      <div className="bg-surface border border-border p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden">
                        <h3 className="text-3xl font-bold mb-6">The Challenge</h3>
                        <p className="text-xl md:text-2xl leading-relaxed font-light text-foreground/80">{project.challenge}</p>
                      </div>
                      <div className="bg-brand-red text-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <h3 className="text-3xl font-bold mb-6">The Solution</h3>
                        <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">{project.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {project.gallery && project.gallery.length > 0 && (
                  <div className="py-32 px-6 md:px-12 max-w-[100rem] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                      {Array.isArray(project.gallery) && project.gallery.map((mediaUrl: any, i: number) => {
                        let spanClass = "col-span-1 lg:col-span-12";
                        if (i % 3 === 1) spanClass = "col-span-1 lg:col-span-7";
                        if (i % 3 === 2) spanClass = "col-span-1 lg:col-span-5";

                        return (
                          <div key={i} className={`${spanClass} rounded-[2rem] overflow-hidden relative group bg-surface/50`}>
                            <MediaRenderer url={mediaUrl} className="w-full h-full min-h-[40vh] md:min-h-[60vh]" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
          
          {/* 6. Next Project Footer */}
          {nextProject && (
            <section className="h-screen w-full flex flex-col items-center justify-center relative border-t border-border bg-surface overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/10 via-transparent to-transparent opacity-50" />
              
              <Link href={`/portfolio/${nextProject.slug}`} className="group flex flex-col items-center relative z-10 hoverable p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-muted text-xs md:text-sm tracking-[0.4em] uppercase mb-8 font-bold group-hover:text-brand-red transition-colors flex items-center gap-3">
                    Up Next <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </p>
                  <h2 className="text-6xl md:text-[10vw] font-serif tracking-tighter capitalize text-foreground group-hover:opacity-60 transition-opacity duration-500 leading-none text-center">
                    {nextProject.title}
                  </h2>
                </motion.div>
              </Link>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
