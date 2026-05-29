"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowUp, Mail, MessageCircle } from "lucide-react";

export default function FooterSection() {
  const { t } = useLanguage();
  const [linksOpen, setLinksOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface border-t border-border pt-16 md:pt-20 pb-10 relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-red/[0.01] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="Antor Logo" 
                width={120} 
                height={40} 
                className="h-10 w-auto object-contain" 
              />
            </Link>
            <p className="text-muted max-w-sm text-sm leading-relaxed">{t("footer.desc")}</p>

            {/* Premium Touch Actions Card for Mobile view */}
            <div className="flex md:hidden mt-8 p-5 bg-background/50 border border-border rounded-2xl items-center justify-between gap-4 backdrop-blur-md shadow-sm">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold block">
                  {t("nav.journal") || "Let's connect"}
                </span>
                <span className="text-sm font-bold text-foreground mt-0.5">hello@antorstudio.com</span>
              </div>
              <div className="flex gap-2.5">
                <a 
                  href="mailto:hello@antorstudio.com" 
                  className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red border border-brand-red/15 hover:bg-brand-red hover:text-white transition-all active:scale-95"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
                <a 
                  href="https://wa.me/8801712345678" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/15 hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                  title="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Links (Desktop list, Mobile Accordion) */}
          <div className="border-b border-border/40 md:border-b-0 pb-4 md:pb-0">
            {/* Desktop Header */}
            <h4 className="hidden md:block font-bold mb-6 text-sm uppercase tracking-wider text-foreground">
              {t("footer.links_title")}
            </h4>
            {/* Mobile Header (Accordion Trigger) */}
            <button 
              onClick={() => setLinksOpen(!linksOpen)}
              className="flex md:hidden w-full items-center justify-between py-2 text-left font-bold text-sm uppercase tracking-wider text-foreground"
            >
              <span>{t("footer.links_title")}</span>
              <span className="text-muted transition-transform duration-300">
                {linksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {/* Desktop Links View */}
            <div className="hidden md:flex flex-col gap-3 text-sm text-muted">
              <Link href="/about" className="hover:text-brand-red transition-colors w-fit">{t("nav.about")}</Link>
              <Link href="/portfolio" className="hover:text-brand-red transition-colors w-fit">{t("nav.works")}</Link>
              <Link href="/services" className="hover:text-brand-red transition-colors w-fit">{t("nav.services")}</Link>
              <Link href="/contact" className="hover:text-brand-red transition-colors w-fit">{t("nav.journal")}</Link>
            </div>

            {/* Mobile Accordion Links View */}
            <AnimatePresence>
              {linksOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden md:hidden flex flex-col gap-3 text-sm text-muted pt-2 pb-4"
                >
                  <Link href="/about" className="hover:text-brand-red py-1 transition-colors">{t("nav.about")}</Link>
                  <Link href="/portfolio" className="hover:text-brand-red py-1 transition-colors">{t("nav.works")}</Link>
                  <Link href="/services" className="hover:text-brand-red py-1 transition-colors">{t("nav.services")}</Link>
                  <Link href="/contact" className="hover:text-brand-red py-1 transition-colors">{t("nav.journal")}</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Column 3: Legal (Desktop list, Mobile Accordion) */}
          <div className="border-b border-border/40 md:border-b-0 pb-4 md:pb-0">
            {/* Desktop Header */}
            <h4 className="hidden md:block font-bold mb-6 text-sm uppercase tracking-wider text-foreground">
              {t("footer.legal_title")}
            </h4>
            {/* Mobile Header (Accordion Trigger) */}
            <button 
              onClick={() => setLegalOpen(!legalOpen)}
              className="flex md:hidden w-full items-center justify-between py-2 text-left font-bold text-sm uppercase tracking-wider text-foreground"
            >
              <span>{t("footer.legal_title")}</span>
              <span className="text-muted transition-transform duration-300">
                {legalOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {/* Desktop Legal Links */}
            <div className="hidden md:flex flex-col gap-3 text-sm text-muted">
              <Link href="/privacy" className="hover:text-brand-red transition-colors w-fit">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-brand-red transition-colors w-fit">{t("footer.terms")}</Link>
            </div>

            {/* Mobile Accordion Legal Links */}
            <AnimatePresence>
              {legalOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden md:hidden flex flex-col gap-3 text-sm text-muted pt-2 pb-4"
                >
                  <Link href="/privacy" className="hover:text-brand-red py-1 transition-colors">{t("footer.privacy")}</Link>
                  <Link href="/terms" className="hover:text-brand-red py-1 transition-colors">{t("footer.terms")}</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Bottom (Copyright, Socials, Back to Top button) */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted">
          <p className="text-center md:text-left order-3 md:order-1">
            © {new Date().getFullYear()} Antor. {t("footer.rights")}
          </p>

          {/* Social Icons row */}
          <div className="flex gap-6 order-2 md:order-2">
            <a href="#" className="hover:text-brand-red transition-all duration-300 hover:-translate-y-0.5">Twitter</a>
            <a href="#" className="hover:text-brand-red transition-all duration-300 hover:-translate-y-0.5">LinkedIn</a>
            <a href="#" className="hover:text-brand-red transition-all duration-300 hover:-translate-y-0.5">Instagram</a>
          </div>

          {/* Elegant Back to Top button */}
          <div className="order-1 md:order-3 w-full md:w-auto flex justify-center md:justify-end">
            <button 
              onClick={scrollToTop} 
              className="flex items-center gap-2 px-4 py-2.5 bg-background hover:bg-brand-red text-muted hover:text-white rounded-full transition-all border border-border hover:border-brand-red group shadow-sm active:scale-95 cursor-pointer font-bold text-xs uppercase tracking-wider"
              aria-label="Scroll to top"
            >
              <span>{t("nav.home") || "Top"}</span>
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
