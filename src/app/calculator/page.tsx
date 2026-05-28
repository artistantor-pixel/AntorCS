"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  PenTool, 
  PlayCircle, 
  Layout, 
  Clock, 
  Zap, 
  MessageSquare, 
  Sparkles, 
  Wand2, 
  Rocket, 
  Film, 
  LayoutTemplate,
  Palette,
  Check,
  CheckCircle2,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Local translations to ensure 100% full EN/BN support on the Estimator Page
const localT: Record<string, Record<string, string>> = {
  en: {
    let_crunch: "Let's calculate your budget! 💰",
    title: "Project Estimator 🚀",
    subtitle: "Build your dream project with absolute budget transparency. Choose your scope and see the estimate in real-time.",
    step1_flavor: "What's the flavor? 🎨",
    step1_desc: "Select one or more categories to customize your creative recipe.",
    branding_title: "Branding",
    branding_desc: "Logos, colors, and visual vibes that make people go \"wow\".",
    motion_title: "Motion Design",
    motion_desc: "Eye-catching 2D/3D animations that move the needle.",
    uiux_title: "UI/UX Design",
    uiux_desc: "Digital interfaces so smooth they feel like pure magic.",
    illustration_title: "Illustration & Arts",
    illustration_desc: "Vector illustrations, character design, and custom storyboarding sheets.",
    creative_title: "Creative Direction",
    creative_desc: "Exhibition design curation, 3D space layouts, and visual strategies.",
    step2_details: "Let's tune the details 🔍",
    step2_desc: "Slide the scale and pick your premium add-ons below.",
    branding_logos: "How many logo concepts?",
    branding_guidelines: "Full Brand Guidelines Rulebook",
    branding_guidelines_desc: "Typography systems, color tokens, and layout guidelines (+৳",
    branding_social: "Social Media Kit",
    branding_social_desc: "Bespoke profile templates, grid systems, and banners (+৳",
    branding_stationery: "Premium Stationery Design",
    branding_stationery_desc: "Double-sided business cards, folder designs, and envelopes (+৳",
    motion_sec: "Animation Duration (Seconds)",
    motion_style: "Animation Style & Aesthetics",
    motion_voiceover: "Professional Voiceover Artist",
    motion_voiceover_desc: "Studio-quality voice acting, mastering, and audio sync (+৳",
    motion_sfx: "Sound Design & SFX Track",
    motion_sfx_desc: "Immersive custom sound effects, transitions, and audio sync (+৳",
    uiux_screens: "How many unique key screens?",
    uiux_proto: "Clickable Interactive Prototype",
    uiux_proto_desc: "Fully functional high-fidelity Figma preview prototype (+৳",
    uiux_ds: "Enterprise Design System",
    uiux_ds_desc: "Custom reusable tokens, component library, and asset handoff (+৳",
    uiux_resp: "Fully Responsive UI Layouts",
    uiux_resp_desc: "Tailored viewports for Mobile, Tablet, and Desktop screens (+৳",
    illustration_count: "How many custom illustrations?",
    illustration_char: "Character Mascot Design Sheet",
    illustration_char_desc: "Detailed turnaround pose sheets for custom characters (+৳",
    illustration_story: "Professional Storyboard Sheets",
    illustration_story_desc: "Complete visual flowboards for animation production (+৳",
    illustration_vec: "Vector Raw Asset Handoff",
    illustration_vec_desc: "Fully scalable clean vector files (.AI, .EPS, .SVG) (+৳",
    creative_days: "Duration of Event (Days)",
    creative_mapping: "Exhibition 3D Space Layout Mapping",
    creative_mapping_desc: "Interactive 3D structural mapping of the exhibition venue (+৳",
    creative_prints: "Promotional Print Collaterals",
    creative_prints_desc: "High-end design of banners, flyers, catalogs, and awards (+৳",
    creative_consult: "Creative Curation & PR Consulting",
    creative_consult_desc: "Public relations strategy, consulting, and visual theme curation (+৳",
    step3_deadline: "Need it yesterday? ⏳",
    step3_desc: "We respect milestones. Select the delivery speed that fits your launch date.",
    chill_mode: "Chill Mode (Standard)",
    chill_desc: "2-4 Weeks. Steady, high-fidelity creative output. No rush fee.",
    warp_speed: "Warp Speed (Rush Delivery)",
    warp_desc: "Within 1 Week. High-priority, drop-everything delivery (+30% rush fee).",
    step4_results: "Here's your estimated budget 🎉",
    step4_desc: "This baseline estimate helps align creative execution with your goals.",
    recipe: "Your Customized Recipe:",
    branding_recipe: "Branding",
    branding_recipe_concepts: "concepts",
    motion_recipe: "Motion Magic",
    uiux_recipe: "UI/UX Design",
    screens_recipe: "screens",
    illustration_recipe: "Illustration & Arts",
    illustrations_count_recipe: "illustrations",
    creative_recipe: "Creative Direction",
    creative_days_recipe: "days scale",
    rush_recipe: "Warp Speed Delivery (+30% Rush Fee)",
    build_together: "Let's Build This Together",
    tight_budget: "Budget looking a bit tight?",
    custom_phased: "Let's chat about a custom phased approach",
    go_back: "Go Back",
    next_step: "Next Step",
    estimator_generate: "Generate Estimate 💰",
    card1_t: "Value-Driven Design",
    card1_d: "A premium visual identity is a high-return business investment that drives equity, not just an aesthetic expense.",
    card2_t: "Beyond Aesthetics",
    card2_d: "We construct strategic solutions engineered to build instant credibility, engagement, and boost actual conversion rates.",
    card3_t: "Tailored to Scale",
    card3_d: "Every product is unique. This ballpark estimate provides a baseline. We customize every scope to maximize your ROI.",
  },
  bn: {
    let_crunch: "চলুন হিসাব কষে দেখি! 💰",
    title: "প্রজেক্ট বাজেট ক্যালকুলেটর 🚀",
    subtitle: "খুব সহজে এবং সম্পূর্ণ স্বচ্ছতার সাথে প্রজেক্টের সম্ভাব্য বাজেট হিসাব করুন। স্লাইডার ব্যবহার করে কাজের পরিধি নির্ধারণ করুন।",
    step1_flavor: "আপনার কী ধরণের সেবা প্রয়োজন? 🎨",
    step1_desc: "আপনার প্রজেক্টের প্রয়োজনীয় ক্যাটাগরি বা সেবাগুলো নিচে টিক চিহ্ন দিয়ে বেছে নিন।",
    branding_title: "ব্র্যান্ডিং আইডেন্টিটি",
    branding_desc: "লোগো, রঙের প্যালেট এবং সামগ্রিক ব্র্যান্ডের ভিজ্যুয়াল পরিচয় তৈরি করা।",
    motion_title: "মোশন অ্যানিমেশন",
    motion_desc: "Campaign এবং শিখনের জন্য আকর্ষণীয় ভেক্টর ২ডি/৩ডি মোশন গ্রাফিক্স।",
    uiux_title: "ডিজিটাল UI/UX ডিজাইন",
    uiux_desc: "স্মার্ট ডিজিটাল প্রোডাক্টের জন্য চমৎকার, ইউজার-ফ্রেন্ডলি ইন্টারফেস ডিজাইন।",
    illustration_title: "ইলাস্ট্রেশন ও আর্টস",
    illustration_desc: "ভেক্টর ইলাস্ট্রেশন, ক্যারেক্টার ডিজাইন এবং পেশাদার কার্টুন স্টোরিবোর্ড।",
    creative_title: "ক্রিয়েটিভ ডিরেকশন",
    creative_desc: "প্রদর্শনী কিউরেশন, ইভেন্ট ব্র্যান্ডিং ও ৩ডি স্পেস লেআউট কৌশল।",
    step2_details: "পরিসর ও প্রিমিয়াম ফিচার নির্ধারণ করুন 🔍",
    step2_desc: "কাজের ব্যাপ্তি এবং প্রজেক্টের প্রিমিয়াম অ্যাড-অনগুলো নিচে কাস্টমাইজ করুন।",
    branding_logos: "লোগো কনসেপ্টের সংখ্যা?",
    branding_guidelines: "ব্র্যান্ড নির্দেশিকা বই (Brand Guidelines)",
    branding_guidelines_desc: "রঙের প্যালেট, টাইপোগ্রাফি সিস্টেম এবং ব্যবহারের গাইডবুক (+৳",
    branding_social: "সোশ্যাল মিডিয়া ডিজাইনের কিট",
    branding_social_desc: "প্রোফাইল টেমপ্লেট, কাস্টম গ্রিড সিস্টেম এবং কাভার ব্যানার (+৳",
    branding_stationery: "প্রিমিয়াম স্টেশনারি ও প্রিন্টস",
    branding_stationery_desc: "বিজনেস কার্ড, খাম এবং ব্র্যান্ডের প্যাড বা লেটারহেড ডিজাইন (+৳",
    motion_sec: "অ্যানিমেশনের সময়সীমা (সেকেন্ড)",
    motion_style: "অ্যানিমেশন স্টাইল ও ক্যাটাগরি",
    motion_voiceover: "পেশাদার ভয়েস আর্টিস্ট (Voiceover)",
    motion_voiceover_desc: "স্টুডিও-কোয়ালিটি ভয়েস অভিনয়, মাস্টারিং এবং সাউন্ড সিঙ্ক (+৳",
    motion_sfx: "সাউন্ড ডিজাইন ও সাউন্ড ইফেক্টস",
    motion_sfx_desc: "কাস্টম ইফেক্টস এবং আবহ সঙ্গীত সংযোজন (+৳",
    uiux_screens: "কয়টি মূল স্ক্রিন ডিজাইন করা হবে?",
    uiux_proto: "ইন্টারেক্টিভ ক্লিকেবল প্রোটোটাইপ",
    uiux_proto_desc: "ফিডব্যাক ও টেস্টিংয়ের জন্য ফিজিক্যাল ক্লিকেবল ফিগমা প্রোটোটাইপ (+৳",
    uiux_ds: "ডিজাইন সিস্টেম ও লাইব্রেরি",
    uiux_ds_desc: "পুনর্ব্যবহারযোগ্য টোকেন, কম্পোনেন্ট লাইব্রেরি ও কোড হ্যান্ডঅফ (+৳",
    uiux_resp: "মোবাইল ও ট্যাবলেট রেসপন্সিভনেস",
    uiux_resp_desc: "মোবাইল, ট্যাবলেট এবং ডেস্কটপ স্ক্রিনের জন্য আলাদা লেআউট (+৳",
    illustration_count: "কয়টি কাস্টম ইলাস্ট্রেশন প্রয়োজন?",
    illustration_char: "ক্যারেক্টার ও মাসকট ডিজাইন শীট",
    illustration_char_desc: "কাস্টম চরিত্রের বিভিন্ন কোণের বিস্তারিত ড্রয়িং শীট (+৳",
    illustration_story: "প্রফেশনাল স্টোরিবোর্ড শীটস",
    illustration_story_desc: "ভিডিও তৈরির জন্য সম্পূর্ণ দৃশ্যভিত্তিক ভিজ্যুয়াল ফ্লোবোর্ড (+৳",
    illustration_vec: "ভেক্টর র আর্সেট হ্যান্ডঅফ",
    illustration_vec_desc: "সম্পূর্ণ স্কেলেবল পরিষ্কার সোর্স ফাইল (.AI, .EPS, .SVG) (+৳",
    creative_days: "ইভেন্ট বা প্রদর্শনীর সময়কাল (দিন)",
    creative_mapping: "৩ডি স্পেস লেআউট ও ডিজাইন ম্যাপিং",
    creative_mapping_desc: "ভেন্যুর জন্য আকর্ষণীয় ইন্টারেক্টিভ ৩ডি লেআউট ম্যাপিং (+৳",
    creative_prints: "প্রচারণামূলক স্টেশনারি ও প্রিন্টস",
    creative_prints_desc: "উচ্চ-মানের ব্যানার, ফ্লায়ার, ক্যাটালগ এবং ক্রেস্ট ডিজাইন (+৳",
    creative_consult: "কিউরেশন ও পিআর কনসাল্টিং",
    creative_consult_desc: "জনসংযোগ কৌশল এবং ভিজ্যুয়াল থিম কিউরেশন পরামর্শ (+৳",
    step3_deadline: "কাজের সময়সীমা নির্বাচন করুন ⏳",
    step3_desc: "আমরা প্রজেক্টের সময়কে সম্মান করি। কাজের জন্য আপনার পছন্দের ডেলিভারি মোড নির্বাচন করুন।",
    chill_mode: "সাধারণ গতি (Standard Mode)",
    chill_desc: "২-৪ সপ্তাহ। সাধারণ গতিতে প্রজেক্টের সেরা কোয়ালিটি ও মান নিশ্চিত করা হয়। কোনো অতিরিক্ত চার্জ নেই।",
    warp_speed: "দ্রুততম গতি (Warp Speed Rush)",
    warp_desc: "১ সপ্তাহের মধ্যে। বিশেষ অগ্রাধিকারে অতি দ্রুত ডেলিভারি নিশ্চিত করা হয় (+৩০% প্রজেক্ট চার্জ)।",
    step4_results: "আপনার সম্ভাব্য প্রজেক্ট বাজেট 🎉",
    step4_desc: "আপনার নির্বাচিত স্কোপ এবং মেটেরিয়ালের উপর ভিত্তি করে একটি বেসলাইন প্রজেক্ট হিসাব।",
    recipe: "আপনার প্রজেক্টের রসিদ বা রেসিপি:",
    branding_recipe: "ব্র্যান্ডিং আইডেন্টিটি",
    branding_recipe_concepts: "কনসেপ্ট",
    motion_recipe: "মোশন গ্রাফিক্স",
    uiux_recipe: "UI/UX ডিজাইন",
    screens_recipe: "স্ক্রিন",
    illustration_recipe: "ইলাস্ট্রেশন ও আর্টস",
    illustrations_count_recipe: "টি ইলাস্ট্রেশন",
    creative_recipe: "ক্রিয়েটিভ ডিরেকশন",
    creative_days_recipe: "দিনের ইভেন্ট",
    rush_recipe: "দ্রুততম Warp Speed ডেলিভারি (+৩০% Rush ফি)",
    build_together: "চলুন একত্রে কাজটি শুরু করি",
    tight_budget: "বাজেট কি কিছুটা টাইট?",
    custom_phased: "চলুন ধাপে ধাপে কাজের কাস্টম পদ্ধতি নিয়ে কথা বলি",
    go_back: "পেছনে যান",
    next_step: "পরবর্তী ধাপ",
    estimator_generate: "বাজেট হিসাব করুন 💰",
    card1_t: "কৌশলগত ব্র্যান্ড ডিজাইন",
    card1_d: "একটি শক্তিশালী ব্র্যান্ড পরিচয় কেবল একটি সাধারণ খরচ নয়, এটি একটি দীর্ঘস্থায়ী ব্যবসায়িক বিনিয়োগ যা ব্র্যান্ডের বিশ্বস্ততা বাড়ায়।",
    card2_t: "শুধুমাত্র পিক্সেল নয়",
    card2_d: "আমরা এমন কৌশলগত ডিজাইন তৈরি করি যা ব্র্যান্ডের গ্রহণযোগ্যতা বাড়ায় এবং সরাসরি ব্যবসায়ের বেচাবিক্রি বা কনভার্সন বৃদ্ধি করে।",
    card3_t: "আপনার জন্য কাস্টমাইজড",
    card3_d: "এই ক্যালকুলেটরটি একটি আনুমানিক হিসাব দেয়। আপনার ব্যবসায়ের সর্বোচ্চ প্রবৃদ্ধি অর্জন করতে আমরা প্রজেক্টের স্কোপ কাস্টমাইজ করতে পারব।",
  }
};

