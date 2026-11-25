"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Palette,
  LayoutTemplate,
  PenTool,
  Film,
  Box,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Wrench,
  Award,
  Calculator,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  EXPERTISE_LIST,
  type ExpertiseIconName,
  type ExpertiseItem,
} from "@/config/expertise";

const ICON_MAP: Record<ExpertiseIconName, typeof Palette> = {
  palette: Palette,
  layout: LayoutTemplate,
  pen: PenTool,
  film: Film,
  box: Box,
  lightbulb: Lightbulb,
};

export default function ServiceDetailClient({
  service,
  nextService,
}: {
  service: ExpertiseItem;
  nextService: ExpertiseItem;
}) {
  const { lang } = useLanguage();
  const content = lang === "bn" ? service.bn : service.en;
  const nextContent = lang === "bn" ? nextService.bn : nextService.en;
  const Icon = ICON_MAP[service.icon];

  return (
    <main className="min-h-screen bg-transparent text-foreground pt-32 pb-28 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Back navigation + Quick Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-brand-red transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            {lang === "bn" ? "সকল দক্ষতা দেখুন" : "All Expertise"}
          </Link>

          <div className="flex flex-wrap gap-2">
            {EXPERTISE_LIST.map((item) => {
              const itemContent = lang === "bn" ? item.bn : item.en;
              const isCurrent = item.slug === service.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    isCurrent
                      ? "bg-brand-red text-white border-brand-red shadow-sm"
                      : "bg-surface border-border text-muted hover:text-foreground hover:border-brand-red/30"
                  }`}
                >
                  {itemContent.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                  <Icon size={26} />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-background border border-border px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-red">
                  <Sparkles size={12} />
                  {lang === "bn" ? "সার্ভিস বিস্তারিত" : "Expertise Details"}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight">
                {content.title}
              </h1>

              <p className="text-lg md:text-xl text-foreground/90 font-medium leading-relaxed">
                {content.tagline}
              </p>

              <p className="text-muted leading-relaxed">{content.overview}</p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/calculator"
                  className="bg-brand-red text-white px-7 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-[1.03] transition-transform shadow-lg shadow-brand-red/20"
                >
                  <Calculator size={16} />
                  {lang === "bn" ? "বাজেট হিসাব করুন" : "Calculate Estimate"}
                </Link>
                <Link
                  href="/contact"
                  className="bg-background border border-border text-foreground px-7 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:border-brand-red hover:text-brand-red transition-colors"
                >
                  <MessageCircle size={16} />
                  {lang === "bn" ? "প্রজেক্ট নিয়ে কথা বলুন" : "Start a Project"}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-background border border-border rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1.5">
                  <Clock size={12} className="text-brand-red" />
                  {lang === "bn" ? "সম্ভাব্য সময়সীমা" : "Typical Timeline"}
                </span>
                <p className="text-xl font-black text-foreground">{content.timeline}</p>
              </div>

              <div className="bg-background border border-border rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  {lang === "bn" ? "প্রাথমিক বাজেট" : "Starting Estimate"}
                </span>
                <p className="text-xl font-black font-mono text-brand-red">{content.startingBudget}</p>
              </div>

              <Link
                href="/portfolio"
                className="block bg-background border border-border hover:border-brand-red/40 rounded-2xl p-5 transition-colors group"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">
                  {lang === "bn" ? "সম্পর্কিত কাজ দেখুন" : "Related Archive"}
                </span>
                <span className="text-sm font-bold text-foreground group-hover:text-brand-red flex items-center justify-between">
                  {lang === "bn" ? "পোর্টফোলিও প্রজেক্টস" : "View Portfolio Works"}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Deliverables + Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* What's Included */}
          <section className="lg:col-span-6 bg-surface border border-border rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-serif font-bold">
              {lang === "bn" ? "যা যা থাকছে (Deliverables)" : "What You Get"}
            </h2>
            <ul className="space-y-4">
              {content.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-red shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-foreground/90 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Process */}
          <section className="lg:col-span-6 bg-surface border border-border rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-serif font-bold">
              {lang === "bn" ? "কাজের ধাপসমূহ" : "Production Workflow"}
            </h2>
            <div className="space-y-4">
              {content.process.map((step, idx) => (
                <div
                  key={step.title}
                  className="bg-background border border-border rounded-2xl p-5 flex items-start gap-4"
                >
                  <span className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-mono font-black text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Highlights & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7 bg-surface border border-border rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2.5">
              <Award size={22} className="text-brand-red" />
              {lang === "bn" ? "উল্লেখযোগ্য প্রজেক্ট অভিজ্ঞতা" : "Real Experience & Highlights"}
            </h2>
            <ul className="space-y-3">
              {content.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="bg-background border border-border rounded-2xl p-4 text-sm text-foreground/90 leading-relaxed"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-span-5 bg-surface border border-border rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2.5">
              <Wrench size={20} className="text-brand-red" />
              {lang === "bn" ? "ব্যবহৃত সফটওয়্যার ও টুলস" : "Tools & Software Stack"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {service.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-4 py-2.5 rounded-2xl bg-background border border-border text-sm font-semibold text-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Next Expertise Footer Card */}
        <Link
          href={`/services/${nextService.slug}`}
          className="block bg-surface border border-border hover:border-brand-red/50 rounded-3xl p-8 transition-all group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted block mb-1">
                {lang === "bn" ? "পরবর্তী দক্ষতা" : "Next Expertise"}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-black group-hover:text-brand-red transition-colors">
                {nextContent.title}
              </h3>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-red">
              {lang === "bn" ? "বিস্তারিত দেখুন" : "Explore"}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </main>
  );
}
