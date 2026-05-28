"use client";

import { useState, useEffect } from "react";
import { motion as motionElement, AnimatePresence } from "framer-motion";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { 
  ArrowRight, Mail, Phone, Copy, Check, MessageCircle, Clock, 
  Sparkles, Send, RefreshCw, Briefcase, Download, GraduationCap, 
  Award, Layers, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HireMePage() {
  const { lang } = useLanguage();
  
  // Recruitment Form State
  const [companyName, setCompanyName] = useState("");
  const [hrName, setHrName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [positionType, setPositionType] = useState("full-time");
  const [offeredRange, setOfferedRange] = useState("medium");
  const [jobDescription, setJobDescription] = useState("");
  
  // UI states
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Skill Matrix details
  const skillsList = [
    { nameEn: "2D/3D Animation & Explainer Videos", nameBn: "২D/৩D অ্যানিমেশন ও ব্যাখ্যামূলক ভিডিও", pct: 95, color: "from-rose-500 to-red-600" },
    { nameEn: "Storyboarding & Visual Storytelling", nameBn: "স্টোরিবোর্ডিং ও ভিজ্যুয়াল স্টোরিটেলিং", pct: 90, color: "from-red-500 to-orange-500" },
    { nameEn: "Brand Strategy & Visual Identity", nameBn: "ব্র্যান্ড স্ট্র্যাটেজি ও ভিজ্যুয়াল আইডেন্টিটি", pct: 88, color: "from-orange-500 to-amber-500" },
    { nameEn: "Creative Direction & Curating", nameBn: "ক্রিয়েটিভ ডিরেকশন ও কিউরেশন", pct: 85, color: "from-rose-600 to-amber-600" },
    { nameEn: "UI/UX & Interactive Design Systems", nameBn: "UI/UX ও ইন্টারঅ্যাক্টিভ ডিজাইন সিস্টেম", pct: 82, color: "from-red-600 to-rose-500" }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@antorstudio.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!companyName.trim()) {
      errors.companyName = lang === "bn" ? "প্রতিষ্ঠানের নাম লিখুন।" : "Company name is required.";
    }
    if (!hrName.trim()) {
      errors.hrName = lang === "bn" ? "আপনার নাম বা পদের নাম লিখুন।" : "Your name/role is required.";
    }
    if (!emailPattern.test(email)) {
      errors.email = lang === "bn" ? "সঠিক অফিসিয়াল ইমেইল দিন।" : "Please enter a valid official email.";
    }
    if (!phone.trim() || phone.length < 11) {
      errors.phone = lang === "bn" ? "সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন।" : "Valid contact number is required.";
    }
    if (!jobDescription.trim()) {
      errors.jobDescription = lang === "bn" ? "পজিশন বা কাজের সংক্ষিপ্ত বিবরণ দিন।" : "Brief role or task details are required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          hrName,
          email,
          phone,
          positionType,
          offeredRange,
          jobDescription
        })
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to submit proposal.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCompanyName("");
    setHrName("");
    setEmail("");
    setPhone("");
    setPositionType("full-time");
    setOfferedRange("medium");
    setJobDescription("");
    setIsSuccess(false);
    setFormErrors({});
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 overflow-hidden selection:bg-brand-red selection:text-white">
      <ParticleBackground />
      
      {/* Premium ambient circles */}
      <div className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        
        {/* UPPER TITLE / HUB INTRO */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motionElement.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full font-bold text-xs"
          >
            <Sparkles size={13} /> {lang === "bn" ? "রিক্রুটমেন্ট ও অফার প্যানেল" : "Recruiting & Talent Acquisition"}
          </motionElement.div>
          
          <motionElement.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tight leading-none"
          >
            {lang === "bn" ? "অন্তরকে আপনার টিমে" : "Recruit Antor Into"}<br />
            <span className="text-brand-red">{lang === "bn" ? "যুক্ত করুন" : "Your Creative Team"}</span>
          </motionElement.h1>
          
          <motionElement.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted text-base md:text-lg leading-relaxed font-light"
          >
            {lang === "bn" 
              ? "ঢাকা বিশ্ববিদ্যালয়ের গ্রাফিক ডিজাইন থেকে আগত একজন দক্ষ ভিজ্যুয়াল কমিউনিকেটর এবং অ্যানিমেটর। আপনি যদি কোনো ফুল-টাইম রোল, রিমোট কনট্র্যাক্ট কিংবা স্পেশাল ক্রিয়েটিভ প্রজেক্টের জন্য উপযুক্ত প্রতিভার সন্ধানে থাকেন, তবে অফারটি এখানে সরাসরি সাবমিট করুন।"
              : "A versatile visual storyteller & motion animator from Dhaka University. Connect with Antor for high-impact full-time roles, direct contracts, or premium creative solutions by providing your brief below."
            }
          </motionElement.p>
        </div>

        {/* MAIN PANEL CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT SIDE: TALENT CARD & LIVE MATRICES */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Elite Profile Stat Card */}
            <motionElement.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-surface border border-border p-6 rounded-[2rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-brand-red/15 text-brand-red px-4 py-1.5 rounded-bl-2xl font-bold text-[10px] tracking-wider uppercase">
                {lang === "bn" ? "হায়ারিং স্ট্যাটাস: ওপেন" : "STATUS: OPEN FOR OFFERS"}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red text-2xl font-bold">
                    AB
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Antor Kumar Biswas</h3>
                    <p className="text-xs text-muted font-medium">{lang === "bn" ? "ভিজ্যুয়াল কমিউনিকেটর ও ক্রিয়েটিভ লিড" : "Visual Communicator & Creative Lead"}</p>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
                    <Briefcase size={16} className="mx-auto text-brand-red" />
                    <span className="block text-[10px] text-muted uppercase font-bold tracking-wider">{lang === "bn" ? "অভিজ্ঞতা" : "Exp"}</span>
                    <span className="block text-sm font-black text-foreground">3+ {lang === "bn" ? "বছর" : "Yrs"}</span>
                  </div>
                  <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
                    <GraduationCap size={16} className="mx-auto text-brand-red" />
                    <span className="block text-[10px] text-muted uppercase font-bold tracking-wider">{lang === "bn" ? "বিশ্ববিদ্যালয়" : "Academy"}</span>
                    <span className="block text-xs font-black text-foreground">DU Fine Arts</span>
                  </div>
                  <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
                    <Award size={16} className="mx-auto text-brand-red" />
                    <span className="block text-[10px] text-muted uppercase font-bold tracking-wider">{lang === "bn" ? "প্রজেক্ট" : "Projects"}</span>
                    <span className="block text-sm font-black text-foreground">40+ Done</span>
                  </div>
                </div>

                {/* Primary CV Download Trigger */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a 
                    href="/ANTOR_KUMAR_BISWAS.pdf" 
                    download="ANTOR_KUMAR_BISWAS.pdf"
                    className="flex-1 bg-brand-red text-white py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-300 shadow-md shadow-brand-red/10"
                  >
                    <Download size={14} /> {lang === "bn" ? "সিভি ডাউনলোড করুন" : "Download CV / Resume"}
                  </a>
                  <button 
                    onClick={handleCopyEmail}
                    className="bg-background border border-border text-foreground py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-surface-heavy transition-colors duration-300"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {lang === "bn" ? "অফিসিয়াল ইমেইল" : "Copy Official Email"}
                  </button>
                </div>
              </div>
            </motionElement.div>

            {/* Premium Skills Matrix */}
            <motionElement.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-surface border border-border p-6 rounded-[2rem] shadow-xl space-y-6"
            >
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-black uppercase text-foreground">{lang === "bn" ? "দক্ষতা ও টেকনিক্যাল প্রোফাইল" : "Skill Competency Matrix"}</h4>
                <p className="text-xs text-muted">{lang === "bn" ? "কাজের নিখুঁততা এবং পারফর্ম্যান্স লেভেল" : "Verified production competence levels"}</p>
              </div>

              <div className="space-y-4">
                {skillsList.map((skill, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>{lang === "bn" ? skill.nameBn : skill.nameEn}</span>
                      <span className="font-mono text-brand-red">{skill.pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-background border border-border/80 rounded-full overflow-hidden">
                      <motionElement.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.pct}%` }}
                        transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motionElement.div>

          </div>

          {/* RIGHT SIDE: CUSTOM RECRUITMENT BRIEF FORM */}
          <div className="lg:col-span-7">
            <motionElement.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-surface border border-border p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    
                    <div className="space-y-1 pb-2">
                      <h3 className="text-2xl font-serif font-black uppercase text-foreground">
                        {lang === "bn" ? "হায়ারিং ও কাজের বিবরণ" : "Talent Placement Form"}
                      </h3>
                      <p className="text-xs text-muted">
                        {lang === "bn" ? "অন্তরকে নিয়োগ দিতে প্রয়োজনীয় তথ্যগুলো দিয়ে প্রপোজালটি সাবমিট করুন।" : "Enter the recruitment parameters below to deliver your official offer."}
                      </p>
                    </div>

                    <hr className="border-border/60" />

                    {/* Step 1: Recruiting Agency / Company Details */}
                    <div className="space-y-4">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1">
                        {lang === "bn" ? "১. কোম্পানি এবং অফিসিয়াল তথ্য" : "1. Official Recruiting Agency / Company"}
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={lang === "bn" ? "প্রতিষ্ঠানের নাম *" : "Company Name *"}
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                              formErrors.companyName ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.companyName && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.companyName}</p>}
                        </div>

                        {/* HR Name/Role */}
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={lang === "bn" ? "আপনার নাম ও পদবি *" : "Your Name / Title *"}
                            value={hrName}
                            onChange={e => setHrName(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                              formErrors.hrName ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.hrName && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.hrName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Official Email */}
                        <div className="space-y-1">
                          <input 
                            type="email" 
                            placeholder={lang === "bn" ? "অফিসিয়াল ইমেইল এড্রেস *" : "Official Email *"}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                              formErrors.email ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.email && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.email}</p>}
                        </div>

                        {/* Direct Mobile/Phone */}
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={lang === "bn" ? "যোগাযোগের ফোন নম্বর *" : "Contact Number *"}
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                              formErrors.phone ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                            }`}
                          />
                          {formErrors.phone && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    <hr className="border-border/60" />

                    {/* Step 2: Position/Contract details */}
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1">
                        {lang === "bn" ? "২. চাকরির ধরণ বা কোলাবোরেশন মেথড" : "2. Employment Nature / Collaboration Model"}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { id: "full-time", labelEn: "Full-Time", labelBn: "ফুল-টাইম" },
                          { id: "part-time", labelEn: "Part-Time", labelBn: "পার্ট-টাইম" },
                          { id: "contract", labelEn: "Contractual", labelBn: "চুক্তিভিত্তিক" },
                          { id: "project", labelEn: "Project-Basis", labelBn: "প্রজেক্ট-ভিত্তিক" }
                        ].map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setPositionType(item.id)}
                            className={`p-3 rounded-xl border text-[10px] font-bold transition-all text-center ${
                              positionType === item.id 
                                ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm" 
                                : "border-border bg-background text-muted hover:border-brand-red/20"
                            }`}
                          >
                            {lang === "bn" ? item.labelBn : item.labelEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-border/60" />

                    {/* Step 3: Offered Range / Package */}
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1">
                        {lang === "bn" ? "৩. সম্ভাব্য বাজেট বা অফার প্যাকেজ (মাসিক / প্রজেক্ট টোটাল)" : "3. Estimated Compensation Package / Budget Offer"}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { id: "entry", labelEn: "৳35,000 - ৳50,000 / mo", labelBn: "৳৩৫,০০০ - ৳৫০,০০০ / মাস" },
                          { id: "medium", labelEn: "৳50,000 - ৳90,000 / mo", labelBn: "৳৫০,০০০ - ৳৯০,০০০ / মাস" },
                          { id: "premium", labelEn: "৳90,000+ or Custom Rate", labelBn: "৳৯০,০০০+ বা কাস্টম অফার" }
                        ].map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setOfferedRange(item.id)}
                            className={`p-3.5 rounded-xl border text-[9px] font-bold tracking-wider transition-all text-center ${
                              offeredRange === item.id 
                                ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm" 
                                : "border-border bg-background text-muted hover:border-brand-red/20"
                            }`}
                          >
                            {lang === "bn" ? item.labelBn : item.labelEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-border/60" />

                    {/* Step 4: Job narrative specs */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1 mb-2">
                        {lang === "bn" ? "৪. কাজের সুযোগ, দায়িত্ব বা প্রজেক্ট ব্রিফ *" : "4. Scope of Works & Job Description *"}
                      </label>
                      <textarea 
                        rows={4} 
                        placeholder={lang === "bn" ? "পজিশনটির মূল লক্ষ্য, কাজের দায়িত্ব, টিম ডাইনামিকস এবং প্রয়োজনীয় যোগ্যতা সম্পর্কে লিখুন..." : "Tell us about the role, technical software stack requirements, target timelines, and core deliverables..."}
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all resize-none ${
                          formErrors.jobDescription ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                        }`}
                      />
                      {formErrors.jobDescription && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.jobDescription}</p>}
                    </div>

                    {/* Submit Offer Trigger */}
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-brand-red hover:bg-blood-red text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-red/15 text-xs uppercase tracking-wider"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          {lang === "bn" ? "অফারটি পাঠানো হচ্ছে..." : "Submitting Recruitment Brief..."}
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          {lang === "bn" ? "রিক্রুটমেন্ট ব্রিফ সাবমিট করুন" : "Deliver Recruitment Offer"}
                        </>
                      )}
                    </button>

                  </form>
                ) : (
                  <div className="py-16 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={36} className="animate-bounce" />
                    </div>
                    
                    <div className="space-y-2 max-w-sm mx-auto">
                      <h3 className="text-2xl font-serif font-black text-foreground">
                        {lang === "bn" ? "অফারটি সফলভাবে পৌছেছে!" : "Recruitment Brief Received!"}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed">
                        {lang === "bn" 
                          ? "আপনার প্রতিষ্ঠানের নিয়োগ প্রপোজালটি সফলভাবে অন্তরBiswas এর ডেসবোর্ডে জমা হয়েছে। আমরা পর্যালোচনা শেষে দ্রুত আপনার প্রোভাইড করা ইমেইল বা ফোন নম্বরে যোগাযোগ করবো।"
                          : "Your recruitment specifications have been safely delivered to Antor's inbox. Our team will review the parameters and contact you via your official email shortly."
                        }
                      </p>
                    </div>

                    <button 
                      onClick={resetForm}
                      className="px-6 py-3 bg-background hover:bg-brand-red text-foreground hover:text-white rounded-xl font-bold border border-border hover:border-brand-red transition-all text-xs"
                    >
                      {lang === "bn" ? "আরেকটি অফার পাঠান" : "Submit Another Offer"}
                    </button>
                  </div>
                )}
              </AnimatePresence>

            </motionElement.div>
          </div>

        </div>

      </div>
    </main>
  );
}