// Playful Animated Numeric Digit Display
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 20, stiffness: 100 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

export default function CalculatorPage() {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<any>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const currentT = localT[lang] || localT["en"];

  useEffect(() => {
    // Smooth scroll to the top of the step card when transition occurs
    if (step > 1 && stepContainerRef.current) {
      const yOffset = -120; // Ideal margin for sticky mobile headers
      const element = stepContainerRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [step]);

  useEffect(() => {
    fetch("/api/calculator", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Error loading pricing configuration:", err));
  }, []);

  const c = useMemo(() => {
    return config || {
      brandingBase: 25000,
      brandingLogoExtra: 5000,
      brandingGuidelines: 10000,
      brandingSocial: 5000,
      brandingStationery: 3000,
      motionBase: 30000,
      motionDurationExtra: 5000,
      motionStyle3dExtra: 20000,
      motionVoiceover: 5000,
      motionSfx: 3000,
      uiuxBase: 40000,
      uiuxScreenExtra: 3000,
      uiuxPrototype: 10000,
      uiuxDesignSystem: 15000,
      uiuxResponsive: 10000,
      // Fallback values for expanded scopes
      illustrationBase: 15000,
      illustrationExtra: 3000,
      illustrationCharacterDesign: 8000,
      illustrationStoryboard: 10000,
      illustrationVectorHandoff: 5000,
      creativeDirectionBase: 50000,
      creativeDirectionDayExtra: 10000,
      creativeDirection3dMapping: 25000,
      creativeDirectionPrintCollaterals: 15000,
      creativeDirectionCurationConsulting: 20000,
      timelineRushMultiplier: 1.3
    };
  }, [config]);

  // Step 1: Expanded Categories Selection
  const [categories, setCategories] = useState({
    branding: false,
    motion: false,
    uiux: false,
    illustration: false,
    creative: false
  });

  // Step 2: Slider Scope & Add-on Checkbox state (Expanded)
  const [scope, setScope] = useState({
    // Branding
    branding_logos: 2,
    branding_guidelines: false,
    branding_social: false,
    branding_stationery: false,
    // Motion
    motion_duration: 15,
    motion_style: '2d',
    motion_voiceover: false,
    motion_sfx: false,
    // UI/UX
    uiux_screens: 5,
    uiux_prototype: false,
    uiux_design_system: false,
    uiux_responsive: false,
    // Illustration & Arts
    illustration_count: 3,
    illustration_character: false,
    illustration_storyboard: false,
    illustration_vector: false,
    // Creative Direction & Exhibition Curation
    creative_days: 1,
    creative_mapping: false,
    creative_prints: false,
    creative_consulting: false,
    custom_notes: ""
  });

  // Step 3: Timeline pace
  const [timeline, setTimeline] = useState('standard');

  // Custom Requirements & Services States
  const [customServices, setCustomServices] = useState<{ id: string, name: string, price: number }[]>([]);
  const [customInputName, setCustomInputName] = useState("");
  const [customInputPrice, setCustomInputPrice] = useState<number>(0);

  const handleAddCustomService = () => {
    if (!customInputName.trim()) return;
    const newService = {
      id: Math.random().toString(36).substring(2, 9),
      name: customInputName.trim(),
      price: customInputPrice || 0
    };
    setCustomServices(prev => [...prev, newService]);
    setCustomInputName("");
    setCustomInputPrice(0);
  };

  const handleRemoveCustomService = (id: string) => {
    setCustomServices(prev => prev.filter(item => item.id !== id));
  };

  const handleCategoryToggle = (cat: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const isCategorySelected = 
    categories.branding || 
    categories.motion || 
    categories.uiux || 
    categories.illustration || 
    categories.creative;

  const nextStep = () => {
    if (step === 1 && !isCategorySelected) return;
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Compute ballpark budget in BDT (Expanded logic)
  const budget = useMemo(() => {
    let minTotal = 0;

    if (categories.branding) {
      let brandingBase = c.brandingBase;
      if (scope.branding_logos > 2) brandingBase += (scope.branding_logos - 2) * c.brandingLogoExtra;
      if (scope.branding_guidelines) brandingBase += c.brandingGuidelines;
      if (scope.branding_social) brandingBase += c.brandingSocial;
      if (scope.branding_stationery) brandingBase += c.brandingStationery;
      minTotal += brandingBase;
    }
    if (categories.motion) {
      let motionBase = c.motionBase;
      if (scope.motion_duration > 15) motionBase += ((scope.motion_duration - 15) / 5) * c.motionDurationExtra;
      if (scope.motion_style === '3d') motionBase += c.motionStyle3dExtra;
      if (scope.motion_voiceover) motionBase += c.motionVoiceover;
      if (scope.motion_sfx) motionBase += c.motionSfx;
      minTotal += motionBase;
    }
    if (categories.uiux) {
      let uiuxBase = c.uiuxBase;
      if (scope.uiux_screens > 5) uiuxBase += (scope.uiux_screens - 5) * c.uiuxScreenExtra;
      if (scope.uiux_prototype) uiuxBase += c.uiuxPrototype;
      if (scope.uiux_design_system) uiuxBase += c.uiuxDesignSystem;
      if (scope.uiux_responsive) uiuxBase += c.uiuxResponsive;
      minTotal += uiuxBase;
    }
    if (categories.illustration) {
      let illustrationBase = c.illustrationBase || 15000;
      if (scope.illustration_count > 3) {
        illustrationBase += (scope.illustration_count - 3) * (c.illustrationExtra || 3000);
      }
      if (scope.illustration_character) illustrationBase += c.illustrationCharacterDesign || 8000;
      if (scope.illustration_storyboard) illustrationBase += c.illustrationStoryboard || 10000;
      if (scope.illustration_vector) illustrationBase += c.illustrationVectorHandoff || 5000;
      minTotal += illustrationBase;
    }
    if (categories.creative) {
      let creativeBase = c.creativeDirectionBase || 50000;
      if (scope.creative_days > 1) {
        creativeBase += (scope.creative_days - 1) * (c.creativeDirectionDayExtra || 10000);
      }
      if (scope.creative_mapping) creativeBase += c.creativeDirection3dMapping || 25000;
      if (scope.creative_prints) creativeBase += c.creativeDirectionPrintCollaterals || 15000;
      if (scope.creative_consulting) creativeBase += c.creativeDirectionCurationConsulting || 20000;
      minTotal += creativeBase;
    }

    // Add custom services prices
    const customTotal = customServices.reduce((sum, item) => sum + item.price, 0);
    minTotal += customTotal;

    let multiplier = timeline === 'rush' ? c.timelineRushMultiplier : 1;
    minTotal = Math.round(minTotal * multiplier);
    const maxTotal = Math.round(minTotal * 1.25); // 25% flexibility margin (premium agency standard)
    return { min: minTotal, max: maxTotal };
  }, [categories, scope, timeline, c, customServices]);

  const progressPercentage = ((step - 1) / 3) * 100;

  return (
    <main className="min-h-screen pt-32 pb-32 bg-background text-foreground flex flex-col items-center selection:bg-brand-red selection:text-white relative overflow-hidden">
      
      {/* Immersive Background Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[35rem] h-[35rem] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[35rem] h-[35rem] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-4xl px-6 relative z-10">
        
        {/* 1. Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-5 py-2.5 rounded-full font-bold text-xs mb-6 shadow-sm border border-brand-red/10"
          >
            <Sparkles size={14} className="animate-pulse text-brand-red" />
            <span>{currentT.let_crunch}</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 leading-none">
            {currentT.title}
          </h1>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* 2. Sleek Neumorphic/Glass Progress Track */}
        <div className="w-full h-3 bg-surface-heavy/50 rounded-full mb-16 p-[2px] shadow-inner relative border border-border">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-red via-orange-500 to-amber-500 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
          />
        </div>

        {/* 3. Immersive Interactive Steps Card */}
        <motion.div 
          ref={stepContainerRef}
          layout
          className="bg-surface/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-12 shadow-[20px_20px_60px_rgba(28,27,24,0.05),-20px_-20px_60px_rgba(255,255,255,0.9)] relative min-h-[520px] flex flex-col transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Categories Selection */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                  <Sparkle className="text-brand-red" size={24} />
                  <span>{currentT.step1_flavor}</span>
                </h2>
                <p className="text-muted text-sm md:text-base font-light mb-10">{currentT.step1_desc}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Category 1: Branding */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleCategoryToggle('branding')}
                    className={`p-5 rounded-[1.8rem] border-2 text-left transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer ${
                      categories.branding 
                        ? 'border-brand-red bg-brand-red/5 shadow-xl shadow-brand-red/5' 
                        : 'border-border hover:border-brand-red/40 bg-background/50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-full blur-2xl group-hover:bg-brand-red/10 transition-colors pointer-events-none" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 shadow-md ${
                      categories.branding 
                        ? 'bg-brand-red text-white shadow-brand-red/20' 
                        : 'bg-background text-foreground group-hover:bg-brand-red/10 group-hover:text-brand-red'
                    }`}>
                      <Palette size={20} />
                    </div>
                    <h3 className="text-sm font-bold mb-1.5 flex items-center justify-between w-full">
                      <span>{currentT.branding_title}</span>
                      {categories.branding && <div className="w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center"><Check size={10} strokeWidth={3}/></div>}
                    </h3>
                    <p className="text-[10px] text-muted leading-relaxed font-light line-clamp-3">{currentT.branding_desc}</p>
                    {categories.branding && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextStep();
                        }}
                        className="md:hidden mt-5 w-full bg-brand-red text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blood-red active:scale-95 transition-all shadow-md shadow-brand-red/20"
                      >
                        {currentT.next_step} <ArrowRight size={12} />
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Category 2: Motion */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleCategoryToggle('motion')}
                    className={`p-5 rounded-[1.8rem] border-2 text-left transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer ${
                      categories.motion 
                        ? 'border-blue-500 bg-blue-500/5 shadow-xl shadow-blue-500/5' 
                        : 'border-border hover:border-blue-500/40 bg-background/50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 shadow-md ${
                      categories.motion 
                        ? 'bg-blue-500 text-white shadow-blue-500/20' 
                        : 'bg-background text-foreground group-hover:bg-blue-500/10 group-hover:text-blue-500'
                    }`}>
                      <Film size={20} />
                    </div>
                    <h3 className="text-sm font-bold mb-1.5 flex items-center justify-between w-full">
                      <span>{currentT.motion_title}</span>
                      {categories.motion && <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center"><Check size={10} strokeWidth={3}/></div>}
                    </h3>
                    <p className="text-[10px] text-muted leading-relaxed font-light line-clamp-3">{currentT.motion_desc}</p>
                    {categories.motion && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextStep();
                        }}
                        className="md:hidden mt-5 w-full bg-blue-500 text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-500/20"
                      >
                        {currentT.next_step} <ArrowRight size={12} />
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Category 3: UI/UX */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleCategoryToggle('uiux')}
                    className={`p-5 rounded-[1.8rem] border-2 text-left transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer ${
                      categories.uiux 
                        ? 'border-emerald-500 bg-emerald-500/5 shadow-xl shadow-emerald-500/5' 
                        : 'border-border hover:border-emerald-500/40 bg-background/50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 shadow-md ${
                      categories.uiux 
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                        : 'bg-background text-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-500'
                    }`}>
                      <LayoutTemplate size={20} />
                    </div>
                    <h3 className="text-sm font-bold mb-1.5 flex items-center justify-between w-full">
                      <span>{currentT.uiux_title}</span>
                      {categories.uiux && <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={10} strokeWidth={3}/></div>}
                    </h3>
                    <p className="text-[10px] text-muted leading-relaxed font-light line-clamp-3">{currentT.uiux_desc}</p>
                    {categories.uiux && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextStep();
                        }}
                        className="md:hidden mt-5 w-full bg-emerald-500 text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
                      >
                        {currentT.next_step} <ArrowRight size={12} />
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Category 4: Illustration & Arts */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleCategoryToggle('illustration')}
                    className={`p-5 rounded-[1.8rem] border-2 text-left transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer ${
                      categories.illustration 
                        ? 'border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/5' 
                        : 'border-border hover:border-amber-500/40 bg-background/50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 shadow-md ${
                      categories.illustration 
                        ? 'bg-amber-500 text-white shadow-amber-500/20' 
                        : 'bg-background text-foreground group-hover:bg-amber-500/10 group-hover:text-amber-500'
                    }`}>
                      <PenTool size={20} />
                    </div>
                    <h3 className="text-sm font-bold mb-1.5 flex items-center justify-between w-full">
                      <span>{currentT.illustration_title}</span>
                      {categories.illustration && <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center"><Check size={10} strokeWidth={3}/></div>}
                    </h3>
                    <p className="text-[10px] text-muted leading-relaxed font-light line-clamp-3">{currentT.illustration_desc}</p>
                    {categories.illustration && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextStep();
                        }}
                        className="md:hidden mt-5 w-full bg-amber-500 text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-600 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                      >
                        {currentT.next_step} <ArrowRight size={12} />
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Category 5: Creative Direction */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleCategoryToggle('creative')}
                    className={`p-5 rounded-[1.8rem] border-2 text-left transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer ${
                      categories.creative 
                        ? 'border-violet-500 bg-violet-500/5 shadow-xl shadow-violet-500/5' 
                        : 'border-border hover:border-violet-500/40 bg-background/50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors pointer-events-none" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 shadow-md ${
                      categories.creative 
                        ? 'bg-violet-500 text-white shadow-violet-500/20' 
                        : 'bg-background text-foreground group-hover:bg-violet-500/10 group-hover:text-violet-500'
                    }`}>
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-sm font-bold mb-1.5 flex items-center justify-between w-full">
                      <span>{currentT.creative_title}</span>
                      {categories.creative && <div className="w-4 h-4 rounded-full bg-violet-500 text-white flex items-center justify-center"><Check size={10} strokeWidth={3}/></div>}
                    </h3>
                    <p className="text-[10px] text-muted leading-relaxed font-light line-clamp-3">{currentT.creative_desc}</p>
                    {categories.creative && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextStep();
                        }}
                        className="md:hidden mt-5 w-full bg-violet-500 text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-violet-600 active:scale-95 transition-all shadow-md shadow-violet-500/20"
                      >
                        {currentT.next_step} <ArrowRight size={12} />
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
 
            {/* STEP 2: Scope & Features Tuning */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25, scale: 0.98 }}
                className="flex-1 flex flex-col gap-10"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                    <Wand2 size={24} className="text-brand-red" />
                    <span>{currentT.step2_details}</span>
                  </h2>
                  <p className="text-muted text-sm md:text-base font-light">{currentT.step2_desc}</p>
                </div>
                
                {/* 1. Branding Scope Card */}
                {categories.branding && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="bg-gradient-to-br from-brand-red/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-brand-red/15 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none font-serif">A</div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3 border-b border-border pb-4">
                      <Palette size={18} className="text-brand-red"/> 
                      <span>{currentT.branding_title}</span>
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">{currentT.branding_logos}</label>
                          <motion.span 
                            key={scope.branding_logos}
                            initial={{ scale: 1.3, color: '#ea3f40' }}
                            animate={{ scale: 1, color: 'var(--foreground)' }}
                            className="text-lg font-black bg-surface px-4 py-1.5 rounded-xl border border-border shadow-sm"
                          >
                            {scope.branding_logos} concepts
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setScope({...scope, branding_logos: Math.max(1, scope.branding_logos - 1)})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-brand-red hover:text-brand-red active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            value={scope.branding_logos} 
                            onChange={e => setScope({...scope, branding_logos: Math.max(1, parseInt(e.target.value) || 1)})} 
                            className="w-24 h-12 bg-surface border border-border rounded-xl text-center font-mono font-bold text-lg focus:border-brand-red outline-none shadow-sm text-[#111827]" 
                          />
                          <button
                            type="button"
                            onClick={() => setScope({...scope, branding_logos: scope.branding_logos + 1})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-brand-red hover:text-brand-red active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            +
                          </button>
                          <span className="text-xs text-muted font-bold tracking-wider uppercase ml-2">
                            {lang === 'bn' ? 'টি কনসেপ্ট' : 'concepts'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-brand-red/40 select-none ${
                          scope.branding_guidelines 
                            ? 'bg-brand-red/[0.03] border-brand-red shadow-md shadow-brand-red/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.branding_guidelines} 
                            onChange={e => setScope({...scope, branding_guidelines: e.target.checked})} 
                            className="w-5 h-5 accent-brand-red rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.branding_guidelines}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.branding_guidelines_desc}{c.brandingGuidelines.toLocaleString()})
                            </span>
                          </div>
                        </label>

                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-brand-red/40 select-none ${
                          scope.branding_social 
                            ? 'bg-brand-red/[0.03] border-brand-red shadow-md shadow-brand-red/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.branding_social} 
                            onChange={e => setScope({...scope, branding_social: e.target.checked})} 
                            className="w-5 h-5 accent-brand-red rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.branding_social}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.branding_social_desc}{c.brandingSocial.toLocaleString()})
                            </span>
                          </div>
                        </label>

                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-brand-red/40 select-none ${
                          scope.branding_stationery 
                            ? 'bg-brand-red/[0.03] border-brand-red shadow-md shadow-brand-red/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.branding_stationery} 
                            onChange={e => setScope({...scope, branding_stationery: e.target.checked})} 
                            className="w-5 h-5 accent-brand-red rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.branding_stationery}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.branding_stationery_desc}{c.brandingStationery.toLocaleString()})
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Motion Scope Card */}
                {categories.motion && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1 }} 
                    className="bg-gradient-to-br from-blue-500/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-blue-500/15 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none font-serif">M</div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3 border-b border-border pb-4">
                      <PlayCircle size={18} className="text-blue-500"/> 
                      <span>{currentT.motion_title}</span>
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">{currentT.motion_sec}</label>
                          <motion.span 
                            key={scope.motion_duration}
                            initial={{ scale: 1.3, color: '#3b82f6' }}
                            animate={{ scale: 1, color: 'var(--foreground)' }}
                            className="text-lg font-black bg-surface px-4 py-1.5 rounded-xl border border-border shadow-sm"
                          >
                            {scope.motion_duration} Seconds ⏱️
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setScope({...scope, motion_duration: Math.max(5, scope.motion_duration - 5)})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-blue-500 hover:text-blue-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="5"
                            value={scope.motion_duration} 
                            onChange={e => setScope({...scope, motion_duration: Math.max(5, parseInt(e.target.value) || 5)})} 
                            className="w-24 h-12 bg-surface border border-border rounded-xl text-center font-mono font-bold text-lg focus:border-blue-500 outline-none shadow-sm text-[#111827]" 
                          />
                          <button
                            type="button"
                            onClick={() => setScope({...scope, motion_duration: scope.motion_duration + 5})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-blue-500 hover:text-blue-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            +
                          </button>
                          <span className="text-xs text-muted font-bold tracking-wider uppercase ml-2">
                            {lang === 'bn' ? 'সেকেন্ড' : 'Seconds'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-4">{currentT.motion_style}</label>
                        <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setScope({...scope, motion_style: '2d'})} 
                            className={`flex-1 py-4 px-6 rounded-2xl border transition-all font-bold text-sm flex items-center justify-center gap-2 cursor-pointer select-none ${
                              scope.motion_style === '2d' 
                                ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105' 
                                : 'border-border bg-background hover:bg-surface text-muted'
                            }`}
                          >
                            <span>{currentT.style_2d}</span>
                          </button>
                          
                          <button 
                            type="button"
                            onClick={() => setScope({...scope, motion_style: '3d'})} 
                            className={`flex-1 py-4 px-6 rounded-2xl border transition-all font-bold text-sm flex items-center justify-center gap-2 cursor-pointer select-none ${
                              scope.motion_style === '3d' 
                                ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105' 
                                : 'border-border bg-background hover:bg-surface text-muted'
                            }`}
                          >
                            <span className="flex flex-col items-center">
                              <span>{currentT.style_3d}</span>
                              <span className="text-[10px] opacity-80 font-normal leading-none mt-1">+৳{(c.motionStyle3dExtra).toLocaleString()}</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-blue-500/40 select-none ${
                          scope.motion_voiceover 
                            ? 'bg-blue-500/[0.03] border-blue-500 shadow-md shadow-blue-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.motion_voiceover} 
                            onChange={e => setScope({...scope, motion_voiceover: e.target.checked})} 
                            className="w-5 h-5 accent-blue-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.motion_voiceover}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.motion_voiceover_desc}{c.motionVoiceover.toLocaleString()})
                            </span>
                          </div>
                        </label>

                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-blue-500/40 select-none ${
                          scope.motion_sfx 
                            ? 'bg-blue-500/[0.03] border-blue-500 shadow-md shadow-blue-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.motion_sfx} 
                            onChange={e => setScope({...scope, motion_sfx: e.target.checked})} 
                            className="w-5 h-5 accent-blue-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.motion_sfx}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.motion_sfx_desc}{c.motionSfx.toLocaleString()})
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. UI/UX Scope Card */}
                {categories.uiux && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 }} 
                    className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-emerald-500/15 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none font-serif">U</div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3 border-b border-border pb-4">
                      <LayoutTemplate size={18} className="text-emerald-500"/> 
                      <span>{currentT.uiux_title}</span>
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">{currentT.uiux_screens}</label>
                          <motion.span 
                            key={scope.uiux_screens}
                            initial={{ scale: 1.3, color: '#10b981' }}
                            animate={{ scale: 1, color: 'var(--foreground)' }}
                            className="text-lg font-black bg-surface px-4 py-1.5 rounded-xl border border-border shadow-sm"
                          >
                            {scope.uiux_screens} screens
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setScope({...scope, uiux_screens: Math.max(1, scope.uiux_screens - 1)})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-emerald-500 hover:text-emerald-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            value={scope.uiux_screens} 
                            onChange={e => setScope({...scope, uiux_screens: Math.max(1, parseInt(e.target.value) || 1)})} 
                            className="w-24 h-12 bg-surface border border-border rounded-xl text-center font-mono font-bold text-lg focus:border-emerald-500 outline-none shadow-sm text-[#111827]" 
                          />
                          <button
                            type="button"
                            onClick={() => setScope({...scope, uiux_screens: scope.uiux_screens + 1})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-emerald-500 hover:text-emerald-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            +
                          </button>
                          <span className="text-xs text-muted font-bold tracking-wider uppercase ml-2">
                            {lang === 'bn' ? 'টি স্ক্রিন' : 'screens'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-emerald-500/40 select-none ${
                          scope.uiux_prototype 
                            ? 'bg-emerald-500/[0.03] border-emerald-500 shadow-md shadow-emerald-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.uiux_prototype} 
                            onChange={e => setScope({...scope, uiux_prototype: e.target.checked})} 
                            className="w-5 h-5 accent-emerald-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.uiux_proto}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.uiux_proto_desc}{c.uiuxPrototype.toLocaleString()})
                            </span>
                          </div>
                        </label>

                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-emerald-500/40 select-none ${
                          scope.uiux_design_system 
                            ? 'bg-emerald-500/[0.03] border-emerald-500 shadow-md shadow-emerald-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.uiux_design_system} 
                            onChange={e => setScope({...scope, uiux_design_system: e.target.checked})} 
                            className="w-5 h-5 accent-emerald-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.uiux_ds}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.uiux_ds_desc}{c.uiuxDesignSystem.toLocaleString()})
                            </span>
                          </div>
                        </label>

                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-emerald-500/40 select-none ${
                          scope.uiux_responsive 
                            ? 'bg-emerald-500/[0.03] border-emerald-500 shadow-md shadow-emerald-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.uiux_responsive} 
                            onChange={e => setScope({...scope, uiux_responsive: e.target.checked})} 
                            className="w-5 h-5 accent-emerald-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.uiux_resp}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.uiux_resp_desc}{c.uiuxResponsive.toLocaleString()})
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. Illustration & Arts Scope Card (NEW) */}
                {categories.illustration && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.3 }} 
                    className="bg-gradient-to-br from-amber-500/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-amber-500/15 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none font-serif">I</div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3 border-b border-border pb-4">
                      <PenTool size={18} className="text-amber-500"/> 
                      <span>{currentT.illustration_title}</span>
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">{currentT.illustration_count}</label>
                          <motion.span 
                            key={scope.illustration_count}
                            initial={{ scale: 1.3, color: '#f59e0b' }}
                            animate={{ scale: 1, color: 'var(--foreground)' }}
                            className="text-lg font-black bg-surface px-4 py-1.5 rounded-xl border border-border shadow-sm"
                          >
                            {scope.illustration_count} drawings 🎨
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setScope({...scope, illustration_count: Math.max(1, scope.illustration_count - 1)})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-amber-500 hover:text-amber-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            value={scope.illustration_count} 
                            onChange={e => setScope({...scope, illustration_count: Math.max(1, parseInt(e.target.value) || 1)})} 
                            className="w-24 h-12 bg-surface border border-border rounded-xl text-center font-mono font-bold text-lg focus:border-amber-500 outline-none shadow-sm text-[#111827]" 
                          />
                          <button
                            type="button"
                            onClick={() => setScope({...scope, illustration_count: scope.illustration_count + 1})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-amber-500 hover:text-amber-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            +
                          </button>
                          <span className="text-xs text-muted font-bold tracking-wider uppercase ml-2">
                            {lang === 'bn' ? 'টি ইলাস্ট্রেশন' : 'drawings'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Mascot Design */}
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-amber-500/40 select-none ${
                          scope.illustration_character 
                            ? 'bg-amber-500/[0.03] border-amber-500 shadow-md shadow-amber-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.illustration_character} 
                            onChange={e => setScope({...scope, illustration_character: e.target.checked})} 
                            className="w-5 h-5 accent-amber-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.illustration_char}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.illustration_char_desc}{(c.illustrationCharacterDesign || 8000).toLocaleString()})
                            </span>
                          </div>
                        </label>

                        {/* Storyboarding */}
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-amber-500/40 select-none ${
                          scope.illustration_storyboard 
                            ? 'bg-amber-500/[0.03] border-amber-500 shadow-md shadow-amber-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.illustration_storyboard} 
                            onChange={e => setScope({...scope, illustration_storyboard: e.target.checked})} 
                            className="w-5 h-5 accent-amber-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.illustration_story}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.illustration_story_desc}{(c.illustrationStoryboard || 10000).toLocaleString()})
                            </span>
                          </div>
                        </label>

                        {/* Vector Asset Handoff */}
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-amber-500/40 select-none ${
                          scope.illustration_vector 
                            ? 'bg-amber-500/[0.03] border-amber-500 shadow-md shadow-amber-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.illustration_vector} 
                            onChange={e => setScope({...scope, illustration_vector: e.target.checked})} 
                            className="w-5 h-5 accent-amber-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.illustration_vec}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.illustration_vec_desc}{(c.illustrationVectorHandoff || 5000).toLocaleString()})
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. Creative Direction & Exhibition Curation Scope Card (NEW) */}
                {categories.creative && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.4 }} 
                    className="bg-gradient-to-br from-violet-500/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-violet-500/15 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none font-serif">C</div>
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3 border-b border-border pb-4">
                      <Sparkles size={18} className="text-violet-500"/> 
                      <span>{currentT.creative_title}</span>
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">{currentT.creative_days}</label>
                          <motion.span 
                            key={scope.creative_days}
                            initial={{ scale: 1.3, color: '#8b5cf6' }}
                            animate={{ scale: 1, color: 'var(--foreground)' }}
                            className="text-lg font-black bg-surface px-4 py-1.5 rounded-xl border border-border shadow-sm"
                          >
                            {scope.creative_days} Days Event 🎪
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setScope({...scope, creative_days: Math.max(1, scope.creative_days - 1)})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-violet-500 hover:text-violet-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            value={scope.creative_days} 
                            onChange={e => setScope({...scope, creative_days: Math.max(1, parseInt(e.target.value) || 1)})} 
                            className="w-24 h-12 bg-surface border border-border rounded-xl text-center font-mono font-bold text-lg focus:border-violet-500 outline-none shadow-sm text-[#111827]" 
                          />
                          <button
                            type="button"
                            onClick={() => setScope({...scope, creative_days: scope.creative_days + 1})}
                            className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg hover:border-violet-500 hover:text-violet-500 active:scale-95 transition-all select-none shadow-sm cursor-pointer text-[#111827]"
                          >
                            +
                          </button>
                          <span className="text-xs text-muted font-bold tracking-wider uppercase ml-2">
                            {lang === 'bn' ? 'দিনের ইভেন্ট' : 'Days Event'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 3D Exhibition Mapping */}
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-violet-500/40 select-none ${
                          scope.creative_mapping 
                            ? 'bg-violet-500/[0.03] border-violet-500 shadow-md shadow-violet-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.creative_mapping} 
                            onChange={e => setScope({...scope, creative_mapping: e.target.checked})} 
                            className="w-5 h-5 accent-violet-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.creative_mapping}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.creative_mapping_desc}{(c.creativeDirection3dMapping || 25000).toLocaleString()})
                            </span>
                          </div>
                        </label>

                        {/* Event Print Collaterals */}
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-violet-500/40 select-none ${
                          scope.creative_prints 
                            ? 'bg-violet-500/[0.03] border-violet-500 shadow-md shadow-violet-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.creative_prints} 
                            onChange={e => setScope({...scope, creative_prints: e.target.checked})} 
                            className="w-5 h-5 accent-violet-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.creative_prints}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.creative_prints_desc}{(c.creativeDirectionPrintCollaterals || 15000).toLocaleString()})
                            </span>
                          </div>
                        </label>

                        {/* Curation PR Consulting */}
                        <label className={`flex gap-3 cursor-pointer p-5 rounded-2xl border transition-all duration-300 hover:border-violet-500/40 select-none ${
                          scope.creative_consulting 
                            ? 'bg-violet-500/[0.03] border-violet-500 shadow-md shadow-violet-500/5' 
                            : 'bg-background/80 border-border'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={scope.creative_consulting} 
                            onChange={e => setScope({...scope, creative_consulting: e.target.checked})} 
                            className="w-5 h-5 accent-violet-500 rounded mt-0.5" 
                          />
                          <div>
                            <span className="font-bold text-sm block">{currentT.creative_consult}</span>
                            <span className="text-[10px] text-muted leading-relaxed block mt-1">
                              {currentT.creative_consult_desc}{(c.creativeDirectionCurationConsulting || 20000).toLocaleString()})
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. Dynamic Custom Services & Features Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="bg-gradient-to-br from-indigo-500/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-indigo-500/15 relative overflow-hidden shadow-sm space-y-6"
                >
                  <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none font-serif">🛠️</div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-3 border-b border-border pb-4">
                      <Sparkles size={18} className="text-indigo-500"/> 
                      <span>{lang === 'bn' ? 'অতিরিক্ত কাস্টম সেবা যোগ করুন' : 'Add Custom Requirements & Services'}</span>
                    </h3>
                    <p className="text-muted text-xs font-light mt-2">
                      {lang === 'bn' 
                        ? 'আপনার প্রজেক্টে যদি উপরে তালিকাভুক্ত সেবার বাইরে অন্য কিছু প্রয়োজন হয়, তবে এখানে নিজস্ব সেবা এবং বাজেট যোগ করতে পারেন।' 
                        : 'If your project has requirements outside our standard options, you can add custom items and their BDT prices below.'}
                    </p>
                  </div>

                  {/* Add Custom Service Form */}
                  <div className="flex flex-col sm:flex-row gap-4 items-end bg-background/50 p-4 rounded-2xl border border-border">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">
                        {lang === 'bn' ? 'কাস্টম কাজের নাম' : 'Custom Work/Feature Name'}
                      </label>
                      <input 
                        type="text" 
                        placeholder={lang === 'bn' ? 'যেমন: লোগো অ্যানিমেশন, প্যাকেজিং ডিজাইন' : 'e.g. Logo Animation, Package Design'}
                        value={customInputName}
                        onChange={e => setCustomInputName(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-[#111827] outline-none focus:border-indigo-500 font-semibold"
                      />
                    </div>
                    <div className="w-full sm:w-44">
                      <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">
                        {lang === 'bn' ? 'সম্ভাব‍্য বাজেট (৳)' : 'Estimated Price (৳)'}
                      </label>
                      <input 
                        type="number" 
                        placeholder="5,000"
                        value={customInputPrice || ""}
                        onChange={e => setCustomInputPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-[#111827] outline-none focus:border-indigo-500 font-mono font-semibold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomService}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/10 cursor-pointer active:scale-95 transition-all shrink-0 h-10 w-full sm:w-auto font-sans"
                    >
                      {lang === 'bn' ? 'যোগ করুন' : 'Add Item'}
                    </button>
                  </div>

                  {/* Custom Services List */}
                  {customServices.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-[10px] text-muted font-bold uppercase tracking-wider">
                        {lang === 'bn' ? 'আপনার যুক্ত করা কাস্টম সেবাসমূহ:' : 'Your Custom Items Added:'}
                      </label>
                      <div className="space-y-2">
                        {customServices.map((service) => (
                          <div 
                            key={service.id} 
                            className="flex justify-between items-center bg-surface border border-indigo-500/20 px-4 py-3 rounded-xl shadow-sm text-xs font-semibold"
                          >
                            <span className="text-[#111827]">{service.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-indigo-600">৳ {service.price.toLocaleString()}</span>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveCustomService(service.id)}
                                className="text-red-500 hover:text-red-600 font-bold hover:scale-105 transition-transform"
                              >
                                {lang === 'bn' ? 'বাদ দিন' : 'Remove'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom requirements comments */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-muted font-bold uppercase tracking-wider">
                      {lang === 'bn' ? 'অতিরিক্ত কোনো স্পেসিফিকেশন বা নির্দেশনা:' : 'Any Additional Specifications or Details:'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={lang === 'bn' ? 'আপনার কাস্টম কাজের বিস্তারিত বিবরণ এখানে লিখুন...' : 'Write any custom requirements details here...'}
                      value={scope.custom_notes || ""}
                      onChange={e => setScope({...scope, custom_notes: e.target.value})}
                      className="w-full bg-surface border border-border rounded-2xl p-4 text-xs text-[#111827] outline-none focus:border-indigo-500 font-semibold resize-none"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
 
            {/* STEP 3: Delivery Timeline Pace */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-6"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                  <Clock className="text-brand-red" size={24} />
                  <span>{currentT.step3_deadline}</span>
                </h2>
                <p className="text-muted text-sm md:text-base font-light mb-12 max-w-md mx-auto">{currentT.step3_desc}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                  {/* Pace option 1: Chill Mode */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setTimeline('standard')}
                    className={`p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-5 cursor-pointer ${
                      timeline === 'standard' 
                        ? 'border-brand-red bg-brand-red/[0.03] shadow-xl shadow-brand-red/5' 
                        : 'border-border hover:border-brand-red/40 bg-background/50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      timeline === 'standard' ? 'bg-brand-red text-white shadow-lg' : 'bg-surface border border-border text-muted'
                    }`}>
                      <Clock size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{currentT.chill_mode}</h3>
                      <p className="text-xs text-muted leading-relaxed font-light">{currentT.chill_desc}</p>
                    </div>
                  </motion.button>

                  {/* Pace option 2: Warp Speed (Rush) */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setTimeline('rush')}
                    className={`p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-5 cursor-pointer ${
                      timeline === 'rush' 
                        ? 'border-orange-500 bg-orange-500/[0.03] shadow-xl shadow-orange-500/5' 
                        : 'border-border hover:border-orange-500/40 bg-background/50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      timeline === 'rush' ? 'bg-orange-500 text-white shadow-lg' : 'bg-surface border border-border text-muted'
                    }`}>
                      <Zap size={28} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{currentT.warp_speed}</h3>
                      <p className="text-xs text-muted leading-relaxed font-light">{currentT.warp_desc}</p>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
 
            {/* STEP 4: Ballroom Ballpark Receipt Results */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-4 relative"
              >
                {/* Festive background sparks */}
                <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 text-9xl opacity-5 pointer-events-none -z-10 animate-bounce">🎉</div>
                
                <span className="bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-brand-red/10 shadow-sm flex items-center gap-1.5">
                  <Sparkle size={10} className="animate-pulse" />
                  <span>球 ESTIMATE 球</span>
                </span>
                
                <h2 className="text-3xl font-bold mb-2 font-serif">{currentT.step4_results}</h2>
                <p className="text-muted text-xs md:text-sm font-light max-w-md mx-auto mb-8">{currentT.step4_desc}</p>
                
                {/* BALLPARK BUDGET TADA DISPLAY */}
                <div className="text-4xl md:text-[5rem] font-serif font-black text-foreground mb-8 flex items-center justify-center gap-1 md:gap-2 flex-wrap mt-2 leading-none border-y border-border py-6 w-full max-w-xl">
                  <span className="text-brand-red/80 font-sans text-2xl md:text-4xl font-light">৳</span>
                  <AnimatedNumber value={budget.min} /> 
                  <span className="text-brand-red/50 text-2xl md:text-4xl mx-3 font-sans font-light">-</span> 
                  <span className="text-brand-red/80 font-sans text-2xl md:text-4xl font-light">৳</span>
                  <AnimatedNumber value={budget.max} />
                </div>
                
                {/* High-End Bill Review Table Receipt */}
                <div className="w-full max-w-lg bg-surface/50 border border-border p-6 md:p-8 rounded-[2rem] mb-10 text-left relative overflow-hidden group hover:border-brand-red/20 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/[0.02] rounded-full blur-2xl group-hover:bg-brand-red/[0.04] transition-colors" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-border pb-3 text-brand-red">
                    <Wand2 size={12}/>
                    <span>{currentT.recipe}</span>
                  </p>
                  
                  <ul className="space-y-4 text-sm font-medium">
                    {/* Branding list */}
                    {categories.branding && (
                      <li className="flex justify-between items-start border-b border-border/50 pb-3">
                        <div>
                          <div className="flex items-center gap-2 text-foreground font-bold">
                            <span className="text-base">🦄</span>
                            <span>{currentT.branding_recipe}</span>
                            <span className="text-[10px] font-normal text-muted bg-surface border border-border px-2 py-0.5 rounded-full ml-1">
                              {scope.branding_logos} {currentT.branding_recipe_concepts}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted ml-6 font-light mt-1.5 flex flex-wrap gap-2">
                            {scope.branding_guidelines && <span className="bg-brand-red/5 px-2 py-0.5 rounded text-brand-red">Brand Guidelines</span>}
                            {scope.branding_social && <span className="bg-brand-red/5 px-2 py-0.5 rounded text-brand-red">Social Kit</span>}
                            {scope.branding_stationery && <span className="bg-brand-red/5 px-2 py-0.5 rounded text-brand-red">Stationery Design</span>}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-red/90 font-mono">৳{c.brandingBase.toLocaleString()}</span>
                      </li>
                    )}

                    {/* Motion list */}
                    {categories.motion && (
                      <li className="flex justify-between items-start border-b border-border/50 pb-3">
                        <div>
                          <div className="flex items-center gap-2 text-foreground font-bold">
                            <span className="text-base">🍿</span>
                            <span>{currentT.motion_recipe}</span>
                            <span className="text-[10px] font-normal text-muted bg-surface border border-border px-2 py-0.5 rounded-full ml-1 uppercase">
                              {scope.motion_duration}s | {scope.motion_style}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted ml-6 font-light mt-1.5 flex flex-wrap gap-2">
                            {scope.motion_voiceover && <span className="bg-blue-500/5 px-2 py-0.5 rounded text-blue-500">Voiceover Studio</span>}
                            {scope.motion_sfx && <span className="bg-blue-500/5 px-2 py-0.5 rounded text-blue-500">Custom SFX</span>}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-red/90 font-mono">৳{c.motionBase.toLocaleString()}</span>
                      </li>
                    )}

                    {/* UI/UX list */}
                    {categories.uiux && (
                      <li className="flex justify-between items-start border-b border-border/50 pb-3">
                        <div>
                          <div className="flex items-center gap-2 text-foreground font-bold">
                            <span className="text-base">🕹️</span>
                            <span>{currentT.uiux_recipe}</span>
                            <span className="text-[10px] font-normal text-muted bg-surface border border-border px-2 py-0.5 rounded-full ml-1">
                              {scope.uiux_screens} {currentT.screens_recipe}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted ml-6 font-light mt-1.5 flex flex-wrap gap-2">
                            {scope.uiux_prototype && <span className="bg-emerald-500/5 px-2 py-0.5 rounded text-emerald-500">Clickable Prototype</span>}
                            {scope.uiux_design_system && <span className="bg-emerald-500/5 px-2 py-0.5 rounded text-emerald-500">Component Design System</span>}
                            {scope.uiux_responsive && <span className="bg-emerald-500/5 px-2 py-0.5 rounded text-emerald-500">Responsive Handoff</span>}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-red/90 font-mono">৳{c.uiuxBase.toLocaleString()}</span>
                      </li>
                    )}

                    {/* Illustration & Arts list */}
                    {categories.illustration && (
                      <li className="flex justify-between items-start border-b border-border/50 pb-3">
                        <div>
                          <div className="flex items-center gap-2 text-foreground font-bold">
                            <span className="text-base">🎨</span>
                            <span>{currentT.illustration_recipe}</span>
                            <span className="text-[10px] font-normal text-muted bg-surface border border-border px-2 py-0.5 rounded-full ml-1">
                              {scope.illustration_count} {currentT.illustrations_count_recipe}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted ml-6 font-light mt-1.5 flex flex-wrap gap-2">
                            {scope.illustration_character && <span className="bg-amber-500/5 px-2 py-0.5 rounded text-amber-500">Mascot Character Design</span>}
                            {scope.illustration_storyboard && <span className="bg-amber-500/5 px-2 py-0.5 rounded text-amber-500">Cartoon Storyboard</span>}
                            {scope.illustration_vector && <span className="bg-amber-500/5 px-2 py-0.5 rounded text-amber-500">Vector Handoff</span>}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-red/90 font-mono">৳{(c.illustrationBase || 15000).toLocaleString()}</span>
                      </li>
                    )}

                    {/* Creative Direction list */}
                    {categories.creative && (
                      <li className="flex justify-between items-start border-b border-border/50 pb-3">
                        <div>
                          <div className="flex items-center gap-2 text-foreground font-bold">
                            <span className="text-base">🎪</span>
                            <span>{currentT.creative_recipe}</span>
                            <span className="text-[10px] font-normal text-muted bg-surface border border-border px-2 py-0.5 rounded-full ml-1">
                              {scope.creative_days} {currentT.creative_days_recipe}
                            </span>
                          </div>
                          <div className="text-[10px] text-muted ml-6 font-light mt-1.5 flex flex-wrap gap-2">
                            {scope.creative_mapping && <span className="bg-violet-500/5 px-2 py-0.5 rounded text-violet-500">3D Venue Layout</span>}
                            {scope.creative_prints && <span className="bg-violet-500/5 px-2 py-0.5 rounded text-violet-500">Print Collaterals</span>}
                            {scope.creative_consulting && <span className="bg-violet-500/5 px-2 py-0.5 rounded text-violet-500">Curation PR Handoff</span>}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-red/90 font-mono">৳{(c.creativeDirectionBase || 50000).toLocaleString()}</span>
                      </li>
                    )}

                    {/* Custom services list in Receipt */}
                    {customServices.length > 0 && customServices.map(item => (
                      <li key={item.id} className="flex justify-between items-center border-b border-border/50 pb-3 font-semibold">
                        <div className="flex items-center gap-2 text-foreground">
                          <span className="text-base">🛠️</span>
                          <span>{item.name}</span>
                          <span className="text-[9px] font-normal text-muted bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-600">Custom</span>
                        </div>
                        <span className="text-xs font-bold text-brand-red/90 font-mono">৳{item.price.toLocaleString()}</span>
                      </li>
                    ))}

                    {/* Rush Option */}
                    {timeline === 'rush' && (
                      <li className="text-orange-500 font-bold flex justify-between items-center text-xs pt-1">
                        <span className="flex items-center gap-2">⚡ {currentT.rush_recipe}</span>
                        <span className="font-mono">x{c.timelineRushMultiplier}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Immersive Client-Outbox CTA Buttons */}
                <div className="flex flex-col w-full max-w-lg gap-4">
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:hello@antor.studio?subject=Project Inquiry - Calculated Budget ৳${budget.min}-৳${budget.max}&body=Hi Antor,%0A%0AI used your budget calculator and I'm ready to roll! 🚀%0A%0ABudget Estimate: ৳${budget.min} - ৳${budget.max}%0ATimeline: ${timeline === 'rush' ? 'Warp Speed ⚡' : 'Chill Mode 🕒'}%0A%0AHere's the recipe:%0A${categories.branding ? `- Branding (${scope.branding_logos} concepts) ${scope.branding_guidelines ? '+ Guidelines' : ''} ${scope.branding_social ? '+ Social' : ''} ${scope.branding_stationery ? '+ Stationery' : ''}%0A` : ''}${categories.motion ? `- Motion Graphics (${scope.motion_duration}s, ${scope.motion_style}) ${scope.motion_voiceover ? '+ Voiceover' : ''} ${scope.motion_sfx ? '+ Custom SFX' : ''}%0A` : ''}${categories.uiux ? `- UI/UX Design (${scope.uiux_screens} screens) ${scope.uiux_prototype ? '+ Prototype' : ''} ${scope.uiux_design_system ? '+ Design System' : ''} ${scope.uiux_responsive ? '+ Responsive' : ''}%0A` : ''}${categories.illustration ? `- Illustration (${scope.illustration_count} drawings) ${scope.illustration_character ? '+ Mascot' : ''} ${scope.illustration_storyboard ? '+ Storyboard' : ''} ${scope.illustration_vector ? '+ Vector source' : ''}%0A` : ''}${categories.creative ? `- Creative Direction (${scope.creative_days} days scale) ${scope.creative_mapping ? '+ 3D mapping' : ''} ${scope.creative_prints ? '+ Print collaterals' : ''} ${scope.creative_consulting ? '+ PR consulting' : ''}%0A` : ''}${customServices.length > 0 ? `%0ACustom services added:%0A${customServices.map(i => `- ${i.name} (৳${i.price.toLocaleString()})`).join('%0A')}%0A` : ''}${scope.custom_notes ? `%0AAdditional notes:%0A${scope.custom_notes}%0A` : ''}%0ALet's schedule a chat!`}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white py-5 rounded-2xl font-black text-base md:text-lg shadow-xl shadow-brand-red/25 flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>{currentT.build_together}</span> 
                      <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                    </span>
                  </motion.a>
                  
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-xs text-muted mb-2 font-medium">{currentT.tight_budget}</p>
                    <Link 
                      href="/contact" 
                      className="text-brand-red font-bold hover:underline flex items-center gap-2 text-xs bg-brand-red/5 px-4 py-2 rounded-full hover:bg-brand-red/10 transition-colors"
                    >
                      <MessageSquare size={12}/> 
                      <span>{currentT.custom_phased}</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>

          {/* Navigation Controls Footer */}
          {step < 4 && (
            <div className="mt-auto pt-8 flex justify-between items-center border-t border-border/50 relative z-20">
              {step > 1 ? (
                <button 
                  onClick={prevStep} 
                  className="flex items-center gap-2 text-muted hover:text-foreground transition-colors font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-surface-heavy/20 cursor-pointer select-none"
                >
                  <ArrowLeft size={16} /> 
                  <span>{currentT.go_back}</span>
                </button>
              ) : <div />}
              
              <motion.button 
                whileHover={{ scale: step === 1 && !isCategorySelected ? 1 : 1.02 }}
                whileTap={{ scale: step === 1 && !isCategorySelected ? 1 : 0.98 }}
                onClick={nextStep} 
                disabled={step === 1 && !isCategorySelected}
                className={`px-7 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-3 shadow-lg cursor-pointer select-none ${
                  step === 1 && !isCategorySelected 
                    ? 'bg-surface-heavy/30 text-muted cursor-not-allowed opacity-40 shadow-none border border-border' 
                    : 'bg-brand-red text-white hover:bg-brand-red/90 shadow-brand-red/20'
                }`}
              >
                <span>{step === 3 ? currentT.estimator_generate : currentT.next_step}</span> 
                <ArrowRight size={16} />
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* 4. Strategic Premium Info Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          <motion.div whileHover={{ y: -4 }} className="bg-surface border border-border p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/[0.02] rounded-full blur-xl group-hover:bg-brand-red/[0.04] transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-6">
              <Palette size={20} />
            </div>
            <h4 className="font-bold mb-3 text-lg">{currentT.card1_t}</h4>
            <p className="text-xs text-muted font-light leading-relaxed">{currentT.card1_d}</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="bg-surface border border-border p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.02] rounded-full blur-xl group-hover:bg-blue-500/[0.04] transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
              <Sparkles size={20} />
            </div>
            <h4 className="font-bold mb-3 text-lg">{currentT.card2_t}</h4>
            <p className="text-xs text-muted font-light leading-relaxed">{currentT.card2_d}</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="bg-surface border border-border p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl group-hover:bg-emerald-500/[0.04] transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
              <Rocket size={20} />
            </div>
            <h4 className="font-bold mb-3 text-lg">{currentT.card3_t}</h4>
            <p className="text-xs text-muted font-light leading-relaxed">{currentT.card3_d}</p>
          </motion.div>
        </div>

      </div>
    </main>
  );
}
