"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const projects = [
  { id: 1, title: "Neon Genesis", category: "Motion Design", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070" },
  { id: 2, title: "Dark Matter", category: "Branding", image: "https://images.unsplash.com/photo-1518818419601-129668d4076e?q=80&w=2070" },
  { id: 3, title: "Liquid State", category: "Animation", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964" },
];

export default function FeaturedWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={containerRef} className="py-32 w-full overflow-hidden bg-background relative z-10">
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <h2 className="text-4xl md:text-7xl font-light tracking-tighter uppercase text-foreground">
          Featured <span className="text-glow-red font-bold text-brand-red">Works</span>
        </h2>
        <div className="w-full h-[1px] bg-border mt-8" />
      </div>

      <motion.div style={{ x }} className="flex gap-8 px-6 md:px-12 w-fit">
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            whileHover="hover"
            className="relative w-[85vw] md:w-[45vw] h-[60vh] md:h-[70vh] group overflow-hidden glass-panel-heavy hoverable cursor-pointer"
          >
            <motion.div 
              className="absolute inset-0 z-0"
              variants={{
                hover: { scale: 1.1, filter: "blur(2px)" }
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Using standard img for placeholder external images */}
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover opacity-60"
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            
            <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
              <motion.div
                variants={{
                  hover: { y: 0, opacity: 1 }
                }}
                initial={{ y: 20, opacity: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-blood-red text-xs md:text-sm tracking-[0.3em] uppercase mb-3 font-semibold">{project.category}</p>
                <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">{project.title}</h3>
              </motion.div>
            </div>
            
            {/* Magnetic red glow on hover */}
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none opacity-0 mix-blend-overlay bg-brand-red"
              variants={{ hover: { opacity: 0.4 } }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
