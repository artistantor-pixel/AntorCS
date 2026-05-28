"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { ArrowRight, Mail, MapPin, Copy, Check, MessageCircle, Clock, Sparkles, Send, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { lang } = useLanguage();
  
  // Form State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState(50000);
  const [timeline, setTimeline] = useState("standard");
  const [details, setDetails] = useState("");
  
  // UI states
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Dhaka Time State
  const [dhakaTime, setDhakaTime] = useState("");
  const [isDhakaActive, setIsDhakaActive] = useState(true);

  // Update Dhaka Time dynamically
  useEffect(() => {
    const updateTime = () => {
      // Create date object for Dhaka (+6 GMT)
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const dhakaOffset = 6;
      const dhakaDate = new Date(utc + 3600000 * dhakaOffset);
      
      const hours = dhakaDate.getHours();
      const minutes = dhakaDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      
      setDhakaTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
      
      // Active hours: 9 AM to 10 PM
      setIsDhakaActive(hours >= 9 && hours < 22);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@antorstudio.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) {
      errors.name = lang === "bn" ? "আপনার নাম লিখুন।" : "Name is required.";
    }
    if (!emailPattern.test(email)) {
      errors.email = lang === "bn" ? "একটি সঠিক ইমেইল আইডি দিন।" : "Please enter a valid email.";
    }
    if (!phone.trim() || phone.length < 11) {
      errors.phone = lang === "bn" ? "সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন।" : "Valid mobile number is required.";
    }
    if (!details.trim()) {
      errors.details = lang === "bn" ? "প্রজেক্টের বিবরণ লিখুন।" : "Project description is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSelectedServices([]);
    setBudget(50000);
    setTimeline("standard");
    setDetails("");
    setIsSuccess(false);
    setFormErrors({});
  };

  const serviceOptions = [
    { id: "branding", labelEn: "Branding & Logo", labelBn: "ব্র্যান্ডিং ও লোগো" },
    { id: "motion", labelEn: "Motion Design", labelBn: "মোশন ডিজাইন" },
    { id: "animation", labelEn: "2D/3D Animation", labelBn: "অ্যানিমেশন" },
    { id: "uiux", labelEn: "UI/UX & Web", labelBn: "ওয়েবসাইট ডিজাইন" },
    { id: "creative", labelEn: "Creative Direction", labelBn: "ক্রিয়েটিভ ডিরেকশন" }
  ];

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 overflow-hidden selection:bg-brand-red selection:text-white">
      <ParticleBackground />
      
      {/* Background Soft Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-tan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 max-w-7xl">
        
        {/* LEFT COLUMN: HERO INTRO & INTERACTIVE CONTACT CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col justify-center space-y-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full font-bold text-xs self-start">
            <Sparkles size={13} /> {lang === "bn" ? "যোগাযোগ ও কোলাবোরেশন" : "Collaboration Portal"}
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight uppercase leading-none">
              {lang === "bn" ? "আসুন নতুন কিছু" : "Let's Build"}<br />
              <span className="text-brand-red">{lang === "bn" ? "তৈরি করি" : "Your Vision"}</span>
            </h1>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-md">
              {lang === "bn" 
                ? "আপনার যদি কোনো চমৎকার প্রজেক্ট আইডিয়া থাকে, স্টোরিটেলিং অ্যানিমেশন কিংবা ক্রিয়েটিভ উইজার্ড ব্র্যান্ডিং প্রয়োজন হয়, তাহলে আজই আমার সাথে যুক্ত হন।"
                : "Have a bold vision, storytelling animation requirement, or need creative design systems? Reach out to me directly and let's craft stellar visuals."
              }
            </p>
          </div>

          {/* Dynamic Interactive Cards Stack */}
          <div className="space-y-4 max-w-md">
            
            {/* Email card with quick copy */}
            <div className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-brand-red/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">{lang === "bn" ? "ইমেইল করুন" : "Direct Email"}</span>
                  <span className="text-base font-bold text-foreground">hello@antorstudio.com</span>
                </div>
              </div>
              <button 
                onClick={handleCopyEmail}
                className="p-2.5 bg-background hover:bg-brand-red text-muted hover:text-white rounded-lg transition-all border border-border hover:border-brand-red relative"
              >
                {isCopied ? <Check size={14} className="text-emerald-500 hover:text-white" /> : <Copy size={14} />}
                
                {/* Pop up mini toast */}
                <AnimatePresence>
                  {isCopied && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -25, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* WhatsApp Quick Chat Card */}
            <a 
              href="https://wa.me/8801712345678?text=Hello%20Antor%2C%20I'd%20like%20to%20discuss%20a%20project!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">{lang === "bn" ? "হোয়াটসঅ্যাপ করুন" : "WhatsApp Chat"}</span>
                  <span className="text-base font-bold text-foreground">+880 1712-345678</span>
                </div>
              </div>
              <div className="p-2.5 bg-background text-muted group-hover:text-emerald-500 rounded-lg border border-border group-hover:border-emerald-500/20 transition-all">
                <ArrowRight size={14} />
              </div>
            </a>

            {/* Local Time Tracker Card */}
            <div className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">{lang === "bn" ? "স্থান এবং স্থানীয় সময়" : "Location & Dhaka Time"}</span>
                  <span className="text-base font-bold text-foreground">Dhaka, BD ({dhakaTime})</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${
                isDhakaActive 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                  : "bg-orange-500/10 border-orange-500/20 text-orange-600"
              }`}>
                {isDhakaActive 
                  ? (lang === "bn" ? "🟢 অনলাইন" : "🟢 Active") 
                  : (lang === "bn" ? "🌙 বিশ্রামে" : "🌙 Offline")
                }
              </span>
            </div>

          </div>
        </motion.div>

        {/* RIGHT COLUMN: PREMIUM DYNAMIC MULTI-STEP FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="bg-surface border border-border p-8 md:p-10 rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
            
            {/* Soft decorative gradient ring inside the form */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit} 
                  className="space-y-6 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Step 1: Services Selector */}
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1">
                      {lang === "bn" ? "১. কোন কোন সেবা প্রয়োজন? (একাধিক সিলেক্ট করুন)" : "1. What creative services do you need? (Select all that apply)"}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {serviceOptions.map(option => {
                        const isSelected = selectedServices.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleServiceToggle(option.id)}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                              isSelected 
                                ? "bg-brand-red text-white border-brand-red shadow-[0_4px_12px_rgba(234,63,64,0.2)]" 
                                : "bg-background text-muted border-border hover:border-brand-red/30 hover:text-foreground"
                            }`}
                          >
                            {lang === "bn" ? option.labelBn : option.labelEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  {/* Step 2: Contact Details */}
                  <div className="space-y-4">
                    <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1">
                      {lang === "bn" ? "২. আপনার তথ্য দিন" : "2. Tell us about yourself"}
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <input 
                          type="text" 
                          placeholder={lang === "bn" ? "আপনার নাম *" : "Full Name *"}
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                            formErrors.name ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                          }`}
                        />
                        {formErrors.name && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.name}</p>}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1">
                        <input 
                          type="email" 
                          placeholder={lang === "bn" ? "ইমেইল এড্রেস *" : "Email Address *"}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                            formErrors.email ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                          }`}
                        />
                        {formErrors.email && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.email}</p>}
                      </div>
                    </div>

                    {/* WhatsApp/Phone Input */}
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder={lang === "bn" ? "মোবাইল নম্বর (হোয়াটসঅ্যাপ প্রজেক্ট আপডেটের জন্য) *" : "WhatsApp / Phone Number (For direct project updates) *"}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all ${
                          formErrors.phone ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                        }`}
                      />
                      {formErrors.phone && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  {/* Step 3: Budget Range Neumorphic Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] uppercase tracking-wider text-muted font-bold">
                        {lang === "bn" ? "৩. সম্ভাব্য বাজেট নির্ধারণ করুন" : "3. What is your estimated budget?"}
                      </label>
                      <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2.5 py-0.5 rounded-md border border-brand-red/15 animate-pulse">
                        ৳ {budget.toLocaleString()}{budget >= 500000 ? "+" : ""}
                      </span>
                    </div>
                    
                    <input 
                      type="range" 
                      min="10000" 
                      max="50000" 
                      step="5000"
                      value={budget <= 50000 ? budget : 50000}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        // Scale range to make it interesting
                        if (val === 50000) {
                          setBudget(500000);
                        } else {
                          setBudget(val * 4); // Scale up (e.g. 10k is 40k)
                        }
                      }}
                      className="w-full accent-brand-red h-2 bg-background border border-border rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between px-1 text-[8px] font-mono font-bold text-muted uppercase tracking-widest">
                      <span>৳ 10,000</span>
                      <span>৳ 100,000</span>
                      <span>৳ 250,000</span>
                      <span>৳ 500,000+</span>
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  {/* Step 4: Timeline selector */}
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1">
                      {lang === "bn" ? "৪. প্রজেক্টের সময়সীমা" : "4. Target Delivery Timeline"}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "rush", labelEn: "Warp Speed (Rush)", labelBn: "তাড়াতাড়ি (জরুরি)" },
                        { id: "standard", labelEn: "Standard (1-2 mo)", labelBn: "সাধারণ (১-২ মাস)" },
                        { id: "flexible", labelEn: "Flexible Rate", labelBn: "সুবিধাজনক সময়" }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTimeline(item.id)}
                          className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${
                            timeline === item.id 
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

                  {/* Step 5: Vision Narrative description */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-muted font-bold pl-1 mb-2">
                      {lang === "bn" ? "৫. আপনার প্রজেক্ট ভিশন শেয়ার করুন *" : "5. Share your project vision *"}
                    </label>
                    <textarea 
                      rows={4} 
                      placeholder={lang === "bn" ? "আপনার প্রজেক্টের উদ্দেশ্য, লক্ষ্য এবং বাজেট সম্পর্কিত বিস্তারিত লিখুন..." : "Tell us about your creative goals, layout ideas, and scope of works..."}
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      className={`w-full bg-background border rounded-2xl px-5 py-4 text-xs text-foreground focus:outline-none transition-all resize-none ${
                        formErrors.details ? "border-brand-red focus:ring-1 focus:ring-brand-red/10" : "border-border focus:border-brand-red"
                      }`}
                    />
                    {formErrors.details && <p className="text-[10px] text-brand-red font-bold pl-3">{formErrors.details}</p>}
                  </div>

                  {/* Action Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-red hover:bg-blood-red text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_25px_rgba(234,63,64,0.18)] text-xs uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        {lang === "bn" ? "প্রেরণ করা হচ্ছে..." : "Sending Vision Matrix..."}
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        {lang === "bn" ? "প্রজেক্ট প্রপোজাল জমা দিন" : "Submit Project Vision"}
                      </>
                    )}
                  </button>

                </motion.form>
              ) : (
                <motion.div 
                  key="success-overlay"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="py-16 text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={36} className="animate-bounce" />
                  </div>
                  
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h3 className="text-2xl font-serif font-black text-foreground">
                      {lang === "bn" ? "প্রপোজাল সফলভাবে জমা হয়েছে!" : "Vision Matrix Received!"}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {lang === "bn" 
                        ? "আপনার প্রজেক্টের বিবরণটি সফলভাবে অন্তরBiswas এর কাছে পৌছেছে। আমরা আগামী ২৪ ঘণ্টার মধ্যে আপনার হোয়াট্সঅ্যাপ বা ইমেইলে যোগাযোগ করবো।"
                        : "Your creative brief has landed in Antor's console. We will review your target budget and reach out to your WhatsApp/Email within 24 hours."
                      }
                    </p>
                  </div>

                  <button 
                    onClick={resetForm}
                    className="px-6 py-3 bg-background hover:bg-brand-red text-foreground hover:text-white rounded-xl font-bold border border-border hover:border-brand-red transition-all text-xs"
                  >
                    {lang === "bn" ? "নতুন আরেকটি বার্তা পাঠান" : "Submit Another Brief"}
                  </button>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </div>
    </main>
  );
}
