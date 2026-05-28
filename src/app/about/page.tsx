"use client";

import { motion } from "framer-motion";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { ArrowDown, Award, BookOpen, Briefcase, GraduationCap, Star, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <main className="relative min-h-screen bg-background overflow-hidden text-foreground pb-32">
      <ParticleBackground />

      <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-32 px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center max-w-5xl"
        >
          <div className="mb-8">
            <img 
              src="/placeholder-avatar.jpg" // Placeholder if they don't have one, or they can replace it.
              alt="Antor Kumar Biswas" 
              className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto object-cover border-4 border-brand-red/20 shadow-2xl shadow-brand-red/10"
              onError={(e) => {
                e.currentTarget.src = "https://ui-avatars.com/api/?name=Antor+Kumar+Biswas&background=ff0000&color=fff";
              }}
            />
          </div>
          <h1 className="text-4xl md:text-[6vw] font-black tracking-tighter uppercase mb-4 leading-none text-foreground">
            {lang === 'bn' ? 'অন্তর কুমার বিশ্বাস' : 'Antor Kumar Biswas'}
          </h1>
          <h2 className="text-xl md:text-3xl font-serif text-brand-red mb-8">
            {lang === 'bn' ? 'ভিজ্যুয়াল কমিউনিকেটর | ক্রিয়েটিভ লিডার | অ্যানিমেটর' : 'Visual Communicator | Creative Lead | Animator'}
          </h2>
          <p className="text-lg md:text-2xl text-muted font-light leading-relaxed max-w-3xl mx-auto">
            {lang === 'bn' 
              ? 'আমি একজন ভিজ্যুয়াল কমিউনিকেটর, মূলত এডুকেশনাল কনটেন্ট, ই-লার্নিং অ্যানিমেশন এবং ব্র্যান্ডিং নিয়ে কাজ করি। ঢাকা বিশ্ববিদ্যালয়ের গ্রাফিক ডিজাইন বিভাগের ৪র্থ বর্ষের ছাত্র হিসেবে, আমি সৃজনশীলতার সাথে উদ্দেশ্যের মেলবন্ধন ঘটাতে ভালোবাসি—তা সে এক্সিবিশন ডিজাইন হোক বা জাতীয় পর্যায়ের অ্যানিমেশন সিরিজ তৈরি।' 
              : 'Visual communicator with a strong background in graphic design, illustration, and animation. Currently a 4th-year student of Graphic Design at the University of Dhaka. I specialize in creating engaging educational content, e-learning visuals, and branding for large-scale creative events.'}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4 hoverable cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">{lang === 'bn' ? 'বিস্তারিত' : 'Explore'}</span>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-16 bg-gradient-to-b from-brand-red to-transparent"
          />
          <ArrowDown size={14} className="text-brand-red" />
        </motion.div>
      </section>

      {/* Skills & Competencies */}
      <section className="py-24 px-6 md:px-12 relative z-10 bg-surface/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3"><Star className="text-brand-red"/> {lang === 'bn' ? 'কোর স্কিলস' : 'Core Competencies'}</h3>
              <div className="flex flex-wrap gap-4">
                {['Graphic Design', 'Motion Design', 'Animation', 'Illustration', 'Artificial Intelligence'].map((skill) => (
                  <span key={skill} className="px-6 py-3 bg-background border border-border rounded-full text-foreground font-medium shadow-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3"><Zap className="text-brand-red"/> {lang === 'bn' ? 'সফটওয়্যার পারদর্শিতা' : 'Software Expertise'}</h3>
              <div className="space-y-4">
                {[
                  { name: 'Adobe Illustrator', val: 95 },
                  { name: 'Adobe AfterEffects', val: 90 },
                  { name: 'Adobe Premiere Pro', val: 85 },
                  { name: 'Adobe Photoshop', val: 80 },
                  { name: 'Adobe Animate', val: 90 },
                  { name: 'Procreate', val: 85 }
                ].map((software) => (
                  <div key={software.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-muted">{software.name}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${software.val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-brand-red h-2 rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Leadership */}
      <section className="py-24 px-6 md:px-12 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-16 flex items-center gap-4"><Briefcase className="text-brand-red w-10 h-10"/> {lang === 'bn' ? 'ক্রিয়েটিভ লিডারশিপ এবং প্রজেক্টস' : 'Creative Leadership & Projects'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface border border-border p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-2">Fine Arts Admission Support Workshop</h3>
              <p className="text-brand-red text-sm font-bold uppercase tracking-wider mb-4">Creative Lead & Branding Designer</p>
              <ul className="text-muted text-sm space-y-3 list-disc list-inside">
                <li>{lang === 'bn' ? 'ওয়ার্কশপের ভিজ্যুয়াল স্ট্র্যাটেজি এবং আইডেন্টিটির নেতৃত্ব প্রদান।' : 'Spearheaded the visual strategy and identity for the entire workshop.'}</li>
                <li>{lang === 'bn' ? 'অফিসিয়াল ওয়ার্কশপ বুক ডিজাইন এবং লেআউট।' : 'Designed and laid out the official Workshop Book.'}</li>
                <li>{lang === 'bn' ? 'পোস্টার এবং ডিজিটাল অ্যাসেট সহ সকল ব্র্যান্ডিং ম্যাটেরিয়ালস ম্যানেজমেন্ট।' : 'Managed all branding materials, including posters and digital assets.'}</li>
              </ul>
            </div>
            <div className="bg-surface border border-border p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-2">Gallery Hamiduzzaman</h3>
              <p className="text-brand-red text-sm font-bold uppercase tracking-wider mb-4">Creative Manager & Brand Strategist</p>
              <ul className="text-muted text-sm space-y-3 list-disc list-inside">
                <li>{lang === 'bn' ? 'এক্সিবিশনের সম্পূর্ণ ক্রিয়েটিভ ম্যানেজমেন্ট পরিচালনা।' : 'Directed complete Creative Management for an exhibition.'}</li>
                <li>{lang === 'bn' ? 'গ্যালারির প্রফেশনাল ইমেজ বজায় রাখার জন্য সামগ্রিক ব্র্যান্ডিং তৈরি।' : 'Developed comprehensive branding materials ensuring professional image.'}</li>
              </ul>
            </div>
            <div className="bg-surface border border-border p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-2">1st Animation Festival, Faculty of Fine Arts (DU)</h3>
              <p className="text-brand-red text-sm font-bold uppercase tracking-wider mb-4">Lead Branding Designer</p>
              <ul className="text-muted text-sm space-y-3 list-disc list-inside">
                <li>{lang === 'bn' ? 'ফেস্টিভ্যালের লোগো এবং প্রোমোশনাল পোস্টার সহ ইউনিক ভিজ্যুয়াল আইডেন্টিটি তৈরি।' : 'Created the unique visual identity, official logo, and promotional posters.'}</li>
                <li>{lang === 'bn' ? 'মোশন অ্যাসেট এবং ডিজিটাল কনটেন্ট ডেভেলপমেন্ট।' : 'Developed motion assets and digital collateral.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education, Awards, Workshops */}
      <section className="py-24 px-6 md:px-12 relative z-10 bg-surface/30 border-y border-border/50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3"><GraduationCap className="text-brand-red"/> {lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}</h3>
            <div className="space-y-6">
              <div className="border-l-2 border-brand-red pl-4">
                <h4 className="font-bold text-lg">Bachelor of Fine Art (BFA) in Graphic Design</h4>
                <p className="text-brand-red text-sm mb-2">University of Dhaka</p>
              </div>
              <div className="border-l-2 border-border pl-4">
                <h4 className="font-bold">Higher Secondary Certificate (HSC)</h4>
                <p className="text-muted text-sm mb-1">Biharilal Shikdar GOVT. College</p>
                <p className="text-xs text-muted/70">Group: Humanities | 2021</p>
              </div>
              <div className="border-l-2 border-border pl-4">
                <h4 className="font-bold">Secondary School Certificate (SSC)</h4>
                <p className="text-muted text-sm mb-1">Singra Tilkhari Secondary School</p>
                <p className="text-xs text-muted/70">Group: Humanities | 2019</p>
              </div>
            </div>
          </div>

          {/* Awards & Exhibitions */}
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3"><Award className="text-brand-red"/> {lang === 'bn' ? 'অ্যাওয়ার্ডস ও এক্সিবিশন' : 'Awards & Exhibitions'}</h3>
            <div className="space-y-6">
              <div className="bg-background border border-border p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-red/10 rounded-bl-full" />
                <h4 className="font-bold text-lg mb-1 text-brand-red">Qayyum Chowdhury Memorial Award</h4>
                <p className="text-sm text-muted">Graphic Design Department Annual Exhibition, University of Dhaka (2025)</p>
              </div>
              <div className="bg-background border border-border p-5 rounded-2xl relative overflow-hidden">
                <h4 className="font-bold text-lg mb-1 text-brand-red">Special Mention Award (Digital Cartoon)</h4>
                <p className="text-sm text-muted">20th Anti-Corruption Cartoon Competition (TIB) (2025)</p>
              </div>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>Miniature Art Exhibition 2025 (Ronger Gari)</li>
                <li>Graphic Design Dept. Annual Exhibition 2024</li>
              </ul>
            </div>
          </div>

          {/* Workshops & Training */}
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3"><BookOpen className="text-brand-red"/> {lang === 'bn' ? 'ট্রেনিং ও ওয়ার্কশপ' : 'Workshops & Training'}</h3>
            <div className="space-y-6">
              <div className="border-l-2 border-brand-red pl-4">
                <h4 className="font-bold text-lg">2D Animation Course</h4>
                <p className="text-muted text-sm">Grameenphone Academy</p>
              </div>
              <div className="border-l-2 border-brand-red pl-4">
                <h4 className="font-bold text-lg">Filmmaking Workshop</h4>
                <p className="text-muted text-sm">Academy of Creative Profession</p>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4">{lang === 'bn' ? 'পার্সোনাল স্কিলস' : 'Personal Skills'}</h3>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>Exceptional verbal and written communication.</li>
                <li>Highly self-motivated quick learner.</li>
                <li>Proven leadership & collaborative problem-solving.</li>
                <li>Ability to deliver high-quality results under pressure.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
