"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FooterContact() {
  return (
    <section className="py-32 md:py-48 w-full bg-background relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-red/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-[9vw] font-black tracking-tighter uppercase text-foreground leading-none">
            Have a <br/>
            <span className="text-glow-red text-brand-red">Project?</span>
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16"
        >
          <Link 
            href="/contact"
            className="group relative inline-flex items-center justify-center px-12 py-6 glass-panel-heavy rounded-full overflow-hidden hoverable border border-border"
          >
            <div className="absolute inset-0 bg-brand-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
            <span className="relative z-10 flex items-center gap-4 text-sm md:text-lg tracking-[0.2em] uppercase font-bold text-foreground">
              Let's Talk <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Link>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-muted text-[10px] md:text-xs tracking-[0.2em] uppercase relative z-20">
        <p>&copy; {new Date().getFullYear()} Antor Creative Studio</p>
        <div className="flex gap-8 mt-6 md:mt-0">
          <Link href="/portfolio" className="hover:text-foreground transition-colors hoverable">Works</Link>
          <Link href="/about" className="hover:text-foreground transition-colors hoverable">About</Link>
          <Link href="/experimental" className="hover:text-foreground transition-colors hoverable">Lab</Link>
        </div>
      </div>
    </section>
  );
}
