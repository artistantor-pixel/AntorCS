"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Home, Briefcase, Layers, User, MessageSquare } from "lucide-react";


export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;


  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "py-3.5 bg-white/75 backdrop-blur-xl border-b border-border/80 shadow-[0_8px_30px_rgba(28,27,24,0.04)]"
            : "py-6 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[2px]"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Left Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Antor Logo" 
              width={120} 
              height={40} 
              priority
              className="h-8 md:h-10 w-auto object-contain" 
            />
          </Link>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className={`transition-colors ${pathname === "/" ? "text-brand-red font-bold" : "hover:text-brand-red"}`}>{t('nav.home')}</Link>
            <Link href="/portfolio" className={`transition-colors ${pathname?.startsWith("/portfolio") ? "text-brand-red font-bold" : "hover:text-brand-red"}`}>{t('nav.works')}</Link>
            <Link href="/services" className={`transition-colors ${pathname?.startsWith("/services") ? "text-brand-red font-bold" : "hover:text-brand-red"}`}>{t('nav.services')}</Link>
            <Link href="/about" className={`transition-colors ${pathname === "/about" ? "text-brand-red font-bold" : "hover:text-brand-red"}`}>{t('nav.about')}</Link>
            <Link href="/journal" className={`transition-colors ${pathname?.startsWith("/journal") ? "text-brand-red font-bold" : "hover:text-brand-red"}`}>{t('nav.journal')}</Link>
            <Link href="/contact" className={`transition-colors ${pathname === "/contact" ? "text-brand-red font-bold" : "hover:text-brand-red"}`}>Contact</Link>
          </div>

          {/* Right CTA & Lang Switcher */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-surface-heavy rounded-full p-1 border border-border">
              <button 
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-background shadow text-brand-red' : 'text-muted hover:text-foreground'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang("bn")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'bn' ? 'bg-background shadow text-brand-red' : 'text-muted hover:text-foreground'}`}
              >
                BN
              </button>
            </div>
            
            <Link 
              href="/hire" 
              className="bg-brand-red text-white px-7 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 text-sm font-bold shadow-lg shadow-brand-red/20"
            >
              {t('nav.cta')}
            </Link>
          </div>

          {/* Mobile Top Menu Button & Lang Switch */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="text-xs font-bold uppercase bg-surface border border-border px-3 py-1.5 rounded-full"
            >
              {lang === 'en' ? 'BN' : 'EN'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE FLUID TAB BAR ── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-transparent pb-6 pt-2 px-4 pointer-events-none">
        <div className="max-w-md mx-auto relative pointer-events-auto">
          
          {/* Main Tab Bar Container */}
          <div className="w-full h-16 bg-white rounded-3xl flex justify-between items-center relative shadow-[0_-5px_30px_rgba(0,0,0,0.06),0_10px_20px_rgba(0,0,0,0.03)] border border-[#1c1b18]/5">
            
            {/* 1. Fluid sliding crescent notch scoop (Illusion mask) */}
            <motion.div
              animate={{ x: `${(() => {
                if (pathname === "/") return 0;
                if (pathname === "/portfolio") return 1;
                if (pathname === "/hire") return 2;
                if (pathname === "/about") return 3;
                if (pathname === "/contact") return 4;
                return 2;
              })() * 100}%` }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute top-0 left-0 h-16 w-1/5 flex justify-center pointer-events-none z-10"
            >
              <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[1px]">
                <path d="M 0 0 C 45 0 15 48 60 48 C 105 48 75 0 120 0 L 0 0 Z" fill="var(--background)" />
              </svg>
            </motion.div>

            {/* 2. Fluid sliding floating active circle */}
            <motion.div
              animate={{ x: `${(() => {
                if (pathname === "/") return 0;
                if (pathname === "/portfolio") return 1;
                if (pathname === "/hire") return 2;
                if (pathname === "/about") return 3;
                if (pathname === "/contact") return 4;
                return 2;
              })() * 100}%` }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute -top-[14px] left-0 h-14 w-1/5 flex justify-center pointer-events-none z-25"
            >
              <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-red/40 border border-white/10">
                {(() => {
                  const Icon = (() => {
                    if (pathname === "/") return Home;
                    if (pathname === "/portfolio") return Layers;
                    if (pathname === "/hire") return Briefcase;
                    if (pathname === "/about") return User;
                    if (pathname === "/contact") return MessageSquare;
                    return Briefcase;
                  })();
                  return <Icon size={18} className="animate-pulse text-white" />;
                })()}
              </div>
            </motion.div>

            {/* 3. Non-active and active links layout */}
            {[
              { href: "/", label: t('nav.home'), icon: Home },
              { href: "/portfolio", label: t('nav.works'), icon: Layers },
              { href: "/hire", label: t('nav.cta'), icon: Briefcase },
              { href: "/about", label: t('nav.about'), icon: User },
              { href: "/contact", label: "Contact", icon: MessageSquare },
            ].map((item, idx) => {
              const activeIndex = (() => {
                if (pathname === "/") return 0;
                if (pathname === "/portfolio") return 1;
                if (pathname === "/hire") return 2;
                if (pathname === "/about") return 3;
                if (pathname === "/contact") return 4;
                return 2;
              })();
              const isActive = activeIndex === idx;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 h-full flex flex-col items-center justify-center relative z-40"
                >
                  <motion.div
                    animate={{ 
                      y: isActive ? -30 : 0,
                      opacity: isActive ? 0 : 1,
                      scale: isActive ? 0.6 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="flex flex-col items-center gap-1 text-[#6b6a65] hover:text-[#1c1b18] pt-2"
                  >
                    <Icon size={18} />
                    <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}

          </div>

        </div>
      </div>
    </>
  );
}

