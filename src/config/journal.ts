export type JournalCategory = "Journey" | "Thoughts" | "Process" | "Milestone";

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  category: JournalCategory;
  mood: string;
  date: string;
  isoDate: string;
  excerpt: string;
  content: string;
  image: string;
  featured: boolean;
  likes: number;
}

export const JOURNAL_CATEGORIES: { id: "All" | JournalCategory; labelEn: string; labelBn: string }[] = [
  { id: "All", labelEn: "All Entries", labelBn: "সব লেখা" },
  { id: "Journey", labelEn: "My Journey", labelBn: "আমার যাত্রা" },
  { id: "Thoughts", labelEn: "Thoughts", labelBn: "ভাবনা" },
  { id: "Process", labelEn: "Creative Process", labelBn: "কাজের প্রক্রিয়া" },
  { id: "Milestone", labelEn: "Milestones", labelBn: "অর্জন" },
];

export const COVER_PRESETS = [
  {
    label: "Studio Desk",
    url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1800&auto=format&fit=crop",
  },
  {
    label: "Animation & Motion",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1800&auto=format&fit=crop",
  },
  {
    label: "Editorial Sketch",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1800&auto=format&fit=crop",
  },
  {
    label: "Visual Art",
    url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1800&auto=format&fit=crop",
  },
];

export function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return base || `entry-${Date.now()}`;
}

export const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j-canvas-creative-head",
    slug: "stepping-into-creative-head-at-canvas",
    title: "Stepping Into Creative Direction: Packaging, Strategy & Brand Voice",
    category: "Journey",
    mood: "Creative Leadership",
    date: "May 2026",
    isoDate: "2026-05-15",
    excerpt:
      "How transitioning from solo visual designer to Creative Head at Canvas reshaped the way I think about packaging, e-commerce storytelling, and cohesive product experiences.",
    content: `Design becomes far more exciting when every touchpoint speaks the same visual language. Leading creative direction at Canvas has been a huge turning point in my journey—moving beyond isolated graphics to shaping an entire art materials brand.\n\nFrom crafting physical packaging dielines that feel tactile on a shelf to designing e-commerce hero banners that convert online visitors, the challenge is always balancing beauty with clarity.\n\n> Great branding is never just decoration—it is how a customer feels the moment they unbox your product or land on your homepage.\n\nEvery day brings new lessons in strategic consulting, team collaboration, and staying true to minimalist, purposeful design even under tight launch deadlines.`,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1800&auto=format&fit=crop",
    featured: true,
    likes: 24,
  },
  {
    id: "j-du-fine-arts-journey",
    slug: "from-magura-to-faculty-of-fine-arts-du",
    title: "From Magura to Charukola: Finding My Voice in Graphic Design",
    category: "Journey",
    mood: "Personal Story",
    date: "Feb 2026",
    isoDate: "2026-02-10",
    excerpt:
      "Reflections on growing up in Shalikha, Magura, stepping onto the University of Dhaka campus, and discovering how traditional sketching feeds digital animation.",
    content: `Before After Effects timelines, Figma frames, or vector bezier curves, everything started with pencils, sketchbooks, and curiosity back home in Shalikha, Magura.\n\nJoining the Faculty of Fine Arts at the University of Dhaka (Jagannath Hall) surrounded me with artists who challenged how I observe light, composition, and human expression. Academic life taught me patience—that strong fundamentals in drawing and layout make every digital tool infinitely more powerful.\n\nWhether curating an exhibition at Gallery Hamiduzzaman or designing the Fine Arts Admission Support Workshop book, Charukola taught me that art and practical communication belong together.`,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1800&auto=format&fit=crop",
    featured: false,
    likes: 31,
  },
  {
    id: "j-dikkha-deepto-animation",
    slug: "storytelling-through-30-elearning-courses-and-deepto-tv",
    title: "What Animating 30+ E-Learning Courses & a TV Series Taught Me",
    category: "Process",
    mood: "Motion & Story",
    date: "Nov 2025",
    isoDate: "2025-11-20",
    excerpt:
      "Behind the scenes of building storyboards for Deepto TV's 'Jhumur and Biva' and pacing visual assets for national ICT Division (DIKKHA) courses.",
    content: `Educational animation has a very specific discipline: if a frame is visually noisy, the learner loses the concept. During my time as an Animator at Communion Media Agency, I worked across two very different worlds—broadcast storytelling for Deepto TV ('Jhumur and Biva') and structured instructional motion for 30+ DIKKHA (ICT Division) courses.\n\nFor classic tales like 'The Shepherd Boy and the Tiger' and 'Ants and Doves', character silhouette and background mood carried the emotion. For Dengue awareness with Radiant Pharmaceuticals and e-learning books with Green Frame, clarity and empathy came first.\n\n> Simplicity is the hardest part of animation. Every keyframe should earn its place on screen.`,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1800&auto=format&fit=crop",
    featured: false,
    likes: 19,
  },
  {
    id: "j-awards-2025-milestone",
    slug: "qayyum-chowdhury-memorial-award-and-tib-honor",
    title: "Honored at Annual Exhibition & TIB 2025: Why Honest Art Matters",
    category: "Milestone",
    mood: "Gratitude",
    date: "Aug 2025",
    isoDate: "2025-08-18",
    excerpt:
      "Receiving the Qayyum Chowdhury Memorial Award at DU and a Special Mention from Transparency International Bangladesh reminded me why visual art can spark dialogue.",
    content: `2025 brought two moments I will always carry with me—receiving the Qayyum Chowdhury Memorial Award at the Graphic Design Department Annual Exhibition, and earning a Special Mention Award in Digital Cartoon at the 20th Anti-Corruption Cartoon Competition (TIB).\n\nBoth experiences reminded me that visual communication is not only for commercial brands. A single illustration or editorial cartoon can question injustice, simplify truth, and stay in someone's memory for years.`,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1800&auto=format&fit=crop",
    featured: false,
    likes: 27,
  },
  {
    id: "j-thoughts-minimalist-storytelling",
    slug: "why-minimalist-layout-wins-attention",
    title: "Thoughts on Minimalist Layouts in an Overwhelmed Feed",
    category: "Thoughts",
    mood: "Design Philosophy",
    date: "Jun 2025",
    isoDate: "2025-06-05",
    excerpt:
      "When every brand shouts louder with gradients and clutter, quiet typography, generous whitespace, and intentional motion stand out effortlessly.",
    content: `Scroll through any social feed today and you immediately notice visual fatigue—too many competing badges, crowded posters, and rushed layouts.\n\nIn my recent work across Hotel Okada catalogs and climate workshop materials for CCJ-B, I noticed something consistent: whenever we stripped away unnecessary ornament and gave the core message room to breathe, engagement and readability jumped immediately.\n\nMinimalism isn't emptiness; it's discipline. It means caring enough about the reader to remove everything that doesn't serve the story.`,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1800&auto=format&fit=crop",
    featured: false,
    likes: 16,
  },
];
