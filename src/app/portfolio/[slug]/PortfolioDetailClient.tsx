"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ZoomIn, X } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { PortfolioProject } from "@/lib/portfolio-loader";

const isVideoUrl = (url: string) => {
  if (!url) return false;
  return url.includes("vimeo.com") || url.includes("youtube.com") || /\.(mp4|webm)$/i.test(url);
};

const getEmbedUrl = (url: string) => {
  if (url.includes("vimeo.com") && !url.includes("player.vimeo.com")) {
    const vimeoMatch = url.match(/vimeo\.com\/(?:manage\/videos\/)?(\d+)/);
    if (vimeoMatch)
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?background=1&autoplay=1&loop=1&byline=0&title=0`;
  }
  if (url.includes("youtube.com/watch")) {
    const ytMatch = url.match(/v=([^&]+)/);
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&controls=0`;
  }
  return url;
};

const MediaRenderer = ({
  url,
  className,
  intrinsic = false,
}: {
  url: string;
  className?: string;
  intrinsic?: boolean;
}) => {
  if (isVideoUrl(url)) {
    const embedUrl = getEmbedUrl(url);
    return (
      <div className={`relative overflow-hidden ${className || ""}`}>
        {/\.(mp4|webm)$/i.test(url) ? (
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
      <div className={className}>
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
    <div className={`relative overflow-hidden ${className || ""}`}>
      <ImageWithFallback src={url} alt="Project Media" fill objectFit="cover" />
    </div>
  );
};

interface BlockData {
  id?: string;
  type?: string;
  content?: string;
  urls?: string[];
  gridColumns?: number;
  marginZero?: boolean;
}

const BlockRenderer = ({ block }: { block: BlockData }) => {
  if (!block) return null;

  switch (block.type) {
    case "text": {
      const lines = (block.content || "").split("\n");
      return (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="space-y-5 text-foreground/80 leading-loose text-base md:text-lg">
            {lines.map((line, i) => {
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl md:text-2xl font-serif text-foreground font-bold pt-6">
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl md:text-3xl font-serif text-foreground font-bold pt-8">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-4xl md:text-5xl font-serif text-foreground font-bold pt-10">
                    {line.replace("# ", "")}
                  </h1>
                );
              }
              return <p key={i} className="whitespace-pre-line">{line}</p>;
            })}
          </div>
        </div>
      );
    }

    case "image": {
      const urls = Array.isArray(block.urls) ? block.urls : [];
      const gridCols = block.gridColumns || 1;
      const marginZero = Boolean(block.marginZero);
      let gridClass = "grid grid-cols-1 gap-6 md:gap-8";
      if (gridCols === 2) gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8";
      if (gridCols === 3) gridClass = "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8";

      return (
        <div className={`w-full ${marginZero ? "px-0 py-2" : "px-6 md:px-12 max-w-7xl mx-auto py-8"}`}>
          <div className={gridClass}>
            {urls.map((url, i) => (
              <div
                key={i}
                className={`overflow-hidden relative bg-surface ${
                  marginZero ? "rounded-none" : "rounded-3xl border border-border"
                }`}
              >
                <ImageWithFallback
                  src={url}
                  alt="Artwork showcase"
                  className="w-full h-auto block"
                  objectFit="contain"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "video":
      if (!block.content) return null;
      return (
        <div className="px-6 md:px-12 max-w-7xl mx-auto py-8">
          <div className="rounded-3xl overflow-hidden relative aspect-video bg-surface border border-border">
            {/\.(mp4|webm)$/i.test(block.content) ? (
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
        <div className="px-6 md:px-12 max-w-7xl mx-auto py-8">
          <div className="rounded-3xl overflow-hidden border border-border bg-surface p-2 flex justify-center">
            <div
              className="w-full overflow-x-auto flex justify-center"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default function PortfolioDetailClient({
  project,
  nextProject,
}: {
  project: PortfolioProject | null;
  nextProject: PortfolioProject | null;
  behanceData?: unknown;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { scrollY: heroScroll } = useScroll();
  const yHero = useTransform(heroScroll, [0, 800], ["0%", "25%"]);
  const scaleHero = useTransform(heroScroll, [0, 800], [1, 1.05]);

  const galleryImages = Array.isArray(project?.gallery)
    ? project.gallery.filter((u): u is string => typeof u === "string" && u.length > 0)
    : [];

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length
    );
  }, [galleryImages.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryImages.length
    );
  }, [galleryImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, showPrev, showNext]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md p-10 rounded-3xl bg-surface border border-border shadow-xl">
          <h1 className="text-3xl font-serif font-bold mb-4 text-foreground">Project Not Found</h1>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            The project you are trying to view could not be located.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex bg-brand-red text-white px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-all text-xs tracking-wider uppercase"
          >
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const externalLink = project.liveLink || project.link;
  const hasCaseStudyNarrative = Boolean(project.challenge || project.solution);
  const hasResults = Array.isArray(project.results) && project.results.length > 0;
  const hasBlocks = Array.isArray(project.blocks) && project.blocks.length > 0;

  return (
    <div ref={containerRef} className="w-full relative">
      <main className="min-h-screen bg-background text-foreground selection:bg-brand-red/20 selection:text-brand-red">
        {/* Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-brand-red origin-left z-[110]"
          style={{ scaleX }}
        />

        {/* Hero Section */}
        <section className="relative w-full min-h-[75vh] flex flex-col justify-end overflow-hidden bg-black pt-28">
          <motion.div
            className="absolute inset-0 z-0 origin-center"
            style={{ y: yHero, scale: scaleHero }}
          >
            <MediaRenderer url={project.image} className="w-full h-[115%] absolute -top-[8%] left-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/30" />
          </motion.div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-12 md:pb-16 space-y-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest font-bold w-fit"
            >
              <ArrowLeft size={15} />
              <span>All Works</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-5">
                <span className="w-2 h-2 rounded-full bg-brand-red" />
                <span className="text-white uppercase tracking-widest text-[11px] font-bold">
                  {project.catId}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black leading-[1.06] tracking-tight text-white mb-8 max-w-5xl">
                {project.title}
              </h1>

              {/* Metadata Bento */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-6 md:p-7 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl max-w-5xl">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                    Client / Studio
                  </h4>
                  <p className="text-sm md:text-base font-semibold text-white">
                    {project.client || "Antor Creative Studio"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                    Role
                  </h4>
                  <p className="text-sm md:text-base font-semibold text-white">
                    {project.role || "Visual Designer"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                    Year
                  </h4>
                  <p className="text-sm md:text-base font-semibold text-white">
                    {project.year || "2025"}
                  </p>
                </div>
                <div className="flex items-center">
                  {externalLink ? (
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand-red text-white rounded-full text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-all shadow-lg"
                    >
                      <span>{project.behanceId ? "Open on Behance" : "Live Project"}</span>
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <Link
                      href="/hire"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/15 hover:bg-white hover:text-black text-white rounded-full text-xs uppercase tracking-wider font-bold transition-all border border-white/20"
                    >
                      <span>Hire for Similar</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Overview & Impact Results */}
        {(project.overview || hasResults) && (
          <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto space-y-12">
            {project.overview && (
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground leading-relaxed text-center max-w-4xl mx-auto">
                {project.overview}
              </p>
            )}

            {hasResults && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {project.results?.map((res, idx) => (
                  <div
                    key={idx}
                    className="bg-surface border border-border rounded-2xl p-6 text-center shadow-sm"
                  >
                    <p className="text-3xl font-black font-mono text-brand-red">{res.value}</p>
                    <p className="text-xs uppercase tracking-wider font-bold text-muted mt-1">
                      {res.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Dynamic Blocks (Admin/DB projects) */}
        {hasBlocks && (
          <section className="py-8 flex flex-col">
            {(project.blocks as BlockData[]).map((block, idx) => (
              <BlockRenderer key={block.id || idx} block={block} />
            ))}
          </section>
        )}

        {/* Challenge & Solution (only when present) */}
        {hasCaseStudyNarrative && (
          <section className="py-10 px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.challenge && (
                <div className="bg-surface border border-border p-8 md:p-10 rounded-3xl shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-brand-red mb-3">
                    The Challenge
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                    {project.challenge}
                  </p>
                </div>
              )}
              {project.solution && (
                <div className="bg-surface border border-border p-8 md:p-10 rounded-3xl shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-600 mb-3">
                    The Solution
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Gallery Grid with Lightbox */}
        {galleryImages.length > 0 && (
          <section className="py-12 md:py-16 px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold">Visual Showcase</h2>
                <p className="text-xs text-muted mt-0.5">
                  Click any artwork to inspect in fullscreen ({galleryImages.length}{" "}
                  {galleryImages.length === 1 ? "item" : "items"})
                </p>
              </div>
            </div>

            <div
              className={`grid gap-5 ${
                galleryImages.length === 1
                  ? "grid-cols-1 max-w-4xl mx-auto"
                  : galleryImages.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {galleryImages.map((mediaUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="w-full aspect-[4/3] relative bg-surface rounded-3xl overflow-hidden group cursor-pointer border border-border shadow-sm hover:shadow-xl hover:border-brand-red/40 transition-all duration-300 text-left"
                >
                  <MediaRenderer
                    intrinsic={false}
                    url={mediaUrl}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-black rounded-full p-3 shadow-lg">
                      <ZoomIn size={18} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Behance Full Project Embed */}
        {project.behanceId && (
          <section className="w-full max-w-7xl mx-auto px-6 pb-16 pt-6">
            <div className="w-full bg-surface rounded-3xl overflow-hidden shadow-sm border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">Behance Interactive Presentation</h3>
                  <p className="text-muted text-xs">Full project preview synced from Behance</p>
                </div>
                {externalLink && (
                  <a
                    href={externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1769ff] text-white font-bold text-xs tracking-wide hover:opacity-90 transition-opacity shrink-0"
                  >
                    <span>Open on Behance</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>

              <div className="w-full h-[75vh] min-h-[600px] relative bg-white">
                <iframe
                  src={`https://www.behance.net/embed/project/${project.behanceId}?ilo0=1`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  frameBorder="0"
                  allow="clipboard-write"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </section>
        )}

        {/* Up Next Project */}
        {nextProject && nextProject.slug !== project.slug && (
          <section className="border-t border-border bg-surface py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <Link
                href={`/portfolio/${nextProject.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-background border border-border hover:border-brand-red/40 transition-all"
              >
                <div>
                  <p className="text-brand-red text-xs tracking-widest uppercase mb-2 font-bold">
                    Up Next
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-serif font-black text-foreground group-hover:text-brand-red transition-colors">
                    {nextProject.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-brand-red shrink-0">
                  <span>View Project</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal with Prev/Next */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setLightboxIndex(null)}
          >
            <div className="absolute top-6 left-6 right-6 z-[210] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white/80 bg-white/10 px-4 py-2 rounded-full">
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
              <button
                type="button"
                className="text-xs uppercase tracking-widest font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full p-3 transition-all cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-4 md:left-8 z-[210] p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-4 md:right-8 z-[210] p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                >
                  <ArrowRight size={20} />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full flex items-center justify-center max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImages[lightboxIndex]}
                alt={`${project.title} artwork ${lightboxIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
