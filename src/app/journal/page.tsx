"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  Heart,
  Lock,
  Milestone,
  PenTool,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  Unlock,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  COVER_PRESETS,
  DEFAULT_JOURNAL_ENTRIES,
  JOURNAL_CATEGORIES,
  estimateReadTime,
  type JournalCategory,
  type JournalEntry,
} from "@/config/journal";

const JOURNEY_TIMELINE_BASE = [
  {
    year: "May 2026 – Ongoing",
    titleEn: "Creative Head — Canvas",
    titleBn: "ক্রিয়েটিভ হেড — Canvas",
    descEn:
      "Leading visual strategy, packaging dielines, e-commerce hero concepts, and UI consulting in Dhaka.",
    descBn:
      "ভিজ্যুয়াল স্ট্র্যাটেজি, প্যাকেজিং ডাইলাইন, ই-কমার্স হিরো ব্যানার এবং UI কনসাল্টিং পরিচালনা।",
    tag: "Leadership",
  },
  {
    year: "2026",
    titleEn: "BFA in Graphic Design — University of Dhaka",
    titleBn: "বিএফএ (গ্রাফিক ডিজাইন) — ঢাকা বিশ্ববিদ্যালয়",
    descEn:
      "Faculty of Fine Arts (Charukola), University of Dhaka — blending classical drawing foundations with modern visual media.",
    descBn:
      "চারুকলা অনুষদ, ঢাকা বিশ্ববিদ্যালয় — ঐতিহ্যবাহী অঙ্কন ও আধুনিক ডিজিটাল ভিজ্যুয়াল মিডিয়ার সমন্বয়।",
    tag: "Education",
  },
  {
    year: "2025 – 2026",
    titleEn: "Graphic Designer — Bisorgo Technology",
    titleBn: "গ্রাফিক ডিজাইনার — Bisorgo Technology",
    descEn:
      "Crafted catalogs, promotional leaflets, posters, and daily social brand assets for the Hotel Okada project.",
    descBn:
      "Hotel Okada প্রজেক্টের ক্যাটালগ, লিফলেট, পোস্টার এবং দৈনিক সোশ্যাল মিডিয়া ভিজ্যুয়াল তৈরি।",
    tag: "Brand Design",
  },
  {
    year: "2025",
    titleEn: "Qayyum Chowdhury Memorial Award & TIB Honor",
    titleBn: "কাইয়ুম চৌধুরী স্মৃতি পুরস্কার ও TIB সম্মাননা",
    descEn:
      "Recognized at DU Graphic Design Annual Exhibition 2025 and 20th TIB Anti-Corruption Cartoon Competition.",
    descBn:
      "ঢাবি বার্ষিক প্রদর্শনী ২০২৫ ও ২০তম TIB কার্টুন প্রতিযোগিতায় স্পেশাল মেনশন অর্জন।",
    tag: "Award",
  },
  {
    year: "2024 – 2025",
    titleEn: "Graphic Designer — Centre for Climate Justice-Bangladesh",
    titleBn: "গ্রাফিক ডিজাইনার — CCJ-B",
    descEn:
      "Designed crests, folders, banners, and workshop branding materials for 10+ climate justice events.",
    descBn:
      "১০টির বেশি জলবায়ু বিষয়ক কর্মশালার ক্রেস্ট, ফোল্ডার, ব্যানার এবং ব্র্যান্ডিং তৈরি।",
    tag: "Impact",
  },
  {
    year: "2023 – 2025",
    titleEn: "Animator — Communion Media Agency",
    titleBn: "অ্যানিমেটর — Communion Media Agency",
    descEn:
      "Animated Deepto TV's 'Jhumur and Biva', 30+ ICT Division DIKKHA courses, Radiant campaigns & Green Frame books.",
    descBn:
      "দীপ্ত টিভির 'ঝুমুর ও বিভা', ৩০+ ICT ই-লার্নিং কোর্স, রেডিয়েন্ট ও গ্রিন ফ্রেম প্রজেক্টে অ্যানিমেশন।",
    tag: "Animation",
  },
  {
    year: "2019 – 2021",
    titleEn: "Early Roots — Shalikha, Magura",
    titleBn: "শুরুর দিনগুলো — শালিখা, মাগুরা",
    descEn:
      "Completed SSC (Singra-Tilkhari Secondary School) and HSC (Biharilal Sikder Govt. College) before moving to Dhaka.",
    descBn:
      "মাগুরায় এসএসসি ও এইচএসসি সম্পন্ন করে ঢাকায় চারুকলায় নতুন যাত্রা শুরু।",
    tag: "Roots",
  },
];

