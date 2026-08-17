export interface ServicePackage {
  id: string;
  name: string;
  nameBn: string;
  category: 'web_dev' | 'ui_ux' | '3d_design' | 'ai_automation' | 'branding';
  basePriceBDT: number;
  basePriceUSD: number;
  estimatedDays: string;
  description: string;
  features: string[];
}

export const AGENCY_KNOWLEDGE = {
  agencyName: "Antor Creative Studio",
  founder: "Antor Kumar Biswas",
  tagline: "Crafting High-Performance Web Apps, Dynamic 3D Experiences & Custom AI Agents",
  supportedLanguages: ["Bangla", "English", "Banglish (Bengali in Latin script)"],
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "antor@antorcreativestudio.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+880 1793-157956",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "+880 1793-157956",
    location: "Dhaka, Bangladesh (Serving Clients Worldwide)",
  },
  services: [
    {
      id: "web_landing",
      name: "Landing Page / Business Showcase",
      nameBn: "ল্যান্ডিং পেজ / ওয়েবসাইট",
      category: "web_dev",
      basePriceBDT: 18000,
      basePriceUSD: 180,
      estimatedDays: "3-5 days",
      description: "Modern, high-converting responsive landing page with glassmorphic aesthetic & SEO optimization.",
      features: [
        "Modern Glassmorphism / Dark Mode Design",
        "Mobile & Tablet Responsive",
        "Contact Form & WhatsApp Integration",
        "Fast Page Load & SEO Ready"
      ]
    },
    {
      id: "web_ecommerce",
      name: "E-Commerce / Online Store",
      nameBn: "ই-কমার্স ওয়েবসাইট",
      category: "web_dev",
      basePriceBDT: 45000,
      basePriceUSD: 450,
      estimatedDays: "10-15 days",
      description: "Full-featured online store with payment gateway (bKash/Nagad/SSLCommerz/Stripe), product dashboard & order management.",
      features: [
        "Product Catalog & Category Filtering",
        "Cart & Checkout System",
        "Payment Gateway Integration (bKash, Nagad, Cards)",
        "Admin Dashboard for Inventory & Orders"
      ]
    },
    {
      id: "web_custom_app",
      name: "Custom Full-Stack Web Application / SaaS",
      nameBn: "কাস্টম ওয়েভ অ্যাপ / স্যাস (SaaS)",
      category: "web_dev",
      basePriceBDT: 65000,
      basePriceUSD: 650,
      estimatedDays: "14-25 days",
      description: "Tailor-made web app built with Next.js, PostgreSQL, Authentication, and custom logic.",
      features: [
        "User Auth & Role Management",
        "Custom Database Schema & API Routes",
        "Real-Time Dashboard & Analytics",
        "Scalable Cloud Deployment"
      ]
    },
    {
      id: "ui_ux_design",
      name: "UI/UX & Product Design (Figma)",
      nameBn: "ইউআই/ ইউএক্স ও প্রোডাক্ট ডিজাইন",
      category: "ui_ux",
      basePriceBDT: 20000,
      basePriceUSD: 200,
      estimatedDays: "4-8 days",
      description: "User-centric UI/UX design with interactive Figma prototypes, wireframes, and design systems.",
      features: [
        "Figma Interactive Prototype",
        "Desktop & Mobile Layouts",
        "Design System & Components Library",
        "Developer-Ready Asset Handoff"
      ]
    },
    {
      id: "ai_agent_custom",
      name: "Custom AI Agent & Chatbot Integration",
      nameBn: "কাস্টম এআই এজেন্ট ও চ্যাটবট",
      category: "ai_automation",
      basePriceBDT: 35000,
      basePriceUSD: 350,
      estimatedDays: "5-10 days",
      description: "Autonomous Agentic AI connected to Facebook Messenger, WhatsApp, or Website Chat widget.",
      features: [
        "Multilingual Auto-Responder (Bangla/English/Banglish)",
        "Facebook Messenger & Web Integration",
        "Custom Knowledge Base Training",
        "Automated Lead & Order Capture"
      ]
    },
    {
      id: "3d_branding",
      name: "3D Motion Design & Visual Branding",
      nameBn: "৩ডি ব্র্যান্ডিং ও থ্রিডি আর্ট",
      category: "3d_design",
      basePriceBDT: 25000,
      basePriceUSD: 250,
      estimatedDays: "5-10 days",
      description: "Stunning Three.js 3D web graphics, 3D product renders, and brand logo animation.",
      features: [
        "Web-Interactive 3D Elements (Three.js/Fiber)",
        "High-Resolution 3D Product Renders",
        "Motion Design & Logo Animation"
      ]
    }
  ] as ServicePackage[]
};
