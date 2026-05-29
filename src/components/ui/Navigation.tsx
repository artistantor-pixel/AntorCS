"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Home, Briefcase, User, Calculator, MessageSquare, ShoppingBag, Zap, X } from "lucide-react";


export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    const stored = localStorage.getItem("workspace_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.email.endsWith("@gmail.com")) {
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    e.preventDefault();
    setIsPopupOpen(true);
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/workspace")) return null;


  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? "py-4 bg-background/90 backdrop-blur-md border-b border-border" : "py-6"
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
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link href="/" className="hover:text-muted transition-colors">{t('nav.home')}</Link>
            <Link href="/portfolio" className="hover:text-muted transition-colors">{t('nav.works')}</Link>
            <Link href="/case-studies" className="hover:text-muted transition-colors">
              {lang === 'bn' ? 'কেইজ স্টাডি' : 'Case Studies'}
            </Link>
            <Link href="/about" className="hover:text-muted transition-colors">{t('nav.about')}</Link>
            <Link href="/journal" className="hover:text-muted transition-colors">{t('nav.journal')}</Link>
            <Link href="/shop" className="hover:text-muted transition-colors">{t('nav.shop')}</Link>
            <Link href="/contact" className="hover:text-muted transition-colors">Contact</Link>
            <Link href="/workspace" onClick={handleWorkspaceClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red hover:bg-brand-red/20 transition-all text-xs font-bold">
              <Zap size={11} /> Workspace
            </Link>

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
              href="/calculator" 
              className="bg-brand-red text-white px-7 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 text-sm font-medium shadow-lg shadow-brand-red/20"
            >
              {t('nav.cta')}
            </Link>
          </div>

          {/* Mobile Top Menu Button & Lang Switch */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/workspace" onClick={handleWorkspaceClick} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red active:bg-brand-red/20 transition-all text-xs font-bold">
              <Zap size={11} className="animate-pulse" /> Workspace
            </Link>

            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="text-xs font-bold uppercase bg-surface border border-border px-3 py-1.5 rounded-full"
            >
              {lang === 'en' ? 'BN' : 'EN'}
            </button>
          </div>
        </div>
      </motion.header>

      <div className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-lg border-t border-white/5 pb-5 pt-3 px-3 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center max-w-md mx-auto gap-1">
          <Link href="/portfolio" className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${pathname === '/portfolio' ? 'text-brand-red scale-105' : 'text-muted hover:text-foreground'}`}>
            <Briefcase size={20} className="transition-transform group-active:scale-90" />
            <span className="text-[10px] font-semibold tracking-wide">{t('nav.works')}</span>
            {pathname === '/portfolio' && (
              <motion.span layoutId="activeDot" className="absolute -bottom-2 w-1 h-1 bg-brand-red rounded-full shadow-[0_0_8px_#E11D48]" />
            )}
          </Link>

          <Link href="/shop" className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${pathname === '/shop' ? 'text-brand-red scale-105' : 'text-muted hover:text-foreground'}`}>
            <ShoppingBag size={20} className="transition-transform group-active:scale-90" />
            <span className="text-[10px] font-semibold tracking-wide">{t('nav.shop')}</span>
            {pathname === '/shop' && (
              <motion.span layoutId="activeDot" className="absolute -bottom-2 w-1 h-1 bg-brand-red rounded-full shadow-[0_0_8px_#E11D48]" />
            )}
          </Link>

          <Link href="/calculator" className="flex flex-col items-center gap-1 -mt-8 relative group">
            <div className="bg-gradient-to-tr from-brand-red to-rose-500 p-3.5 rounded-full shadow-[0_4px_20px_rgba(225,29,72,0.4)] text-white hover:scale-110 active:scale-95 transition-transform duration-300 border border-white/10">
              <Calculator size={22} />
            </div>
            <span className="text-[10px] font-bold text-brand-red mt-1">Estimate</span>
          </Link>

          <Link href="/about" className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${pathname === '/about' ? 'text-brand-red scale-105' : 'text-muted hover:text-foreground'}`}>
            <User size={20} className="transition-transform group-active:scale-90" />
            <span className="text-[10px] font-semibold tracking-wide">{t('nav.about')}</span>
            {pathname === '/about' && (
              <motion.span layoutId="activeDot" className="absolute -bottom-2 w-1 h-1 bg-brand-red rounded-full shadow-[0_0_8px_#E11D48]" />
            )}
          </Link>

          <Link href="/contact" className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${pathname === '/contact' ? 'text-brand-red scale-105' : 'text-muted hover:text-foreground'}`}>
            <MessageSquare size={20} className="transition-transform group-active:scale-90" />
            <span className="text-[10px] font-semibold tracking-wide">Contact</span>
            {pathname === '/contact' && (
              <motion.span layoutId="activeDot" className="absolute -bottom-2 w-1 h-1 bg-brand-red rounded-full shadow-[0_0_8px_#E11D48]" />
            )}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-3xl w-full max-w-sm p-7 shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Soft decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-background border border-border text-muted hover:text-foreground transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="text-center space-y-3 pt-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-brand-red/10 text-brand-red border border-brand-red/15">
                  <Zap size={22} className="animate-pulse" />
                </div>
                <h3 className="font-serif font-black text-lg text-foreground">Workspace Access</h3>
                <p className="text-sm text-muted leading-relaxed px-2">
                  অন্তরের তৈরি workspace টি ব্যবহার করতে আপনার জিমেইল দিয়ে লগিন করুন।
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsPopupOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-muted hover:text-foreground border border-border bg-background transition-all cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <Link 
                  href="/workspace"
                  onClick={() => setIsPopupOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-brand-red hover:bg-blood-red flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer"
                >
                  লগিন করুন
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

