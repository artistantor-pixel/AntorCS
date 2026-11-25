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

  const mobileNavItems = [
    { href: "/", label: t("nav.home"), icon: Home, match: (p: string) => p === "/" },
    {
      href: "/portfolio",
      label: t("nav.works"),
      icon: Layers,
      match: (p: string) => p.startsWith("/portfolio"),
    },
    {
      href: "/hire",
      label: t("nav.cta"),
      icon: Briefcase,
      match: (p: string) => p.startsWith("/hire"),
    },
    {
      href: "/about",
      label: t("nav.about"),
      icon: User,
      match: (p: string) => p.startsWith("/about"),
    },
    {
      href: "/contact",
      label: lang === "bn" ? "যোগাযোগ" : "Contact",
      icon: MessageSquare,
      match: (p: string) => p.startsWith("/contact"),
    },
  ];

  const activeMobileIdx = mobileNavItems.findIndex((item) => item.match(pathname || "/"));

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
            <Link
              href="/"
              className={`transition-colors ${pathname === "/" ? "text-brand-red font-bold" : "hover:text-brand-red"}`}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/portfolio"
              className={`transition-colors ${pathname?.startsWith("/portfolio") ? "text-brand-red font-bold" : "hover:text-brand-red"}`}
            >
              {t("nav.works")}
            </Link>
            <Link
              href="/services"
              className={`transition-colors ${pathname?.startsWith("/services") ? "text-brand-red font-bold" : "hover:text-brand-red"}`}
            >
              {t("nav.services")}
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${pathname === "/about" ? "text-brand-red font-bold" : "hover:text-brand-red"}`}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/journal"
              className={`transition-colors ${pathname?.startsWith("/journal") ? "text-brand-red font-bold" : "hover:text-brand-red"}`}
            >
              {t("nav.journal")}
            </Link>
            <Link
              href="/contact"
              className={`transition-colors ${pathname === "/contact" ? "text-brand-red font-bold" : "hover:text-brand-red"}`}
            >
              Contact
            </Link>
          </div>

          {/* Right CTA & Lang Switcher */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-surface-heavy rounded-full p-1 border border-border">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === "en" ? "bg-background shadow text-brand-red" : "text-muted hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("bn")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === "bn" ? "bg-background shadow text-brand-red" : "text-muted hover:text-foreground"
                }`}
              >
                BN
              </button>
            </div>

            <Link
              href="/hire"
              className="bg-brand-red text-white px-7 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 text-sm font-bold shadow-lg shadow-brand-red/20"
            >
              {t("nav.cta")}
            </Link>
          </div>

          {/* Mobile Top Lang Switch */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="text-xs font-bold uppercase bg-white/85 backdrop-blur-md border border-border px-3.5 py-1.5 rounded-full shadow-sm"
            >
              {lang === "en" ? "BN" : "EN"}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── REFINED MOBILE FLOATING BOTTOM DOCK ── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] pt-2 pointer-events-none"
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="relative flex items-center justify-between gap-1 p-1.5 rounded-[1.75rem] bg-white/85 backdrop-blur-2xl border border-white/90 ring-1 ring-foreground/[0.06] shadow-[0_14px_38px_rgba(28,27,24,0.12),0_2px_8px_rgba(28,27,24,0.04)]">
            {mobileNavItems.map((item, idx) => {
              const isActive = activeMobileIdx === idx;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-colors select-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobileBottomNavIndicator"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-2xl bg-brand-red shadow-[0_6px_18px_rgba(234,63,64,0.32)]"
                    />
                  )}
                  <span
                    className={`relative z-10 flex flex-col items-center gap-0.5 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.3 : 1.9} />
                    <span className="text-[10px] font-bold tracking-tight leading-none whitespace-nowrap">
                      {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
