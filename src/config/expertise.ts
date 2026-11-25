export type ExpertiseIconName =
  | "palette"
  | "layout"
  | "pen"
  | "film"
  | "box"
  | "lightbulb";

export interface ExpertiseProcessStep {
  title: string;
  desc: string;
}

export interface ExpertiseLocaleContent {
  title: string;
  shortDesc: string;
  tagline: string;
  overview: string;
  timeline: string;
  startingBudget: string;
  deliverables: string[];
  process: ExpertiseProcessStep[];
  highlights: string[];
}

export interface ExpertiseItem {
  slug: string;
  translationKey: "graphic" | "uiux" | "illustration" | "motion" | "animation" | "creative";
  icon: ExpertiseIconName;
  tools: string[];
  portfolioCategory: string;
  en: ExpertiseLocaleContent;
  bn: ExpertiseLocaleContent;
}

export const EXPERTISE_LIST: ExpertiseItem[] = [
  {
    slug: "graphic-design",
    translationKey: "graphic",
    icon: "palette",
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Minimalist Layout"],
    portfolioCategory: "branding",
    en: {
      title: "Graphic Design",
      shortDesc:
        "Crafting memorable visual identities, posters, and print materials that resonate with your target audience.",
      tagline: "Branding, packaging, and print systems built for clarity and lasting recall.",
      overview:
        "From full brand identities and packaging dielines to event posters, catalogs, and corporate stationery, every piece is designed to communicate your brand's voice clearly across print and digital touchpoints.",
      timeline: "1–3 Weeks",
      startingBudget: "৳18,000+",
      deliverables: [
        "Logo & Complete Brand Identity Systems",
        "Packaging & Dieline Design for Products",
        "Posters, Banners, Flyers, Folders & Crests",
        "Catalogs, Brochures & Editorial Layouts",
        "Social Media Campaigns & Promotional Kits",
        "Print-Ready Source Files & Brand Guidelines",
      ],
      process: [
        {
          title: "Brand Discovery",
          desc: "Researching your market, audience, and competitors to define the right visual direction.",
        },
        {
          title: "Concept & Typography",
          desc: "Exploring logo marks, color palettes, grid systems, and distinctive typographic pairings.",
        },
        {
          title: "Print & Digital Rollout",
          desc: "Adapting the identity into packaging, promotional banners, catalogs, and social assets.",
        },
        {
          title: "Production Handoff",
          desc: "Delivering print-ready CMYK files, dielines, and scalable vector formats.",
        },
      ],
      highlights: [
        "Canvas — Packaging design, hero banners & brand strategy for art materials e-commerce",
        "Hotel Okada (Bisorgo Technology) — Catalogs, leaflets, posters & daily social media visuals",
        "CCJ-B — Crests, posters, banners, flyers & folders for 10+ climate workshops",
      ],
    },
    bn: {
      title: "গ্রাফিক ডিজাইন",
      shortDesc:
        "ব্র্যান্ড আইডেন্টিটি, পোস্টার এবং প্রিন্ট ম্যাটেরিয়াল ডিজাইন, যা আপনার টার্গেট অডিয়েন্সকে আকৃষ্ট করবে।",
      tagline: "ব্র্যান্ডিং, প্যাকেজিং এবং প্রিন্ট ডিজাইনের নিখুঁত সমন্বয়।",
      overview:
        "সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি ও প্যাকেজিং ডাইলাইন থেকে শুরু করে ইভেন্ট পোস্টার, ক্যাটালগ ও কর্পোরেট ব্র্যান্ডিং—প্রতিটি ডিজাইন প্রিন্ট এবং ডিজিটাল মাধ্যমে আপনার ব্র্যান্ডকে স্পষ্টভাবে উপস্থাপন করে।",
      timeline: "১–৩ সপ্তাহ",
      startingBudget: "৳১৮,০০০+",
      deliverables: [
        "লোগো ও সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি সিস্টেম",
        "প্রোডাক্ট প্যাকেজিং ও ডাইলাইন ডিজাইন",
        "পোস্টার, ব্যানার, ফ্লায়ার, ফোল্ডার ও ক্রেস্ট",
        "ক্যাটালগ, ব্রোশিওর ও মিনিমালিস্ট লেআউট",
        "সোশ্যাল মিডিয়া ক্যাম্পেইন ও প্রমোশনাল কিট",
        "প্রিন্ট-রেডি সোর্স ফাইল ও ব্র্যান্ড গাইডলাইন",
      ],
      process: [
        {
          title: "ব্র্যান্ড ডিসকভারি",
          desc: "টার্গেট অডিয়েন্স, মার্কেট ও ব্র্যান্ডের লক্ষ্য বিশ্লেষণ করে ভিজ্যুয়াল দিকনির্দেশনা ঠিক করা।",
        },
        {
          title: "কনসেপ্ট ও টাইপোগ্রাফি",
          desc: "লোগো, কালার প্যালেট, গ্রিড এবং আকর্ষণীয় টাইপোগ্রাফির কনসেপ্ট তৈরি।",
        },
        {
          title: "প্রিন্ট ও ডিজিটাল ডিজাইন",
          desc: "প্যাকেজিং, প্রমোশনাল ব্যানার, ক্যাটালগ এবং সোশ্যাল মিডিয়া অ্যাসেটে রূপান্তর।",
        },
        {
          title: "ফাইনাল হ্যান্ডঅফ",
          desc: "প্রিন্ট-রেডি CMYK ফাইল, ডাইলাইন ও স্কেলেবল ভেক্টর ফাইল সরবরাহ।",
        },
      ],
      highlights: [
        "Canvas — আর্ট ম্যাটেরিয়াল ই-কমার্সের প্যাকেজিং, হিরো ব্যানার ও ব্র্যান্ড স্ট্র্যাটেজি",
        "Hotel Okada (Bisorgo Technology) — ক্যাটালগ, লিফলেট, পোস্টার ও সোশ্যাল মিডিয়া ডিজাইন",
        "CCJ-B — ১০+ জলবায়ু কর্মশালার ক্রেস্ট, পোস্টার, ব্যানার ও ফোল্ডার ডিজাইন",
      ],
    },
  },
  {
    slug: "ui-ux-design",
    translationKey: "uiux",
    icon: "layout",
    tools: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Design Systems"],
    portfolioCategory: "uiux",
    en: {
      title: "UI/UX Design",
      shortDesc:
        "Designing intuitive, user-centric interfaces and digital playgrounds with modern aesthetics.",
      tagline: "Human-centered interfaces, e-commerce flows, and scalable design systems.",
      overview:
        "I design clean, conversion-focused web and product interfaces that balance strong brand personality with effortless usability—covering wireframes, high-fidelity UI, and strategic UX consulting.",
      timeline: "1–2 Weeks",
      startingBudget: "৳20,000+",
      deliverables: [
        "User Flows, Information Architecture & Wireframes",
        "High-Fidelity Web & Mobile UI Designs",
        "E-Commerce Storefronts & Hero Banner Systems",
        "Reusable Component Libraries & Design Systems",
        "Interactive Clickable Prototypes",
        "Strategic Product & UX Audit Consulting",
      ],
      process: [
        {
          title: "UX Audit & User Flow",
          desc: "Mapping user journeys and identifying friction points across key screens.",
        },
        {
          title: "Wireframing & Layout",
          desc: "Structuring minimalist, scannable layouts focused on clarity and conversion.",
        },
        {
          title: "Visual UI & Prototyping",
          desc: "Applying typography, micro-interactions, and responsive breakpoints.",
        },
        {
          title: "Developer Handoff",
          desc: "Delivering organized design tokens, components, and annotated specs.",
        },
      ],
      highlights: [
        "Canvas — UI design, hero banner concepts & strategic consulting for e-commerce UX",
        "Antor Creative Studio — Custom bilingual portfolio, estimator & interactive showcases",
      ],
    },
    bn: {
      title: "UI/UX ডিজাইন",
      shortDesc:
        "ইউজার-বান্ধব এবং দৃষ্টিনন্দন ওয়েবসাইট ও অ্যাপ্লিকেশনের ইন্টারফেস ডিজাইন করা।",
      tagline: "আধুনিক ইন্টারফেস, ই-কমার্স ইউজার ফ্লো এবং স্কেলেবল ডিজাইন সিস্টেম।",
      overview:
        "ব্র্যান্ডের নিজস্বতা এবং সহজ ব্যবহারযোগ্যতার মেলবন্ধনে ওয়েব ও প্রোডাক্ট ইন্টারফেস ডিজাইন করা হয়—ওয়্যারফ্রেম ও হাই-ফিডেলিটি UI থেকে শুরু করে স্ট্র্যাটেজিক UX কনসাল্টিং পর্যন্ত।",
      timeline: "১–২ সপ্তাহ",
      startingBudget: "৳২০,০০০+",
      deliverables: [
        "ইউজার ফ্লো, আর্কিটেকচার ও ওয়্যারফ্রেম",
        "হাই-ফিডেলিটি ওয়েব এবং মোবাইল UI ডিজাইন",
        "ই-কমার্স স্টোরফ্রন্ট ও হিরো ব্যানার সিস্টেম",
        "রিইউজেবল কম্পোনেন্ট ও ডিজাইন সিস্টেম",
        "ইন্টারঅ্যাক্টিভ ক্লিকেবল প্রোটোটাইপ",
        "প্রোডাক্ট ইম্প্রুভমেন্ট ও UX কনসাল্টিং",
      ],
      process: [
        {
          title: "UX অডিট ও ইউজার ফ্লো",
          desc: "ইউজার জার্নি ম্যাপিং এবং মূল স্ক্রিনগুলোর বাধা চিহ্নিত করা।",
        },
        {
          title: "ওয়্যারফ্রেম ও লেআউট",
          desc: "ক্লিয়ার এবং কনভার্শন-ফোকাসড মিনিমালিস্ট লেআউট তৈরি।",
        },
        {
          title: "ভিজ্যুয়াল UI ও প্রোটোটাইপ",
          desc: "টাইপোগ্রাফি, রেসপন্সিভ ব্রেকপয়েন্ট ও ইন্টারঅ্যাকশন যুক্ত করা।",
        },
        {
          title: "ডেভেলপার হ্যান্ডঅফ",
          desc: "গোছানো কম্পোনেন্ট, টোকেন এবং অ্যাসেট সরবরাহ।",
        },
      ],
      highlights: [
        "Canvas — ই-কমার্স প্ল্যাটফর্মের UI ডিজাইন, হিরো ব্যানার ও UX কনসাল্টিং",
        "Antor Creative Studio — দ্বিভাষিক পোর্টফোলিও ও ইন্টারঅ্যাক্টিভ ক্যালকুলেটর ইন্টারফেস",
      ],
    },
  },
  {
    slug: "illustration",
    translationKey: "illustration",
    icon: "pen",
    tools: ["Procreate", "Adobe Illustrator", "Adobe Photoshop", "Digital & Traditional"],
    portfolioCategory: "creative",
    en: {
      title: "Illustration",
      shortDesc:
        "Simplifying complex concepts through engaging digital and vector illustrations.",
      tagline: "Digital, traditional, and educational illustrations that tell memorable stories.",
      overview:
        "Whether for e-learning books, awareness campaigns, editorial features, or character-driven brand assets, custom illustrations turn abstract or complex ideas into warm, engaging visuals.",
      timeline: "1–2 Weeks",
      startingBudget: "৳12,000+",
      deliverables: [
        "E-Learning & Children's Book Illustrations",
        "Custom Character & Mascot Design",
        "Editorial & Awareness Campaign Artwork",
        "Clean Vector Spot & Scene Illustrations",
        "Digital Painting & Traditional Media Art",
        "High-Resolution Print & Layered Files",
      ],
      process: [
        {
          title: "Brief & Visual Metaphor",
          desc: "Translating your script or educational concept into clear visual ideas.",
        },
        {
          title: "Rough Sketches",
          desc: "Exploring composition, character poses, and storytelling framing.",
        },
        {
          title: "Linework & Color",
          desc: "Refining illustration style, palette harmony, and expressive details.",
        },
        {
          title: "Final Exports",
          desc: "Delivering print-ready CMYK artwork, layered PSD/Procreate, or crisp vectors.",
        },
      ],
      highlights: [
        "Green Frame Illustration — Illustrated two e-learning books simplifying complex concepts",
        "Radiant Pharmaceuticals — Character illustrations & visual stories for Dengue awareness",
        "TIB Anti-Corruption Cartoon Competition 2025 — Special Mention Award (Digital Cartoon)",
      ],
    },
    bn: {
      title: "ইলাস্ট্রেশন",
      shortDesc:
        "ডিজিটাল এবং ভেক্টর ইলাস্ট্রেশনের মাধ্যমে জটিল বিষয়গুলোকে সহজ এবং আকর্ষণীয় করে উপস্থাপন করা।",
      tagline: "ডিজিটাল, ট্র্যাডিশনাল ও এডুকেশনাল ইলাস্ট্রেশনের মাধ্যমে গল্প বলা।",
      overview:
        "ই-লার্নিং বই, সচেতনতামূলক ক্যাম্পেইন, এডিটোরিয়াল কিংবা ব্র্যান্ডের ক্যারেক্টার ডিজাইন—কাস্টম ইলাস্ট্রেশন যেকোনো জটিল বিষয়কে সহজ ও দৃষ্টিনন্দন করে তোলে।",
      timeline: "১–২ সপ্তাহ",
      startingBudget: "৳১২,০০০+",
      deliverables: [
        "ই-লার্নিং ও শিশুতোষ বইয়ের ইলাস্ট্রেশন",
        "কাস্টম ক্যারেক্টার ও মাসকট ডিজাইন",
        "ক্যাম্পেইন ও এডিটোরিয়াল আর্টওয়ার্ক",
        "ক্লিন ভেক্টর ও সিন ইলাস্ট্রেশন",
        "ডিজিটাল পেইন্টিং ও ট্র্যাডিশনাল আর্ট",
        "হাই-রেজোলিউশন প্রিন্ট ও লেয়ার্ড ফাইল",
      ],
      process: [
        {
          title: "ব্রিফ ও কনসেপ্ট",
          desc: "গল্প বা শিক্ষামূলক বিষয়বস্তুকে সহজ ভিজ্যুয়াল আইডিয়ায় রূপান্তর।",
        },
        {
          title: "রাফ স্কেচ",
          desc: "কম্পোজিশন, ক্যারেক্টার পোজ এবং ফ্রেমিং পরীক্ষা করা।",
        },
        {
          title: "লাইনআর্ট ও কালারিং",
          desc: "নিখুঁত ডিটেইলিং, কালার হারমনি এবং টেক্সচার যুক্ত করা।",
        },
        {
          title: "ফাইনাল ডেলিভারি",
          desc: "প্রিন্ট-রেডি ফাইল এবং এডিটেবল ভেক্টর/লেয়ার্ড ফাইল সরবরাহ।",
        },
      ],
      highlights: [
        "Green Frame Illustration — দুটি ই-লার্নিং বইয়ের সম্পূর্ণ ইলাস্ট্রেশন তৈরি",
        "Radiant Pharmaceuticals — ডেঙ্গু সচেতনতামূলক ক্যাম্পেইনের ক্যারেক্টার ও ভিজ্যুয়াল স্টোরি",
        "TIB কার্টুন প্রতিযোগিতা ২০২৫ — স্পেশাল মেনশন অ্যাওয়ার্ড (ডিজিটাল কার্টুন)",
      ],
    },
  },
  {
    slug: "motion-design",
    translationKey: "motion",
    icon: "film",
    tools: ["Adobe After Effects", "Adobe Premiere Pro", "CapCut", "Adobe Illustrator"],
    portfolioCategory: "motion",
    en: {
      title: "Motion Design",
      shortDesc:
        "Bringing concepts to life through dynamic motion graphics for e-learning, campaigns, and digital media.",
      tagline: "Kinetic typography, e-learning motion, and dynamic visual explainers.",
      overview:
        "I craft crisp motion graphics that keep viewers engaged—from national-level ICT e-learning modules and social reels to logo reveals, product explainers, and campaign videos.",
      timeline: "1–3 Weeks",
      startingBudget: "৳20,000+",
      deliverables: [
        "E-Learning & Educational Motion Modules",
        "Kinetic Typography & Explainer Videos",
        "Logo Animations & Brand Intro Bumpers",
        "Social Media Reels & Ad Motion Graphics",
        "Lower Thirds, UI Motion & Broadcast Overlays",
        "Full HD / 4K Exports with Sound Sync",
      ],
      process: [
        {
          title: "Script & Pacing",
          desc: "Structuring the narrative beats, voiceover timing, and visual hierarchy.",
        },
        {
          title: "Styleframes & Assets",
          desc: "Designing crisp vector scenes and typography boards before animating.",
        },
        {
          title: "Animation & Compositing",
          desc: "Crafting smooth easing, transitions, and kinetic motion in After Effects.",
        },
        {
          title: "Sound & Final Render",
          desc: "Syncing audio/SFX and delivering optimized MP4/ProRes exports.",
        },
      ],
      highlights: [
        "DIKKHA (ICT Division) — Produced motion designs and visual assets for 30+ e-learning courses",
        "1st Animation Festival, DU — Motion assets and digital promotional collateral",
      ],
    },
    bn: {
      title: "মোশন ডিজাইন",
      shortDesc:
        "ই-লার্নিং এবং ডিজিটাল মিডিয়ার জন্য ডাইনামিক মোশন গ্রাফিক্সের মাধ্যমে আপনার ধারণাকে জীবন্ত করে তোলা।",
      tagline: "কাইনেটিক টাইপোগ্রাফি, ই-লার্নিং মোশন এবং ডাইনামিক এক্সপ্লেইনার ভিডিও।",
      overview:
        "জাতীয় পর্যায়ের ICT ই-লার্নিং কোর্স থেকে শুরু করে সোশ্যাল মিডিয়া রিলস, লোগো অ্যানিমেশন এবং প্রোডাক্ট এক্সপ্লেইনার—দর্শকের মনোযোগ ধরে রাখতে নিখুঁত মোশন গ্রাফিক্স তৈরি করা হয়।",
      timeline: "১–৩ সপ্তাহ",
      startingBudget: "৳২০,০০০+",
      deliverables: [
        "ই-লার্নিং ও এডুকেশনাল মোশন মডিউল",
        "কাইনেটিক টাইপোগ্রাফি ও এক্সপ্লেইনার ভিডিও",
        "লোগো অ্যানিমেশন ও ব্র্যান্ড ইন্ট্রো",
        "সোশ্যাল মিডিয়া রিলস ও অ্যাড মোশন গ্রাফিক্স",
        "ব্রডকাস্ট ওভারলে ও UI অ্যানিমেশন",
        "সাউন্ড সিঙ্কসহ ফুল HD / 4K এক্সপোর্ট",
      ],
      process: [
        {
          title: "স্ক্রিপ্ট ও পেসিং",
          desc: "গল্পের ধাপ, ভয়েসওভার টাইমিং এবং ভিজ্যুয়াল ফ্লো সাজানো।",
        },
        {
          title: "স্টাইলফ্রেম ও অ্যাসেট",
          desc: "অ্যানিমেশনের আগে মূল দৃশ্য ও ভেক্টর অ্যাসেট তৈরি করা।",
        },
        {
          title: "অ্যানিমেশন ও কম্পোজিটিং",
          desc: "After Effects-এ স্মুথ ইজিং, ট্রানজিশন এবং মোশন তৈরি।",
        },
        {
          title: "সাউন্ড ও ফাইনাল রেন্ডার",
          desc: "অডিও/SFX সিঙ্ক করে হাই-কোয়ালিটি MP4/ProRes ডেলিভারি।",
        },
      ],
      highlights: [
        "DIKKHA (ICT Division) — ৩০+ ই-লার্নিং কোর্সের মোশন ডিজাইন ও ভিজ্যুয়াল অ্যাসেট তৈরি",
        "১ম অ্যানিমেশন ফেস্টিভ্যাল, ঢাবি — মোশন অ্যাসেট ও ডিজিটাল প্রমোশনাল কনটেন্ট",
      ],
    },
  },
  {
    slug: "animation",
    translationKey: "animation",
    icon: "box",
    tools: ["Adobe Animate", "After Effects", "Blender", "Cinema 4D"],
    portfolioCategory: "animation3d",
    en: {
      title: "Animation",
      shortDesc:
        "Character design, storyboarding, and full-scale 2D/3D animations for storytelling and education.",
      tagline: "Narrative 2D/3D animation, storyboards, and character-driven series.",
      overview:
        "From television series and classic educational tales to 3D product visuals, I handle the entire animation pipeline—character design, background art, storyboarding, rigging, and final animation.",
      timeline: "2–6 Weeks",
      startingBudget: "৳25,000+",
      deliverables: [
        "Storyboards & Animatics for Series & Films",
        "2D Character Design, Rigging & Frame Animation",
        "Background Art & Scene Environments",
        "3D Product Renders & Motion Elements",
        "Broadcast & Educational Animated Stories",
        "Complete Video Mastering & Multi-Format Delivery",
      ],
      process: [
        {
          title: "Storyboarding & Animatic",
          desc: "Translating scripts into shot-by-shot visual boards and timing tests.",
        },
        {
          title: "Character & World Design",
          desc: "Designing expressive characters and atmospheric backgrounds.",
        },
        {
          title: "2D / 3D Production",
          desc: "Animating scenes cleanly in Adobe Animate, After Effects, Blender, or Cinema 4D.",
        },
        {
          title: "Compositing & Mastering",
          desc: "Lighting, color grading, sound design integration, and broadcast export.",
        },
      ],
      highlights: [
        "Action Aid Project (Deepto TV) — Storyboards, backgrounds & animation for 'Jhumur and Biva'",
        "Educational Animation — Character & background design for 'The Shepherd Boy and the Tiger' & 'Ants and Doves'",
        "Radiant Pharmaceuticals — Animated characters & stories for Dengue awareness campaigns",
      ],
    },
    bn: {
      title: "অ্যানিমেশন",
      shortDesc:
        "ক্যারেক্টার ডিজাইন, স্টোরিবোর্ডিং এবং স্টোরিটেলিংয়ের জন্য সম্পূর্ণ ২D/৩D অ্যানিমেশন।",
      tagline: "গল্পনির্ভর ২D/৩D অ্যানিমেশন, স্টোরিবোর্ড ও ক্যারেক্টার ডিজাইন।",
      overview:
        "টেলিভিশন সিরিজ ও ক্লাসিক এডুকেশনাল গল্প থেকে শুরু করে ৩D ভিজ্যুয়াল—ক্যারেক্টার ডিজাইন, ব্যাকগ্রাউন্ড আর্ট, স্টোরিবোর্ডিং ও পূর্ণাঙ্গ অ্যানিমেশনের পুরো পাইপলাইন পরিচালনা করা হয়।",
      timeline: "২–৬ সপ্তাহ",
      startingBudget: "৳২৫,০০০+",
      deliverables: [
        "সিরিজ ও ফিল্মের স্টোরিবোর্ড এবং অ্যানিমেটিক",
        "২D ক্যারেক্টার ডিজাইন, রিগিং ও অ্যানিমেশন",
        "ব্যাকগ্রাউন্ড আর্ট ও সিন এনভায়রনমেন্ট",
        "৩D প্রোডাক্ট রেন্ডার ও মোশন এলিমেন্ট",
        "টিভি ও এডুকেশনাল অ্যানিমেটেড স্টোরি",
        "মাস্টারিং ও মাল্টি-ফরম্যাট ভিডিও ডেলিভারি",
      ],
      process: [
        {
          title: "স্টোরিবোর্ড ও অ্যানিমেটিক",
          desc: "স্ক্রিপ্ট অনুযায়ী শট-বাই-শট ভিজ্যুয়াল বোর্ড ও টাইমিং তৈরি।",
        },
        {
          title: "ক্যারেক্টার ও ব্যাকগ্রাউন্ড",
          desc: "গল্পের উপযোগী ক্যারেক্টার এবং পরিবেশের ডিজাইন।",
        },
        {
          title: "২D / ৩D প্রোডাকশন",
          desc: "Adobe Animate, After Effects, Blender ও Cinema 4D-তে অ্যানিমেশন।",
        },
        {
          title: "কম্পোজিটিং ও মাস্টারিং",
          desc: "লাইটিং, কালার গ্রেডিং, সাউন্ড এবং ফাইনাল আউটপুট।",
        },
      ],
      highlights: [
        "Action Aid প্রজেক্ট (দীপ্ত টিভি) — 'ঝুমুর ও বিভা' সিরিজের স্টোরিবোর্ড, ব্যাকগ্রাউন্ড ও অ্যানিমেশন",
        "এডুকেশনাল অ্যানিমেশন — 'The Shepherd Boy and the Tiger' ও 'Ants and Doves'-এর ক্যারেক্টার ও ব্যাকগ্রাউন্ড",
        "Radiant Pharmaceuticals — ডেঙ্গু সচেতনতামূলক ক্যাম্পেইনের অ্যানিমেটেড ক্যারেক্টার ও গল্প",
      ],
    },
  },
  {
    slug: "creative-direction",
    translationKey: "creative",
    icon: "lightbulb",
    tools: ["Creative Strategy", "Art Direction", "Exhibition Curation", "Brand Systems"],
    portfolioCategory: "creative",
    en: {
      title: "Creative Direction",
      shortDesc:
        "Guiding visual narratives from concept to completion for exhibitions and national events.",
      tagline: "End-to-end visual leadership for exhibitions, festivals, and growing brands.",
      overview:
        "I lead multi-disciplinary visual initiatives from initial strategy through final execution—unifying branding, print collateral, digital campaigns, and physical spaces into one cohesive narrative.",
      timeline: "2–6 Weeks",
      startingBudget: "৳30,000+",
      deliverables: [
        "Comprehensive Creative Strategy & Art Direction",
        "Festival, Exhibition & Event Visual Identities",
        "Official Books, Catalogs & Curatorial Print Assets",
        "E-Commerce Brand Positioning & Campaign Concepts",
        "Cross-Team Design Supervision & Quality Control",
        "Launch Visual Guidelines & Promotional Kits",
      ],
      process: [
        {
          title: "Vision & Strategy",
          desc: "Aligning stakeholders around a clear creative thesis and audience experience.",
        },
        {
          title: "Visual Language",
          desc: "Establishing the core identity, key visuals, and art direction rules.",
        },
        {
          title: "Production Oversight",
          desc: "Directing print, digital, motion, and spatial touchpoints consistently.",
        },
        {
          title: "Exhibition & Launch",
          desc: "Final proofing, curation review, and rollout across every medium.",
        },
      ],
      highlights: [
        "Canvas — Creative Head leading all visual design, packaging & branding strategy",
        "Gallery Hamiduzzaman — Creative Manager & Brand Strategist for exhibitions",
        "Fine Arts Admission Support Workshop — Creative Lead & official Workshop Book designer",
        "1st Animation Festival, Faculty of Fine Arts (DU) — Lead Branding Designer",
      ],
    },
    bn: {
      title: "ক্রিয়েটিভ ডিরেকশন",
      shortDesc:
        "এক্সিবিশন বা ইভেন্টের ভিজ্যুয়াল ন্যারেটিভ তৈরি থেকে শুরু করে সফল বাস্তবায়ন পর্যন্ত পরিচালনা করা।",
      tagline: "এক্সিবিশন, ফেস্টিভ্যাল ও ব্র্যান্ডের সামগ্রিক ভিজ্যুয়াল নেতৃত্ব।",
      overview:
        "প্রাথমিক পরিকল্পনা থেকে চূড়ান্ত বাস্তবায়ন পর্যন্ত পুরো ভিজ্যুয়াল ক্যাম্পেইন, ব্র্যান্ডিং, প্রিন্ট ম্যাটেরিয়াল ও ডিজিটাল মাধ্যমকে একটি একক ও শক্তিশালী ন্যারেটিভে যুক্ত করা হয়।",
      timeline: "২–৬ সপ্তাহ",
      startingBudget: "৳৩০,০০০+",
      deliverables: [
        "সামগ্রিক ক্রিয়েটিভ স্ট্র্যাটেজি ও আর্ট ডিরেকশন",
        "ফেস্টিভ্যাল, এক্সিবিশন ও ইভেন্ট ভিজ্যুয়াল আইডেন্টিটি",
        "অফিসিয়াল বুক, ক্যাটালগ ও কিউরেটোরিয়াল প্রিন্ট",
        "ব্র্যান্ড পজিশনিং ও ক্যাম্পেইন কনসেপ্ট",
        "ক্রস-টিম ডিজাইন তদারকি ও কোয়ালিটি কন্ট্রোল",
        "লঞ্চ ভিজ্যুয়াল গাইডলাইন ও প্রমোশনাল কিট",
      ],
      process: [
        {
          title: "ভিশন ও স্ট্র্যাটেজি",
          desc: "ইভেন্ট বা ব্র্যান্ডের মূল উদ্দেশ্য ও দর্শক অভিজ্ঞতা নির্ধারণ।",
        },
        {
          title: "ভিজ্যুয়াল ল্যাঙ্গুয়েজ",
          desc: "মূল আইডেন্টিটি, কি-ভিজ্যুয়াল এবং আর্ট ডিরেকশন গাইড তৈরি।",
        },
        {
          title: "প্রোডাকশন পরিচালনা",
          desc: "প্রিন্ট, ডিজিটাল, মোশন এবং এক্সিবিশন মাধ্যমের সমন্বয়।",
        },
        {
          title: "লঞ্চ ও কিউরেশন",
          desc: "চূড়ান্ত প্রুফিং এবং সব মাধ্যমে নিখুঁত উপস্থাপন।",
        },
      ],
      highlights: [
        "Canvas — ক্রিয়েটিভ হেড হিসেবে ভিজ্যুয়াল ডিজাইন ও ব্র্যান্ডিং স্ট্র্যাটেজি পরিচালনা",
        "গ্যালারি হামিদুজ্জামান — প্রদর্শনীর ক্রিয়েটিভ ম্যানেজার ও ব্র্যান্ড স্ট্র্যাটেজিস্ট",
        "ফাইন আর্টস অ্যাডমিশন সাপোর্ট ওয়ার্কশপ — ক্রিয়েটিভ লিড ও অফিসিয়াল বুক ডিজাইনার",
        "১ম অ্যানিমেশন ফেস্টিভ্যাল, চারুকলা অনুষদ (ঢাবি) — লিড ব্র্যান্ডিং ডিজাইনার",
      ],
    },
  },
];

export function getExpertiseBySlug(slug: string): ExpertiseItem | undefined {
  return EXPERTISE_LIST.find((item) => item.slug === slug);
}
