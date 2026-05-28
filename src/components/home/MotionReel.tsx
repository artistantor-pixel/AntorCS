"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";

export default function MotionReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={containerRef} className="py-32 w-full flex flex-col items-center justify-center relative bg-background z-10">
      <div className="container mx-auto px-6 md:px-12 mb-12 flex justify-between items-end">
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
          Show<span className="text-brand-red">reel</span>
        </h2>
        <p className="text-muted text-sm md:text-lg tracking-widest uppercase hidden md:block">
          2026 Director's Cut
        </p>
      </div>
      
      <motion.div 
        style={{ scale, opacity }} 
        className="w-[90vw] md:w-[85vw] aspect-video relative rounded-[2rem] overflow-hidden glass-panel group hoverable cursor-pointer"
        onClick={togglePlay}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/30 to-transparent mix-blend-overlay z-10 pointer-events-none" />
        
        {/* Placeholder video poster */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"
        >
          <source src="" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: isPlaying ? 0.5 : 1, opacity: isPlaying ? 0 : 1 }}
            className="w-20 h-20 md:w-32 md:h-32 rounded-full glass-panel-heavy flex items-center justify-center text-foreground border border-border backdrop-blur-xl"
          >
            <Play className="w-8 h-8 md:w-12 md:h-12 ml-2 fill-foreground text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
