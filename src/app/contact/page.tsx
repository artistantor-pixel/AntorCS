"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  MessageCircle,
  Clock,
  Sparkles,
  Send,
  RefreshCw,
  Download,
  Calculator,
  Briefcase,
  CheckCircle2,
  Globe,
  Link2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_INFO, getWhatsAppUrl } from "@/config/contact";
import { EXPERTISE_LIST } from "@/config/expertise";

const BUDGET_TIERS = [
  { id: "starter", range: "৳15K – ৳30K", labelEn: "Starter", labelBn: "স্টার্টার" },
  { id: "growth", range: "৳30K – ৳75K", labelEn: "Standard", labelBn: "স্ট্যান্ডার্ড" },
  { id: "pro", range: "৳75K – ৳150K", labelEn: "Full Brand", labelBn: "ফুল ব্র্যান্ড" },
  { id: "enterprise", range: "৳150K+", labelEn: "Custom Scale", labelBn: "কাস্টম স্কেল" },
];

const TIMELINES = [
  { id: "rush", labelEn: "Urgent (1–2 wks)", labelBn: "জরুরি (১–২ সপ্তাহ)" },
  { id: "standard", labelEn: "Standard (2–6 wks)", labelBn: "সাধারণ (২–৬ সপ্তাহ)" },
  { id: "flexible", labelEn: "Flexible Schedule", labelBn: "সুবিধাজনক সময়" },
];

