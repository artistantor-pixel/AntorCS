"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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

const MediaRenderer = ({ url, className, style, intrinsic = false }: { url: string, className?: string, style?: any, intrinsic?: boolean }) => {
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

  if (intrinsic) {
    return (
      <div style={style} className={`${className}`}>
        <ImageWithFallback
          src={url}
          alt="Project Media"
          fill={false}
          className="w-full h-auto block"
          objectFit="contain"
        />
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
      // A raw rich-text paragraph helper with refined, peaceful typography
      const lines = (block.content || "").split("\n");
      return (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-6 text-foreground/80 leading-loose font-light text-base md:text-[1.125rem]">
            {lines.map((line: string, i: number) => {
              if (line.startsWith("### ")) {
                return <h3 key={i} className="text-xl md:text-2xl font-serif text-foreground font-medium pt-8 tracking-wide">{line.replace("### ", "")}</h3>;
              }
              if (line.startsWith("## ")) {
                return <h2 key={i} className="text-2xl md:text-3xl font-serif text-foreground font-medium pt-10 tracking-tight">{line.replace("## ", "")}</h2>;
              }
              if (line.startsWith("# ")) {
                return <h1 key={i} className="text-4xl md:text-5xl font-serif text-foreground font-medium pt-12 tracking-tighter">{line.replace("# ", "")}</h1>;
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

      let gridClass = "grid grid-cols-1 gap-6 md:gap-8";
      if (gridCols === 2) gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8";
      if (gridCols === 3) gridClass = "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8";

      return (
        <div className={`w-full ${marginZero ? "px-0 py-2" : "px-6 md:px-12 max-w-[100rem] mx-auto py-10"}`}>
          <div className={gridClass}>
            {urls.map((url: string, i: number) => (
              <div key={i} className={`overflow-hidden relative bg-surface/20 ${marginZero ? "rounded-none" : "rounded-3xl md:rounded-[2.5rem]"}`}>
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
        <div className="px-6 md:px-12 max-w-[100rem] mx-auto py-10">
          <div className="rounded-3xl md:rounded-[2.5rem] overflow-hidden relative aspect-video bg-surface shadow-sm border border-border/30">
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
        <div className="px-6 md:px-12 max-w-[100rem] mx-auto py-10">
          <div className="rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-border/50 bg-surface/30 p-2 flex justify-center backdrop-blur-sm">
            <div className="w-full overflow-x-auto flex justify-center" dangerouslySetInnerHTML={{ __html: block.content }} />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default function PortfolioDetailClient({ project, nextProject }: { project: any, nextProject: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

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
  const { scrollY: heroScroll } = useScroll();
  const yHero = useTransform(heroScroll, [0, 1000], ["0%", "30%"]);
  const scaleHero = useTransform(heroScroll, [0, 1000], [1, 1.05]);
  const opacityHero = useTransform(heroScroll, [0, 800], [1, 0.2]);

  // Map custom theme backgrounds
  const themeBgMap: Record<string, string> = {
    white: "bg-[#FAFAFA] text-[#1A1A1A] selection:bg-brand-red/20 selection:text-brand-red",
    gray: "bg-[#F3F4F6] text-[#1F2937] selection:bg-brand-red/20 selection:text-brand-red",
    black: "bg-[#FAFAFA] text-[#1A1A1A] selection:bg-brand-red/20 selection:text-brand-red" // Forced light mode as per user request
  };

  const bgStyle = themeBgMap[project?.themeBackground || "white"] || themeBgMap.white;

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md p-10 rounded-[2.5rem] bg-white/80 border border-black/5 backdrop-blur-md shadow-2xl"
        >
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/5 text-black/50 mb-6 border border-black/10">
            <ArrowLeft size={24} className="rotate-45" />
          </span>
          <h1 className="text-3xl font-serif font-bold mb-4 tracking-tight text-black">Project Not Found</h1>
          <p className="text-black/60 text-sm font-light mb-8 leading-relaxed">
            The project you are trying to view does not exist or has been relocated to another workspace.
          </p>
          <Link 
            href="/portfolio" 
            className="inline-flex bg-brand-red text-white px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-all text-xs tracking-wider uppercase shadow-xl shadow-brand-red/20"
          >
            Return to Portfolio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <main className={`min-h-screen transition-colors duration-1000 ${bgStyle}`}>
        
        {/* Soft Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-red/80 to-brand-red origin-left z-[100]" 
          style={{ scaleX }} 
        />

        {/* Glassmorphic Navigation Top Bar (Light Mode) */}
        <div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
          <Link href="/portfolio" className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/5 text-black hover:bg-white hover:scale-105 transition-all shadow-xl shadow-black/5 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-brand-red" /> 
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold mt-0.5 text-black">Archive</span>
          </Link>
        </div>

        {/* 1. Header Section */}
        <section className="pt-48 pb-20 px-6 md:px-12 max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-16"
          >
            <div className="max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-brand-red/20 text-brand-red uppercase tracking-[0.25em] text-[10px] font-bold mb-10 bg-brand-red/5 backdrop-blur-sm shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                {project.catId}
              </motion.div>
              <h1 className="text-5xl md:text-[7vw] font-serif leading-[0.95] tracking-tighter capitalize text-black">
                {project.title}
              </h1>
            </div>
            
            <div className="lg:w-1/3 text-base md:text-xl font-light text-black/70 leading-relaxed border-l-2 border-brand-red/20 pl-8 py-2">
              {project.overview}
            </div>
          </motion.div>
        </section>

        {/* 2. Massive Hero Parallax Media with Cinematic Reveal */}
        <section className="px-6 md:px-12 max-w-[100rem] mx-auto relative h-[70vh] md:h-[85vh] overflow-hidden rounded-[2.5rem] md:rounded-[3rem] group cursor-default shadow-2xl border border-black/5">
          <motion.div 
            initial={{ clipPath: "inset(10% 10% 10% 10% round 3rem)", scale: 1.1 }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 0rem)", scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full origin-center" 
          >
            <motion.div className="w-full h-full" style={{ scale: scaleHero, opacity: opacityHero }}>
              <MediaRenderer 
                url={project.image} 
                style={{ y: yHero }}
                className="w-full h-[140%] absolute -top-[20%] left-0 will-change-transform" 
              />
            </motion.div>
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          
          {/* Subtle Floating Metadata Card (Light Mode adapted) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-white/95 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl max-w-sm hidden md:block border border-black/5"
          >
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <p className="text-black/40 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Client</p>
                <p className="font-bold text-sm text-black">{project.client || "N/A"}</p>
              </div>
              <div>
                <p className="text-black/40 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Role</p>
                <p className="font-bold text-sm text-black">{project.role || "Lead Artist"}</p>
              </div>
              <div>
                <p className="text-black/40 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Timeline</p>
                <p className="font-bold text-sm text-black">{project.duration || "N/A"}</p>
              </div>
              <div>
                <p className="text-black/40 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Live Link</p>
                {project.liveLink ? (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-bold text-sm text-brand-red hover:text-blood-red transition-colors group/link">
                    View Project <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                ) : (
                  <span className="font-bold text-sm text-black/40">N/A</span>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* DYNAMIC BEHANCE BLOCKS RENDERING CANVAS */}
        <section className="py-24 md:py-32 flex flex-col gap-0">
          {Array.isArray(project.blocks) && project.blocks.length > 0 ? (
            project.blocks.map((block: any, idx: number) => (
              <BlockRenderer key={block.id || idx} block={block} />
            ))
          ) : (
            // Softened Legacy Fallback Layout (Light Mode)
            <>
              <div className="py-12 md:py-24 px-6 md:px-12 max-w-[100rem] mx-auto relative">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                  <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8 font-bold text-black">Process & <span className="italic text-brand-red">Execution</span></h2>
                    <p className="text-lg md:text-xl text-black/60 leading-relaxed font-light">
                      Every pixel, every frame, and every interaction is designed with pure intention to create a peaceful and premium experience.
                    </p>
                  </div>
                  <div className="lg:w-2/3 flex flex-col gap-12 md:gap-16">
                    <div className="bg-white border border-black/5 p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-black/5">
                      <h3 className="text-xl md:text-2xl font-serif text-black/50 mb-6 tracking-wide font-bold">The Challenge</h3>
                      <p className="text-xl md:text-2xl leading-relaxed font-light text-black/90">{project.challenge}</p>
                    </div>
                    <div className="bg-white border border-black/5 p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-black/5 relative overflow-hidden">
                      <h3 className="text-xl md:text-2xl font-serif text-black/50 mb-6 tracking-wide font-bold">The Solution</h3>
                      <p className="text-xl md:text-2xl leading-relaxed font-light text-black/90">{project.solution}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Behance-Style Continuous Case Study Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="w-full max-w-[100rem] mx-auto mt-16 px-0 md:px-12">
                  <div className="flex flex-col w-full shadow-2xl shadow-black/10 md:rounded-[3rem] overflow-hidden bg-white">
                    {Array.isArray(project.gallery) && project.gallery.map((mediaUrl: any, i: number) => {
                      return (
                        <div key={i} className="w-full relative bg-white flex flex-col">
                          <MediaRenderer intrinsic={true} url={mediaUrl} className="w-full h-auto flex items-center justify-center object-contain" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* 6. Refined Next Project Footer (Light Mode) */}
        {nextProject && (
          <section className="h-[70vh] w-full flex flex-col items-center justify-center relative bg-white border-t border-black/5 overflow-hidden mt-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
            
            <Link href={`/portfolio/${nextProject.slug}`} className="group flex flex-col items-center relative z-10 hoverable p-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <p className="text-brand-red text-[10px] md:text-xs tracking-[0.4em] uppercase mb-10 font-bold transition-colors flex items-center gap-3">
                  Up Next <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </p>
                <h2 className="text-5xl md:text-[8vw] font-serif tracking-tighter capitalize text-black/50 group-hover:text-black transition-colors duration-700 leading-none text-center">
                  {nextProject.title}
                </h2>
              </motion.div>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
