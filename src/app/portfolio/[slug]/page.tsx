"use client";

import { useEffect, useRef, use, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PlayCircle } from "lucide-react";

// Helper to check if URL is a video
const isVideoUrl = (url: string) => {
  if (!url) return false;
  return url.includes('vimeo.com') || url.includes('youtube.com') || url.match(/\.(mp4|webm)$/i);
};

// Helper to format video URL for embed if needed
const getEmbedUrl = (url: string) => {
  if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
    // Basic extraction for vimeo, assuming normal vimeo id or full embed is passed
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
      <motion.div className={`relative overflow-hidden ${className}`} style={style}>
        {/* We use an iframe for external videos or video tag for direct mp4 */}
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
      </motion.div>
    );
  }

  return (
    <motion.img 
      style={style}
      src={url} 
      alt="Project Media" 
      className={`object-cover object-center ${className}`} 
    />
  );
};

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [project, setProject] = useState<any>(null);
  const [nextProject, setNextProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      });
  }, [slug]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] // For progress bar
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

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading ? (
        <div className="min-h-screen bg-background flex items-center justify-center text-brand-red animate-pulse">Loading Asset...</div>
      ) : !project ? (
        <div className="min-h-screen bg-background flex items-center justify-center text-xl font-bold">Asset Not Found</div>
      ) : (
        <main className="bg-background min-h-screen text-foreground selection:bg-brand-red selection:text-white">
          
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
                  <p className="font-bold text-sm text-foreground">{project.client}</p>
                </div>
                <div>
                  <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-1">Role</p>
                  <p className="font-bold text-sm text-foreground">{project.role}</p>
                </div>
                <div>
                  <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-1">Timeline</p>
                  <p className="font-bold text-sm text-foreground">{project.duration}</p>
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

          {/* Mobile Metadata */}
          <section className="px-6 py-12 md:hidden">
            <div className="grid grid-cols-2 gap-8 bg-surface p-6 rounded-3xl border border-border">
              <div>
                <p className="text-muted uppercase tracking-widest text-xs font-bold mb-2">Client</p>
                <p className="font-bold">{project.client}</p>
              </div>
              <div>
                <p className="text-muted uppercase tracking-widest text-xs font-bold mb-2">Timeline</p>
                <p className="font-bold">{project.duration}</p>
              </div>
            </div>
          </section>

          {/* 3. Sticky Challenge & Solution */}
          <section className="py-24 md:py-48 px-6 md:px-12 max-w-[100rem] mx-auto relative">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
              {/* Sticky Left Side */}
              <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
                <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">Process & <span className="text-brand-red italic">Execution</span></h2>
                <p className="text-lg text-muted leading-relaxed">
                  Every pixel, every frame, and every interaction is designed with intention. Here is how we tackled the core challenges of this project.
                </p>
              </div>
              
              {/* Scrolling Right Side */}
              <div className="lg:w-2/3 flex flex-col gap-24">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="bg-surface border border-border p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-red/30 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-red/10 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center text-2xl font-serif italic mb-10 border border-border text-brand-red shadow-sm">01</div>
                  <h3 className="text-3xl font-bold mb-6">The Challenge</h3>
                  <p className="text-xl md:text-2xl leading-relaxed font-light text-foreground/80">{project.challenge}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-brand-red text-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl shadow-brand-red/20 relative overflow-hidden group"
                >
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 group-hover:bg-white/20 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-white text-brand-red flex items-center justify-center text-2xl font-serif italic mb-10 shadow-lg">02</div>
                  <h3 className="text-3xl font-bold mb-6">The Solution</h3>
                  <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">{project.solution}</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* 4. Results & Impact */}
          {project.results && project.results.length > 0 && (
            <section className="py-24 md:py-40 bg-surface">
              <div className="px-6 md:px-12 max-w-[100rem] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div>
                    <p className="text-brand-red uppercase tracking-[0.2em] text-xs font-bold mb-4 flex items-center gap-2"><PlayCircle size={14}/> Impact</p>
                    <h2 className="text-5xl md:text-7xl font-serif tracking-tight">Measurable Results</h2>
                  </div>
                  <p className="text-muted max-w-sm text-lg">The new digital experience yielded immediate and significant improvements across all key metrics.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Array.isArray(project.results) && project.results.map((res: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                      className="bg-background border border-border rounded-[2rem] p-12 text-center flex flex-col justify-center items-center group hover:border-brand-red/40 hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors duration-500" />
                      <h3 className="text-6xl md:text-[5.5rem] font-black text-brand-red tracking-tighter mb-6 group-hover:scale-110 transition-transform duration-500 will-change-transform z-10">{res.value}</h3>
                      <p className="text-sm font-bold uppercase tracking-widest text-foreground z-10">{res.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 5. Asymmetrical Visual Gallery with Video Support */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="py-32 px-6 md:px-12 max-w-[100rem] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {Array.isArray(project.gallery) && project.gallery.map((mediaUrl: any, i: number) => {
                  // Asymmetrical classes for visual interest
                  let spanClass = "col-span-1 lg:col-span-12";
                  if (i % 3 === 1) spanClass = "col-span-1 lg:col-span-7";
                  if (i % 3 === 2) spanClass = "col-span-1 lg:col-span-5";

                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`${spanClass} rounded-[2rem] overflow-hidden relative group bg-surface/50`}
                    >
                      <div className="absolute inset-0 bg-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay pointer-events-none" />
                      <MediaRenderer 
                        url={mediaUrl} 
                        className="w-full h-full min-h-[40vh] md:min-h-[60vh] group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out will-change-transform" 
                      />
                      {isVideoUrl(mediaUrl) && (
                        <div className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-md p-3 rounded-full text-white shadow-lg pointer-events-none">
                          <PlayCircle size={24} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
          
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
