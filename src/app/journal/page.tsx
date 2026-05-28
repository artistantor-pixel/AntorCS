"use client";

import { motion } from "framer-motion";
import ParticleBackground from "@/components/3d/ParticleBackground";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "The Future of Motion in Web Design",
    category: "Design Thoughts",
    date: "Oct 12, 2026",
    excerpt: "Exploring how kinetic typography and fluid transitions are replacing static layouts in premium digital experiences.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"
  },
  {
    id: 2,
    title: "Building Cinematic 3D Experiences with React Three Fiber",
    category: "Tutorial",
    date: "Sep 28, 2026",
    excerpt: "A deep dive into integrating WebGL and shaders into modern React applications for maximum visual impact.",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070"
  },
  {
    id: 3,
    title: "Behind the Scenes: Dark Matter Branding",
    category: "Process Breakdown",
    date: "Sep 15, 2026",
    excerpt: "How we crafted the visual identity for the enigmatic sci-fi tech startup, Dark Matter.",
    image: "https://images.unsplash.com/photo-1518818419601-129668d4076e?q=80&w=2070"
  }
];

export default function JournalPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24">
      <ParticleBackground />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-blood-red text-sm tracking-[0.3em] uppercase mb-4 font-bold">Editorial</p>
          <h1 className="text-5xl md:text-[7vw] font-black tracking-tighter uppercase leading-none">
            The <span className="text-glow-red text-brand-red">Journal</span>
          </h1>
        </motion.div>

        <div className="flex flex-col gap-12 md:gap-24">
          {articles.map((article, i) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-8 md:gap-16 items-center"
            >
              <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-[2rem] glass-panel-heavy hoverable cursor-pointer relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
                />
                <div className="absolute inset-0 bg-brand-red mix-blend-overlay opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex items-center gap-4 mb-6 text-xs tracking-[0.2em] uppercase">
                  <span className="text-blood-red font-bold">{article.category}</span>
                  <span className="text-muted/30">•</span>
                  <span className="text-muted">{article.date}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-brand-red transition-all duration-300">
                  <Link href={`/journal/${article.id}`} className="hoverable block leading-tight">{article.title}</Link>
                </h2>
                
                <p className="text-muted text-lg font-light leading-relaxed mb-8 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <Link href={`/journal/${article.id}`} className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-foreground hover:text-blood-red transition-colors hoverable w-fit font-bold group/btn">
                  Read Article <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
