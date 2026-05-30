"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Film, Sparkles, Layout, Calculator, ShoppingBag, 
  Terminal, ShieldAlert, Monitor, Copy, Check, Play, BookOpen, Layers, Cpu
} from "lucide-react";
import Link from "next/link";

export default function AdminManualPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const videoScenes = [
    {
      scene: "01",
      title: "Hero & Brand Identity Intro",
      duration: "0:00 - 0:10",
      focus: "Minimal Bold Typography & Dynamic Language Engine",
      description: "Visual entry emphasizing high-contrast layout. Showcases the Hind Siliguri typography system rendering in both English and Bengali seamlessly.",
      features: [
        "Dynamic translation system (EN/BN toggles)",
        "Unified Hind Siliguri layout for flawless translation loading",
        "Sleek customizable responsive navigation header"
      ],
      videoCue: "Animate large text 'Antor Kumar Biswas' with standard matte black to off-white transitions. Show a cursor hovering and shifting the EN/BN languages with clean micro-interactions.",
      copyText: "Visual Communicator & Creative Lead — Believer in design as a problem-solving tool."
    },
    {
      scene: "02",
      title: "AntorOS Workspace (Client Portal)",
      duration: "0:10 - 0:25",
      focus: "Gmail Protected Client Dashboard",
      description: "A highly custom and secure admin-to-client collaboration interface styled like a sleek terminal OS (AntorOS).",
      features: [
        "Google Gmail authentication filter",
        "Interactive workflow timeline & custom phase status tracker",
        "Secure client files download repository",
        "Real-time notifications & database-linked live activity logs"
      ],
      videoCue: "Show a premium terminal window opening. Animate client login with Google, transitioning into a beautifully detailed project timeline dashboard with micro-glow lines.",
      copyText: "AntorOS Workspace — Secure, high-speed, collaborative design portal for premium clients."
    },
    {
      scene: "03",
      title: "Interactive Cost Estimator",
      duration: "0:25 - 0:40",
      focus: "Dynamic Budget & Pricing Engine",
      description: "A gorgeous, user-interactive sliding calculator designed to estimate costs for complex design assets dynamically.",
      features: [
        "Interactive sliders for duration, frame-rates, and art complexity",
        "Real-time cost updates with automatic visual breakdown graphs",
        "Custom PDF estimation exporter built with dynamic metadata",
        "Direct CTA leading into booking consultations"
      ],
      videoCue: "Zoom into the calculator slider handle. Slide it smoothly while numerical stats and cost charts dynamically rise and scale with glowing neon lines.",
      copyText: "Interactive Estimator — Transparent, real-time pricing calculation for visual and motion ventures."
    },
    {
      scene: "04",
      title: "Portfolio & Behance-Style Block Builder",
      duration: "0:40 - 0:55",
      focus: "Modular Media & Case Studies Engine",
      description: "A robust case study renderer featuring a custom, modular block-builder interface.",
      features: [
        "Custom JSON/Database-driven block editor (image, markdown, quote layouts)",
        "Fluid motion grid layouts showing visual grids",
        "High-performance media fallback optimization"
      ],
      videoCue: "Animate modular blocks sliding into place in a responsive masonry grid, transitioning into high-definition case study mockups.",
      copyText: "Modular Grid — Custom drag-and-drop structural viewer optimizing premium creative design presentations."
    },
    {
      scene: "05",
      title: "Art Shop & Journal Platforms",
      duration: "0:55 - 1:10",
      focus: "Creative E-Commerce & Narratives",
      description: "Visual showcase of physical art supplies brand (Canvas), educational portal (Charukul Kids), and visual story journals.",
      features: [
        "Responsive grid showing products with clean price tags",
        "Modern newsletter subscription forms",
        "Clean publication layout optimized for SEO and readability"
      ],
      videoCue: "Smooth horizontal scroll over the premium products cards, showcasing details, followed by visual storytelling blocks fading into view.",
      copyText: "Canvas Art Brand & Charukul Kids — Fostering designer ecosystems from young minds to professionals."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] font-sans selection:bg-[#ea3f40] selection:text-white pb-24">
      {/* Header Banner */}
      <header className="border-b border-zinc-800 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#ea3f40]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#ea3f40]">AntorOS Developer System</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">Motion Video Production Manual</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ea3f40]/10 border border-[#ea3f40]/20 text-[#ea3f40] text-xs font-semibold">
            <Film size={14} className="animate-pulse" />
            <span>Interactive Scripting Guide Active</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Overview & Core specs */}
        <section className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea3f40]/5 rounded-full blur-3xl" />
            
            <div className="w-12 h-12 rounded-2xl bg-[#ea3f40]/10 border border-[#ea3f40]/20 flex items-center justify-center text-[#ea3f40]">
              <Sparkles size={22} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Video Scope & Manual</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                This manual acts as a production script and system documentation outlining all the unique, custom-coded features built into the <strong>Antor Creative Studio</strong> ecosystem. Use these scenes, cues, and copy text directly inside your motion graphics composition (After Effects / Premiere) to build an eye-catching visual showreel.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-semibold uppercase">Platform Tech</span>
                <span className="text-zinc-300 font-mono">Next.js 16 (Turbopack)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-semibold uppercase">Design System</span>
                <span className="text-zinc-300 font-mono">Tailwind CSS + Custom UI</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-semibold uppercase">Primary Typography</span>
                <span className="text-zinc-300 font-mono">Hind Siliguri</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-semibold uppercase">Client Security</span>
                <span className="text-zinc-300 font-mono">Gmail Access Protection</span>
              </div>
            </div>
          </div>

          {/* Quick Technical Specs Block */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-6">
            <div className="flex items-center gap-2 text-[#ea3f40]">
              <Cpu size={18} />
              <h3 className="text-sm font-bold tracking-widest uppercase">Feature Engine Specs</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Calculator size={14} className="text-[#ea3f40]" />
                  <span>Cost Calculators</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Dynamic slider system using server-configurable rates, producing structured PDF estimations automatically.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldAlert size={14} className="text-[#ea3f40]" />
                  <span>Secure Workspace</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Prisma ORM linked system filtering active gmail domain users, supplying active project task statuses.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Layers size={14} className="text-[#ea3f40]" />
                  <span>Behance Blocks</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Modular JSON database columns rendering markdown text blocks, high-def design images, and structured metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: Interactive Scenes Guide */}
        <section className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#ea3f40]" />
              <h2 className="text-lg font-bold tracking-tight text-white">Motion Video Scenes & Copy Script</h2>
            </div>
            <p className="text-sm text-zinc-400">
              Interactive timeline structured specifically for drafting video scene elements. Copy premium headlines instantly using the copy buttons.
            </p>
          </div>

          <div className="space-y-8">
            {videoScenes.map((scene) => (
              <div 
                key={scene.scene}
                className="group p-8 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-300 space-y-6 relative overflow-hidden"
              >
                {/* Visual side accent */}
                <div className="absolute top-0 left-0 w-[4px] h-full bg-zinc-800 group-hover:bg-[#ea3f40] transition-colors" />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#ea3f40] px-2 py-0.5 rounded bg-[#ea3f40]/10">
                        SCENE {scene.scene}
                      </span>
                      <span className="text-xs font-medium text-zinc-500">
                        Duration: {scene.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white mt-1 group-hover:text-[#ea3f40] transition-colors">
                      {scene.title}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                    {scene.focus}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {scene.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Core Features Showcased:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scene.features.map((feat, index) => (
                      <li key={index} className="text-xs text-zinc-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#ea3f40]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Motion Cue Box */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase">
                    <Play size={12} className="text-[#ea3f40]" />
                    <span>Visual Motion Director Cue</span>
                  </div>
                  <p className="text-xs text-zinc-400 italic font-sans leading-relaxed">
                    &ldquo;{scene.videoCue}&rdquo;
                  </p>
                </div>

                {/* Video Copy / Text to Copy */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Text Copy for Composition:</h4>
                  <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-zinc-800 flex justify-between items-center gap-4">
                    <p className="text-xs sm:text-sm text-white font-medium leading-relaxed font-sans flex-1">
                      {scene.copyText}
                    </p>
                    <button
                      onClick={() => handleCopy(scene.copyText, scene.scene)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer"
                    >
                      {copiedText === scene.scene ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