export default function ContactPage() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";

  // Form State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [budgetTier, setBudgetTier] = useState("growth");
  const [timeline, setTimeline] = useState("standard");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [details, setDetails] = useState("");

  // UI States
  const [isCopied, setIsCopied] = useState(false);
  const [isPhoneCopied, setIsPhoneCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dhaka Time State
  const [dhakaTime, setDhakaTime] = useState("");
  const [isDhakaActive, setIsDhakaActive] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const dhakaDate = new Date(utc + 3600000 * 6);

      const hours = dhakaDate.getHours();
      const minutes = dhakaDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

      setDhakaTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
      setIsDhakaActive(hours >= 9 && hours < 23);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const serviceOptions = useMemo(() => {
    const base = EXPERTISE_LIST.map((item) => ({
      id: item.slug,
      labelEn: item.en.title,
      labelBn: item.bn.title,
    }));
    return [
      ...base,
      { id: "custom", labelEn: "Custom / Other", labelBn: "কাস্টম / অন্যান্য" },
    ];
  }, []);

  const copyText = (text: string, setFlag: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), 2200);
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      errors.name = isBn ? "আপনার নাম লিখুন।" : "Full name is required.";
    }
    if (!emailPattern.test(email.trim())) {
      errors.email = isBn ? "একটি সঠিক ইমেইল দিন।" : "Please enter a valid email.";
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 10) {
      errors.phone = isBn
        ? "সঠিক মোবাইল বা হোয়াটসঅ্যাপ নম্বর দিন।"
        : "Valid phone or WhatsApp number is required.";
    }
    if (!details.trim()) {
      errors.details = isBn
        ? "প্রজেক্ট সম্পর্কে সংক্ষিপ্ত বিবরণ দিন।"
        : "Please share a short project description.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildBriefMessage = () => {
    const chosenServices =
      selectedServices.length > 0
        ? selectedServices
            .map((id) => {
              const found = serviceOptions.find((o) => o.id === id);
              return found ? found.labelEn : id;
            })
            .join(", ")
        : "General Creative Inquiry";

    const chosenBudget =
      BUDGET_TIERS.find((b) => b.id === budgetTier)?.range || budgetTier;
    const chosenTimeline =
      TIMELINES.find((t) => t.id === timeline)?.labelEn || timeline;

    return [
      `Hi Antor, I'd like to discuss a project!`,
      ``,
      `Name: ${name.trim()}`,
      company.trim() ? `Brand/Company: ${company.trim()}` : null,
      `Email: ${email.trim()}`,
      `Phone/WhatsApp: ${phone.trim()}`,
      `Services: ${chosenServices}`,
      `Budget Range: ${chosenBudget}`,
      `Timeline: ${chosenTimeline}`,
      referenceUrl.trim() ? `Reference: ${referenceUrl.trim()}` : null,
      ``,
      `Project Brief:`,
      details.trim(),
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const handleDirectWhatsApp = () => {
    if (!validateForm()) return;
    window.open(getWhatsAppUrl(buildBriefMessage()), "_blank", "noopener,noreferrer");
  };

  const mailtoInquiryHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
    `Project Inquiry from ${name.trim() || "Client"}`
  )}&body=${encodeURIComponent(buildBriefMessage())}`;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setSelectedServices([]);
    setBudgetTier("growth");
    setTimeline("standard");
    setReferenceUrl("");
    setDetails("");
    setIsSuccess(false);
    setFormErrors({});
  };

  const selectedBudgetLabel =
    BUDGET_TIERS.find((b) => b.id === budgetTier)?.range || "৳30K – ৳75K";

  return (
    <main className="relative min-h-screen bg-transparent text-foreground pt-28 md:pt-36 pb-28 overflow-hidden selection:bg-brand-red selection:text-white">
      {/* Subtle Ambient Background Accents */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-brand-red/[0.06] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[460px] h-[460px] bg-brand-tan/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 space-y-12 md:space-y-16">
        {/* TOP HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/70 pb-10"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full font-bold text-xs tracking-wide">
              <Sparkles size={13} />
              {isBn ? "যোগাযোগ ও প্রজেক্ট ব্রিফ" : "Collaboration & Inquiries"}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-[1.08]">
              {isBn ? "আসুন একসাথে" : "Let's Craft Your"}{" "}
              <span className="text-brand-red">
                {isBn ? "অসাধারণ কিছু তৈরি করি" : "Next Visual Story"}
              </span>
            </h1>

            <p className="text-muted text-base md:text-lg leading-relaxed">
              {isBn
                ? "ব্র্যান্ডিং, মোশন ডিজাইন, অ্যানিমেশন বা UI/UX প্রজেক্ট নিয়ে আলোচনা করতে চাইলে সরাসরি মেসেজ করুন অথবা পাশের প্রজেক্ট ব্রিফটি পূরণ করুন।"
                : "Have a branding, motion design, 2D/3D animation, or UI/UX project in mind? Reach out directly or send a brief below—I typically respond within a few hours."}
            </p>
          </div>

          {/* Live Availability & Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="bg-surface border border-border rounded-2xl px-4 py-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                {isBn ? "স্ট্যাটাস" : "Status"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center justify-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isBn ? "উপলব্ধ" : "Available"}
              </span>
            </div>

            <div className="bg-surface border border-border rounded-2xl px-4 py-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                {isBn ? "রেসপন্স" : "Reply Time"}
              </span>
              <span className="text-xs sm:text-sm font-black text-foreground mt-1 block">
                {isBn ? "২–৬ ঘণ্টা" : "2–6 Hours"}
              </span>
            </div>

            <div className="bg-surface border border-border rounded-2xl px-4 py-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                {isBn ? "কাজের ধরন" : "Coverage"}
              </span>
              <span className="text-xs sm:text-sm font-black text-foreground flex items-center justify-center gap-1 mt-1">
                <Globe size={13} className="text-brand-red" />
                {isBn ? "বিশ্বব্যাপী" : "Worldwide"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* MAIN 2-COLUMN BENTO + BRIEF FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: DIRECT CONTACT CARDS & QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* 1. Direct Email Card */}
            <div className="bg-surface border border-border colorful-card rounded-3xl p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/15 flex items-center justify-center text-brand-red shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold block">
                      {isBn ? "সরাসরি ইমেইল" : "Direct Email"}
                    </span>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-base sm:text-lg font-bold text-foreground hover:text-brand-red transition-colors break-all"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => copyText(CONTACT_INFO.email, setIsCopied)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-background border border-border hover:border-brand-red/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      <span className="text-emerald-600">{isBn ? "কপি হয়েছে!" : "Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-muted" />
                      <span>{isBn ? "ইমেইল কপি করুন" : "Copy Email"}</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="py-2.5 px-4 rounded-xl bg-brand-red text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <span>{isBn ? "মেইল পাঠান" : "Send Mail"}</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* 2. Phone & WhatsApp Card */}
            <div className="bg-surface border border-border colorful-card rounded-3xl p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold block">
                      {isBn ? "ফোন ও হোয়াটসঅ্যাপ" : "Phone & WhatsApp"}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-foreground font-mono">
                      {CONTACT_INFO.phoneDisplay}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyText(CONTACT_INFO.phoneRaw, setIsPhoneCopied)}
                  title="Copy number"
                  className="p-2.5 rounded-xl bg-background border border-border text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  {isPhoneCopied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="flex gap-2.5 pt-1">
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-background border border-border hover:border-foreground/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone size={14} className="text-muted" />
                  <span>{isBn ? "কল করুন" : "Call Now"}</span>
                </a>
                <a
                  href={getWhatsAppUrl("Hello Antor, I'd like to discuss a project!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>{isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp Chat"}</span>
                </a>
              </div>
            </div>

            {/* 3. Studio Address & Live Dhaka Time Card */}
            <div className="bg-surface border border-border rounded-3xl p-6 flex items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-tan/20 border border-brand-tan/30 flex items-center justify-center text-foreground shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold block">
                    {isBn ? "অবস্থান ও স্থানীয় সময়" : "Location & Local Time"}
                  </span>
                  <span className="text-sm font-bold text-foreground block mt-0.5">
                    {CONTACT_INFO.address}
                  </span>
                  <span className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                    <Clock size={12} />
                    {CONTACT_INFO.city} · {dhakaTime || "GMT+6"}
                  </span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                  isDhakaActive
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                }`}
              >
                {isDhakaActive
                  ? isBn
                    ? "অনলাইন"
                    : "Active"
                  : isBn
                  ? "বিশ্রামে"
                  : "Off Hours"}
              </span>
            </div>

            {/* 4. Quick Links & Resources */}
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] uppercase tracking-widest text-muted font-bold block">
                {isBn ? "দরকারি লিংকসমূহ" : "Helpful Shortcuts"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={CONTACT_INFO.cvPath}
                  download={CONTACT_INFO.cvFileName}
                  className="p-3.5 rounded-2xl bg-background border border-border hover:border-brand-red/40 flex items-center justify-between text-xs font-bold transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Download size={14} className="text-brand-red" />
                    {isBn ? "সিভি ডাউনলোড" : "Download CV"}
                  </span>
                  <ArrowRight
                    size={13}
                    className="text-muted group-hover:translate-x-0.5 transition-transform"
                  />
                </a>

                <Link
                  href="/calculator"
                  className="p-3.5 rounded-2xl bg-background border border-border hover:border-brand-red/40 flex items-center justify-between text-xs font-bold transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Calculator size={14} className="text-brand-red" />
                    {isBn ? "বাজেট ক্যালকুলেটর" : "Cost Estimator"}
                  </span>
                  <ArrowRight
                    size={13}
                    className="text-muted group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>

                <a
                  href="https://www.behance.net/antorkumarbiswas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-background border border-border hover:border-brand-red/40 flex items-center justify-between text-xs font-bold transition-colors group"
                >
                  <span>Behance Showcase</span>
                  <ArrowUpRight
                    size={14}
                    className="text-muted group-hover:text-brand-red transition-colors"
                  />
                </a>

                <Link
                  href="/hire"
                  className="p-3.5 rounded-2xl bg-background border border-border hover:border-brand-red/40 flex items-center justify-between text-xs font-bold transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={14} className="text-brand-red" />
                    {isBn ? "টিমে নিয়োগ দিন" : "Recruit / Hire"}
                  </span>
                  <ArrowRight
                    size={13}
                    className="text-muted group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: INTERACTIVE PROJECT BRIEF BUILDER */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-surface border border-border p-6 sm:p-8 md:p-10 rounded-[2.25rem] shadow-[0_20px_60px_rgba(28,27,24,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-56 h-56 bg-brand-red/[0.04] rounded-full blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-7 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/70">
                      <div>
                        <h2 className="text-2xl font-serif font-black text-foreground">
                          {isBn ? "প্রজেক্ট ব্রিফ পাঠান" : "Start a Project Brief"}
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                          {isBn
                            ? "প্রয়োজনীয় তথ্য পূরণ করে পাঠিয়ে দিন বা সরাসরি হোয়াটসঅ্যাপ করুন।"
                            : "Share your project scope below or launch it directly in WhatsApp."}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full w-fit">
                        {selectedBudgetLabel}
                      </span>
                    </div>

                    {/* Step 1: Services */}
                    <div className="space-y-3">
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-bold">
                        {isBn
                          ? "১. কোন কোন সেবা প্রয়োজন? (একাধিক নির্বাচন করা যাবে)"
                          : "1. What services do you need?"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {serviceOptions.map((option) => {
                          const isSelected = selectedServices.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleServiceToggle(option.id)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? "bg-brand-red text-white border-brand-red shadow-sm"
                                  : "bg-background text-muted border-border hover:border-brand-red/40 hover:text-foreground"
                              }`}
                            >
                              {isSelected && <Check size={12} />}
                              <span>{isBn ? option.labelBn : option.labelEn}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Client Details */}
                    <div className="space-y-4">
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-bold">
                        {isBn ? "২. আপনার পরিচয় ও যোগাযোগ" : "2. Your Contact Details"}
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder={isBn ? "আপনার পূর্ণ নাম *" : "Full Name *"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted/70 focus:outline-none transition-all ${
                              formErrors.name
                                ? "border-brand-red ring-2 ring-brand-red/15"
                                : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.name && (
                            <p className="text-[11px] text-brand-red font-bold pl-2">
                              {formErrors.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <input
                            type="email"
                            placeholder={isBn ? "ইমেইল এড্রেস *" : "Email Address *"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted/70 focus:outline-none transition-all ${
                              formErrors.email
                                ? "border-brand-red ring-2 ring-brand-red/15"
                                : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.email && (
                            <p className="text-[11px] text-brand-red font-bold pl-2">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder={
                              isBn
                                ? "ফোন / হোয়াটসঅ্যাপ নম্বর *"
                                : "Phone / WhatsApp Number *"
                            }
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted/70 focus:outline-none transition-all ${
                              formErrors.phone
                                ? "border-brand-red ring-2 ring-brand-red/15"
                                : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.phone && (
                            <p className="text-[11px] text-brand-red font-bold pl-2">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder={
                              isBn
                                ? "ব্র্যান্ড বা প্রতিষ্ঠানের নাম (ঐচ্ছিক)"
                                : "Brand / Company Name (Optional)"
                            }
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-background border border-border focus:border-brand-red rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted/70 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Budget Tier */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[11px] uppercase tracking-wider text-muted font-bold">
                          {isBn ? "৩. সম্ভাব্য বাজেট" : "3. Estimated Budget"}
                        </label>
                        <Link
                          href="/calculator"
                          className="text-[11px] font-bold text-brand-red hover:underline flex items-center gap-1"
                        >
                          <Calculator size={12} />
                          {isBn ? "সঠিক খরচ হিসাব করুন" : "Use Budget Calculator"}
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {BUDGET_TIERS.map((tier) => {
                          const active = budgetTier === tier.id;
                          return (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => setBudgetTier(tier.id)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                active
                                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                                  : "border-border bg-background hover:border-brand-red/30"
                              }`}
                            >
                              <span
                                className={`block text-[10px] font-bold uppercase tracking-wider ${
                                  active ? "text-brand-red" : "text-muted"
                                }`}
                              >
                                {isBn ? tier.labelBn : tier.labelEn}
                              </span>
                              <span className="block text-xs sm:text-sm font-mono font-black text-foreground mt-0.5">
                                {tier.range}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 4: Timeline */}
                    <div className="space-y-3">
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-bold">
                        {isBn ? "৪. ডেলিভারির সময়সীমা" : "4. Target Timeline"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {TIMELINES.map((item) => {
                          const active = timeline === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setTimeline(item.id)}
                              className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                                active
                                  ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm"
                                  : "border-border bg-background text-muted hover:border-brand-red/30 hover:text-foreground"
                              }`}
                            >
                              {isBn ? item.labelBn : item.labelEn}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 5: Details + Optional Reference */}
                    <div className="space-y-3">
                      <label className="block text-[11px] uppercase tracking-wider text-muted font-bold">
                        {isBn ? "৫. প্রজেক্টের বিস্তারিত লিখুন *" : "5. Project Vision & Brief *"}
                      </label>

                      <div className="space-y-1.5">
                        <textarea
                          rows={4}
                          placeholder={
                            isBn
                              ? "আপনার প্রজেক্টের লক্ষ্য, স্টাইল বা বিশেষ কোনো নির্দেশনা থাকলে লিখুন..."
                              : "Tell me about your goals, deliverables, creative direction, or any inspiration..."
                          }
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          className={`w-full bg-background border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted/70 focus:outline-none transition-all resize-none ${
                            formErrors.details
                              ? "border-brand-red ring-2 ring-brand-red/15"
                              : "border-border focus:border-brand-red"
                          }`}
                        />
                        {formErrors.details && (
                          <p className="text-[11px] text-brand-red font-bold pl-2">
                            {formErrors.details}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <Link2
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                        <input
                          type="url"
                          placeholder={
                            isBn
                              ? "রেফারেন্স লিংক বা ড্রাইভ ফোল্ডার (ঐচ্ছিক)"
                              : "Reference / Drive / Figma link (Optional)"
                          }
                          value={referenceUrl}
                          onChange={(e) => setReferenceUrl(e.target.value)}
                          className="w-full bg-background border border-border focus:border-brand-red rounded-2xl pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted/70 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-brand-red hover:opacity-95 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-red/20 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={15} className="animate-spin" />
                            {isBn ? "প্রস্তুত করা হচ্ছে..." : "Preparing Brief..."}
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            {isBn ? "ব্রিফ প্রস্তুত করুন" : "Review & Send Brief"}
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleDirectWhatsApp}
                        className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-colors text-xs uppercase tracking-wider cursor-pointer"
                      >
                        <MessageCircle size={15} />
                        {isBn ? "হোয়াটসঅ্যাপে পাঠান" : "Send on WhatsApp"}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-overlay"
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    className="py-10 text-center space-y-6 relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-2xl font-serif font-black text-foreground">
                        {isBn
                          ? "আপনার প্রজেক্ট ব্রিফ প্রস্তুত!"
                          : "Your Project Brief Is Ready!"}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">
                        {isBn
                          ? "নিচের বাটন থেকে এক ক্লিকেই অন্তর কুমার বিশ্বাসের হোয়াটসঅ্যাপ বা ইমেইলে সম্পূর্ণ ব্রিফটি পাঠিয়ে দিন।"
                          : "Deliver your formatted brief straight to Antor Kumar Biswas via WhatsApp or your Email app in one click."}
                      </p>
                    </div>

                    <div className="bg-background border border-border rounded-2xl p-5 text-left text-xs space-y-1.5 max-w-lg mx-auto">
                      <p>
                        <span className="font-bold text-muted">
                          {isBn ? "নাম:" : "Client:"}
                        </span>{" "}
                        <span className="font-bold text-foreground">{name}</span>
                      </p>
                      <p>
                        <span className="font-bold text-muted">
                          {isBn ? "বাজেট:" : "Budget:"}
                        </span>{" "}
                        <span className="font-mono font-bold text-brand-red">
                          {selectedBudgetLabel}
                        </span>
                      </p>
                      <p className="text-muted line-clamp-3 pt-1">{details}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                      <a
                        href={getWhatsAppUrl(buildBriefMessage())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle size={15} />
                        {isBn ? "হোয়াটসঅ্যাপে পাঠান" : "Send via WhatsApp"}
                      </a>
                      <a
                        href={mailtoInquiryHref}
                        className="px-6 py-3.5 rounded-2xl bg-brand-red hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-opacity"
                      >
                        <Mail size={15} />
                        {isBn ? "ইমেইলে পাঠান" : "Send via Email App"}
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs font-bold text-muted hover:text-brand-red underline pt-2 cursor-pointer"
                    >
                      {isBn ? "নতুন আরেকটি বার্তা লিখুন" : "Edit or Submit Another Brief"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