interface FormState {
  id?: string;
  title: string;
  category: JournalCategory;
  mood: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  featured: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "Thoughts",
  mood: "Reflection",
  date: "",
  excerpt: "",
  content: "",
  image: COVER_PRESETS[0].url,
  featured: false,
};

export default function JournalPage() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";

  const [entries, setEntries] = useState<JournalEntry[]>(DEFAULT_JOURNAL_ENTRIES);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"feed" | "timeline">("feed");
  const [activeCategory, setActiveCategory] = useState<"All" | JournalCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Author mode & modals
  const [isAuthor, setIsAuthor] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [composerOpen, setComposerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    const isSessionAuth = sessionStorage.getItem("admin_auth_session") === "true";
    const isLocalAuth = localStorage.getItem("admin_auth_local") === "true";
    if (isSessionAuth || isLocalAuth) {
      setIsAuthor(true);
    }

    try {
      const savedLikes = JSON.parse(localStorage.getItem("journal_liked_ids") || "[]");
      if (Array.isArray(savedLikes)) setLikedIds(savedLikes);
    } catch {
      // Ignore storage errors
    }

    fetch("/api/journal")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          setEntries(data.entries);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const catMatch = activeCategory === "All" || entry.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const textMatch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.excerpt.toLowerCase().includes(q) ||
        entry.mood.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [entries, activeCategory, searchQuery]);

  const featuredEntry = useMemo(() => {
    if (activeCategory !== "All" || searchQuery.trim()) return null;
    return filteredEntries.find((e) => e.featured) || filteredEntries[0] || null;
  }, [filteredEntries, activeCategory, searchQuery]);

  const gridEntries = useMemo(() => {
    if (!featuredEntry) return filteredEntries;
    return filteredEntries.filter((e) => e.id !== featuredEntry.id);
  }, [filteredEntries, featuredEntry]);

  const handleReact = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (likedIds.includes(id)) return;
    const nextLiked = [...likedIds, id];
    setLikedIds(nextLiked);
    localStorage.setItem("journal_liked_ids", JSON.stringify(nextLiked));

    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item))
    );

    try {
      await fetch("/api/journal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "like" }),
      });
    } catch {
      // Optimistic count stays
    }
  };

  const handleOpenWrite = () => {
    if (isAuthor) {
      setForm(EMPTY_FORM);
      setFormError("");
      setComposerOpen(true);
    } else {
      setAuthError("");
      setAuthModalOpen(true);
    }
  };

  const handleUnlockAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!password.trim()) {
      setAuthError(isBn ? "পাসওয়ার্ড দিন।" : "Please enter your password.");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("admin_auth_session", "true");
        setIsAuthor(true);
        setAuthModalOpen(false);
        setPassword("");
        setForm(EMPTY_FORM);
        setComposerOpen(true);
      } else {
        setAuthError(data.error || (isBn ? "ভুল পাসওয়ার্ড।" : "Invalid password."));
      }
    } catch {
      setAuthError(isBn ? "সার্ভারে সংযোগ করা যাচ্ছে না।" : "Connection failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEditEntry = (entry: JournalEntry, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setForm({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      mood: entry.mood,
      date: entry.date,
      excerpt: entry.excerpt,
      content: entry.content,
      image: entry.image,
      featured: entry.featured,
    });
    setFormError("");
    setComposerOpen(true);
  };

  const handleDeleteEntry = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(isBn ? "এই লেখাটি মুছে ফেলতে চান?" : "Delete this journal entry permanently?")) {
      return;
    }

    try {
      const res = await fetch(`/api/journal?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.entries)) {
        setEntries(data.entries);
      }
    } catch {
      // Ignore error
    }
  };

  const handleToggleFeatured = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/journal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "feature" }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.entries)) {
        setEntries(data.entries);
      }
    } catch {
      // Ignore
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.content.trim()) {
      setFormError(
        isBn ? "শিরোনাম এবং মূল লেখা অবশ্যই লিখতে হবে।" : "Title and full story content are required."
      );
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(form.id);
      const res = await fetch("/api/journal", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.entries)) {
        setEntries(data.entries);
        setComposerOpen(false);
        setForm(EMPTY_FORM);
      } else {
        setFormError(data.error || "Failed to save entry.");
      }
    } catch {
      setFormError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-28 md:pt-36 pb-28 overflow-hidden selection:bg-brand-red selection:text-white">
      {/* Subtle Ambient Background */}
      <div className="absolute -top-24 right-0 w-[440px] h-[440px] bg-brand-red/[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-brand-tan/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 space-y-12">
        {/* EDITORIAL HERO HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/70 pb-10"
        >
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full font-bold text-xs tracking-wide">
              <BookOpen size={13} />
              {isBn ? "অন্তরের নোটবুক ও অভিজ্ঞতা" : "Personal Notebook & Reflections"}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-[1.06]">
              {isBn ? "আমার যাত্রা ও" : "Journey &"}{" "}
              <span className="text-brand-red">{isBn ? "ভাবনার জগত" : "Creative Thoughts"}</span>
            </h1>

            <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl">
              {isBn
                ? "মাগুরা থেকে ঢাকা বিশ্ববিদ্যালয়ের চারুকলা, অ্যানিমেশন স্টুডিও থেকে ক্রিয়েটিভ ডিরেকশন—আমার কাজের অভিজ্ঞতা, শেখা ও ভাবনাগুলোর সংগ্রহ।"
                : "Stories, lessons, and candid thoughts from my path across Fine Arts at the University of Dhaka, national animation pipelines, and creative leadership."}
            </p>
          </div>

          {/* Author & View Switcher Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Feed vs Timeline Toggle */}
            <div className="bg-surface border border-border rounded-full p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode("feed")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "feed"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Sparkles size={13} />
                {isBn ? "লেখাসমূহ" : "Stories"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "timeline"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Milestone size={13} />
                {isBn ? "যাত্রার টাইমলাইন" : "Journey Map"}
              </button>
            </div>

            {/* Write / Author Studio Trigger */}
            <button
              type="button"
              onClick={handleOpenWrite}
              className="px-5 py-2.5 rounded-full bg-brand-red hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-red/20 transition-all cursor-pointer"
            >
              {isAuthor ? <Plus size={14} /> : <PenTool size={14} />}
              <span>{isBn ? "নতুন লেখা যোগ করুন" : "Share Thought"}</span>
            </button>

            {isAuthor && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <Unlock size={12} />
                {isBn ? "অথর মোড চালু" : "Author Mode"}
              </span>
            )}
          </div>
        </motion.section>

        {/* STORIES & THOUGHTS VIEW */}
        {viewMode === "feed" ? (
          <div className="space-y-10">
            {/* Search & Category Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {JOURNAL_CATEGORIES.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        active
                          ? "bg-brand-red text-white border-brand-red shadow-sm"
                          : "bg-surface border-border text-muted hover:text-foreground hover:border-brand-red/30"
                      }`}
                    >
                      {isBn ? cat.labelBn : cat.labelEn}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-72">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBn ? "লেখা বা টপিক খুঁজুন..." : "Search thoughts or topics..."}
                  className="w-full bg-surface border border-border focus:border-brand-red rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted/70 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex items-center justify-center text-muted gap-3">
                <Loader2 size={20} className="animate-spin text-brand-red" />
                <span className="text-sm font-medium">
                  {isBn ? "জার্নাল লোড হচ্ছে..." : "Loading journal entries..."}
                </span>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="bg-surface border border-border rounded-3xl p-14 text-center space-y-4">
                <p className="text-lg font-serif font-bold">
                  {isBn ? "কোনো লেখা পাওয়া যায়নি" : "No matching entries found"}
                </p>
                <p className="text-xs text-muted">
                  {isBn
                    ? "অন্য ক্যাটাগরি বেছে নিন অথবা নতুন একটি ভাবনা শেয়ার করুন।"
                    : "Try clearing your search filter or publish a new thought."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-5 py-2.5 rounded-full bg-background border border-border text-xs font-bold hover:border-brand-red cursor-pointer"
                >
                  {isBn ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
                </button>
              </div>
            ) : (
              <>
                {/* FEATURED ENTRY CARD */}
                {featuredEntry && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      href={`/journal/${featuredEntry.slug}`}
                      className="group bg-surface border border-border colorful-card rounded-[2.25rem] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-[0_15px_50px_rgba(28,27,24,0.03)]"
                    >
                      <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[280px] overflow-hidden bg-surface-heavy">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featuredEntry.image}
                          alt={featuredEntry.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                            {isBn ? "বিশেষ লেখা" : "Featured"}
                          </span>
                          <span className="bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-border">
                            {featuredEntry.category}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-6 p-8 md:p-10 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar size={13} className="text-brand-red" />
                              {featuredEntry.date}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={13} />
                              {estimateReadTime(featuredEntry.content)} min read
                            </span>
                            <span>•</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-background border border-border text-[11px] font-semibold">
                              {featuredEntry.mood}
                            </span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black leading-tight group-hover:text-brand-red transition-colors">
                            {featuredEntry.title}
                          </h2>

                          <p className="text-muted text-sm sm:text-base leading-relaxed line-clamp-3">
                            {featuredEntry.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/60">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
                            {isBn ? "পুরোটা পড়ুন" : "Read Story"}
                            <ArrowRight
                              size={15}
                              className="group-hover:translate-x-1.5 transition-transform"
                            />
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleReact(featuredEntry.id, e)}
                              className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                likedIds.includes(featuredEntry.id)
                                  ? "bg-brand-red/10 border-brand-red/30 text-brand-red"
                                  : "bg-background border-border text-muted hover:text-brand-red"
                              }`}
                            >
                              <Heart
                                size={13}
                                className={
                                  likedIds.includes(featuredEntry.id) ? "fill-brand-red" : ""
                                }
                              />
                              <span>{featuredEntry.likes || 0}</span>
                            </button>

                            {isAuthor && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => handleEditEntry(featuredEntry, e)}
                                  title="Edit"
                                  className="p-2 rounded-full bg-background border border-border text-muted hover:text-foreground cursor-pointer"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteEntry(featuredEntry.id, e)}
                                  title="Delete"
                                  className="p-2 rounded-full bg-background border border-border text-muted hover:text-brand-red cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* ENTRIES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridEntries.map((entry, idx) => {
                    const isLiked = likedIds.includes(entry.id);
                    return (
                      <motion.article
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: idx * 0.05 }}
                      >
                        <Link
                          href={`/journal/${entry.slug}`}
                          className="bg-surface border border-border colorful-card rounded-3xl overflow-hidden flex flex-col h-full group shadow-[0_8px_30px_rgba(0,0,0,0.01)]"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-surface-heavy">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={entry.image}
                              alt={entry.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-border">
                              {entry.category}
                            </span>
                            {isAuthor && (
                              <button
                                type="button"
                                onClick={(e) => handleToggleFeatured(entry.id, e)}
                                title={entry.featured ? "Featured" : "Set as Featured"}
                                className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md cursor-pointer ${
                                  entry.featured
                                    ? "bg-brand-red text-white border-brand-red"
                                    : "bg-background/85 text-muted border-border hover:text-brand-red"
                                }`}
                              >
                                <Star size={12} className={entry.featured ? "fill-white" : ""} />
                              </button>
                            )}
                          </div>

                          <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-[11px] text-muted font-medium">
                                <span>{entry.date}</span>
                                <span>{estimateReadTime(entry.content)} min read</span>
                              </div>

                              <h3 className="text-xl font-serif font-bold leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                                {entry.title}
                              </h3>

                              <p className="text-sm text-muted leading-relaxed line-clamp-3">
                                {entry.excerpt}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-background border border-border text-muted">
                                {entry.mood}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => handleReact(entry.id, e)}
                                  className={`px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                    isLiked
                                      ? "bg-brand-red/10 border-brand-red/30 text-brand-red"
                                      : "bg-background border-border text-muted hover:text-brand-red"
                                  }`}
                                >
                                  <Heart size={12} className={isLiked ? "fill-brand-red" : ""} />
                                  <span>{entry.likes || 0}</span>
                                </button>

                                {isAuthor && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => handleEditEntry(entry, e)}
                                      className="p-1.5 rounded-full bg-background border border-border text-muted hover:text-foreground cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit3 size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteEntry(entry.id, e)}
                                      className="p-1.5 rounded-full bg-background border border-border text-muted hover:text-brand-red cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : (
          /* JOURNEY TIMELINE VIEW */
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Chronological Career & Life Timeline */}
            <div className="lg:col-span-7 bg-surface border border-border rounded-[2.25rem] p-7 sm:p-10 space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black">
                  {isBn ? "আমার ক্রিয়েটিভ যাত্রা" : "Creative Journey Timeline"}
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  {isBn
                    ? "শিক্ষাজীবন থেকে প্রফেশনাল অ্যানিমেশন ও ক্রিয়েটিভ লিডারশিপ পর্যন্ত গুরুত্বপূর্ণ ধাপসমূহ।"
                    : "Key chapters shaping my growth from Magura to Dhaka University and Creative Direction."}
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-border space-y-8">
                {JOURNEY_TIMELINE_BASE.map((step, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-brand-red border-4 border-surface" />
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2.5 py-0.5 rounded-full">
                        {step.year}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-background border border-border px-2.5 py-0.5 rounded-full">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {isBn ? step.titleBn : step.titleEn}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mt-1">
                      {isBn ? step.descBn : step.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Journey & Milestone Journal Stories */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-surface border border-border rounded-3xl p-6 space-y-2">
                <h3 className="text-xl font-serif font-bold">
                  {isBn ? "সম্পর্কিত নোট ও গল্প" : "Chapters Written About This Path"}
                </h3>
                <p className="text-xs text-muted">
                  {isBn
                    ? "যাত্রার প্রতিটি ধাপের পেছনের গল্প ও অনুভূতিগুলো পড়ুন।"
                    : "Deep-dive reflections and behind-the-scenes stories from these milestones."}
                </p>
              </div>

              {entries
                .filter((e) => e.category === "Journey" || e.category === "Milestone")
                .map((item) => (
                  <Link
                    key={item.id}
                    href={`/journal/${item.slug}`}
                    className="block bg-surface border border-border hover:border-brand-red/40 rounded-3xl p-6 transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-muted font-medium mb-2">
                      <span className="text-brand-red font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="text-lg font-serif font-bold group-hover:text-brand-red transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground group-hover:text-brand-red">
                      {isBn ? "গল্পটি পড়ুন" : "Read Entry"}
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* AUTHOR UNLOCK MODAL */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-3xl w-full max-w-sm p-7 space-y-5 relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background border border-border text-muted hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="text-center space-y-2 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red border border-brand-red/20 flex items-center justify-center mx-auto">
                  <Lock size={20} />
                </div>
                <h3 className="text-xl font-serif font-black">
                  {isBn ? "অথর অ্যাক্সেস" : "Author Studio Unlock"}
                </h3>
                <p className="text-xs text-muted">
                  {isBn
                    ? "নতুন গল্প বা ভাবনা লিখতে আপনার অ্যাডমিন পাসওয়ার্ড দিন।"
                    : "Enter your admin password to write, edit, or publish journal entries."}
                </p>
              </div>

              <form onSubmit={handleUnlockAuthor} className="space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isBn ? "অ্যাডমিন পাসওয়ার্ড" : "Admin password"}
                  className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-brand-red font-bold text-center">{authError}</p>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl bg-brand-red text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>{isBn ? "আনলক করুন" : "Unlock Author Mode"}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WRITE / EDIT COMPOSER MODAL */}
      <AnimatePresence>
        {composerOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-surface border border-border rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 space-y-5 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-2xl font-serif font-black">
                    {form.id
                      ? isBn
                        ? "লেখা এডিট করুন"
                        : "Edit Journal Entry"
                      : isBn
                      ? "নতুন গল্প বা ভাবনা লিখুন"
                      : "Share Your Journey or Thought"}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {isBn
                      ? "সংরক্ষণ করলে সাথে সাথে আপনার জার্নালে প্রকাশ পাবে।"
                      : "Published immediately to your live journal."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="p-2 rounded-full bg-background border border-border text-muted hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                    {isBn ? "শিরোনাম *" : "Title *"}
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={
                      isBn ? "যেমন: আমার নতুন প্রজেক্টের অভিজ্ঞতা" : "e.g. Lessons from Leading a Design Exhibition"
                    }
                    className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                      {isBn ? "ক্যাটাগরি" : "Category"}
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value as JournalCategory })
                      }
                      className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-3.5 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="Journey">Journey</option>
                      <option value="Thoughts">Thoughts</option>
                      <option value="Process">Process</option>
                      <option value="Milestone">Milestone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                      {isBn ? "মুড / ট্যাগ" : "Mood / Tag"}
                    </label>
                    <input
                      type="text"
                      value={form.mood}
                      onChange={(e) => setForm({ ...form, mood: e.target.value })}
                      placeholder="e.g. Reflection"
                      className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-3.5 py-3 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                      {isBn ? "তারিখ (ঐচ্ছিক)" : "Display Date"}
                    </label>
                    <input
                      type="text"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="Auto (Today)"
                      className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-3.5 py-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    {isBn ? "কভার ছবির লিংক" : "Cover Image URL"}
                  </label>
                  <div className="relative">
                    <ImageIcon
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-background border border-border focus:border-brand-red rounded-2xl pl-9 pr-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COVER_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setForm({ ...form, image: preset.url })}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-background border border-border hover:border-brand-red/40 text-muted hover:text-foreground cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                    {isBn ? "সংক্ষিপ্ত সারাংশ" : "Short Excerpt"}
                  </label>
                  <input
                    type="text"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder={
                      isBn ? "কার্ডে দেখানোর জন্য ১–২ লাইনের সারাংশ" : "1–2 sentence hook shown on the journal card"
                    }
                    className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-4 py-3 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                    {isBn ? "মূল লেখা *" : "Full Story / Thought * (use '> ' for quotes)"}
                  </label>
                  <textarea
                    rows={6}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder={
                      isBn
                        ? "আপনার গল্প, অভিজ্ঞতা বা ভাবনাগুলো এখানে লিখুন..."
                        : "Write your story, reflection, or lesson learned..."
                    }
                    className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-4 py-3 text-sm leading-relaxed focus:outline-none resize-y"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-brand-red w-4 h-4"
                  />
                  <span>
                    {isBn ? "শীর্ষে ফিচার্ড লেখা হিসেবে দেখান" : "Pin as Featured story on top"}
                  </span>
                </label>

                {formError && (
                  <p className="text-xs font-bold text-brand-red">{formError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setComposerOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-background border border-border text-xs font-bold cursor-pointer"
                  >
                    {isBn ? "বাতিল" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-2xl bg-brand-red text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    <span>
                      {form.id
                        ? isBn
                          ? "আপডেট করুন"
                          : "Save Changes"
                        : isBn
                        ? "প্রকাশ করুন"
                        : "Publish Entry"}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
