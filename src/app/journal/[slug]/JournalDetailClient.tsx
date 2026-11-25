"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Heart,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { estimateReadTime, type JournalEntry } from "@/config/journal";

export default function JournalDetailClient({
  entry,
  nextEntry,
}: {
  entry: JournalEntry;
  nextEntry: JournalEntry | null;
}) {
  const { lang } = useLanguage();
  const isBn = lang === "bn";

  const [likes, setLikes] = useState(entry.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem("journal_liked_ids") || "[]");
      if (Array.isArray(savedLikes) && savedLikes.includes(entry.id)) {
        setHasLiked(true);
      }
    } catch {
      // Ignore storage error
    }

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entry.id]);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);

    try {
      const savedLikes = JSON.parse(localStorage.getItem("journal_liked_ids") || "[]");
      const next = Array.isArray(savedLikes) ? [...savedLikes, entry.id] : [entry.id];
      localStorage.setItem("journal_liked_ids", JSON.stringify(next));

      await fetch("/api/journal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, action: "like" }),
      });
    } catch {
      // Optimistic count stays
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paragraphs = entry.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-transparent text-foreground pt-28 md:pt-36 pb-28">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[110] pointer-events-none">
        <div
          className="h-full bg-brand-red transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <article className="container mx-auto px-6 max-w-4xl space-y-10">
        {/* Back link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-brand-red transition-colors"
        >
          <ArrowLeft size={14} />
          {isBn ? "সকল জার্নালে ফিরুন" : "Back to Journal"}
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="bg-brand-red/10 text-brand-red px-3.5 py-1 rounded-full uppercase tracking-wider">
              {entry.category}
            </span>
            <span className="bg-surface border border-border px-3.5 py-1 rounded-full text-muted">
              {entry.mood}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted font-medium">
              <Calendar size={13} />
              {entry.date}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted font-medium">
              <Clock size={13} />
              {estimateReadTime(entry.content)} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-[1.08]">
            {entry.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted leading-relaxed">{entry.excerpt}</p>
        </motion.header>

        {/* Cover Image */}
        <div className="aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-border bg-surface-heavy shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.image}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Content */}
        <div className="bg-surface border border-border rounded-[2rem] p-7 sm:p-12 space-y-6">
          {paragraphs.map((block, idx) => {
            if (block.startsWith(">")) {
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-brand-red pl-5 py-2 my-6 text-lg sm:text-xl font-serif italic text-foreground bg-background/60 rounded-r-2xl"
                >
                  {block.replace(/^>\s*/, "")}
                </blockquote>
              );
            }
            return (
              <p
                key={idx}
                className="text-base sm:text-lg text-foreground/90 leading-[1.85] whitespace-pre-line"
              >
                {block}
              </p>
            );
          })}

          {/* Reaction & Share Footer */}
          <div className="pt-8 mt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                className={`px-5 py-2.5 rounded-full border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  hasLiked
                    ? "bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20"
                    : "bg-background border-border text-foreground hover:border-brand-red hover:text-brand-red"
                }`}
              >
                <Heart size={14} className={hasLiked ? "fill-white" : ""} />
                <span>
                  {hasLiked
                    ? isBn
                      ? "পছন্দ করেছেন"
                      : "Appreciated"
                    : isBn
                    ? "ভালো লেগেছে"
                    : "Appreciate"}{" "}
                  ({likes})
                </span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-5 py-2.5 rounded-full bg-background border border-border hover:border-foreground/30 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-600">
                      {isBn ? "লিংক কপি হয়েছে" : "Link Copied"}
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>{isBn ? "শেয়ার করুন" : "Share Link"}</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href="/contact"
              className="text-xs font-bold text-brand-red hover:underline"
            >
              {isBn ? "এ বিষয়ে কথা বলতে চান? →" : "Discuss this with Antor →"}
            </Link>
          </div>
        </div>

        {/* Next Story */}
        {nextEntry && nextEntry.id !== entry.id && (
          <Link
            href={`/journal/${nextEntry.slug}`}
            className="block bg-surface border border-border hover:border-brand-red/40 rounded-3xl p-7 transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted block mb-1">
                  {isBn ? "পরবর্তী লেখা" : "Next in Journal"}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black group-hover:text-brand-red transition-colors">
                  {nextEntry.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red shrink-0">
                {isBn ? "পড়ুন" : "Read Story"}
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </span>
            </div>
          </Link>
        )}
      </article>
    </main>
  );
}
