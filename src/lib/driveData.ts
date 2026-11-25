export interface DriveVideoItem {
  id: string;
  title: string;
  embedUrl: string;
  thumbnailUrl: string;
  viewUrl: string;
}

export interface DriveShowcaseProject {
  id: string;
  title: string;
  slug: string;
  image: string;
  year: string;
  catId: string;
  role: string;
  client: string;
  overview: string;
  tools: string[];
  deliverables: string[];
  results: Array<{ label: string; value: string }>;
  gallery: string[];
  videos?: DriveVideoItem[];
  pdfPreviewUrl?: string;
  liveLink: string;
  source: "drive";
}

export const DRIVE_ROOT_FOLDER_URL =
  "https://drive.google.com/drive/folders/11gnUtx_ekf8B67Fuxs4-FK31roBToq6C";

export const driveThumb = (id: string, width = 1200): string =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

export const drivePreview = (id: string): string =>
  `https://drive.google.com/file/d/${id}/preview`;

export const driveView = (id: string): string =>
  `https://drive.google.com/file/d/${id}/view`;

export const driveFolder = (id: string): string =>
  `https://drive.google.com/drive/folders/${id}`;

function buildVideoItems(items: ReadonlyArray<{ id: string; title: string }>): DriveVideoItem[] {
  return items.map(({ id, title }) => ({
    id,
    title,
    embedUrl: drivePreview(id),
    thumbnailUrl: driveThumb(id),
    viewUrl: driveView(id),
  }));
}

// 1. Mont Marte Branding (10 Brand Assets)
const montMarteIds = [
  "1a_GfrxX_Vnv371GsXl3RUHfIQvYQXlID",
  "1dnP1CGz896yfO53NqpyYk_ldG136b8wO",
  "1fF6inYuHeTp9SQYw4SFpu53NhPefC-0C",
  "1WnavuepjiliFz1ER_chfVR-J3tlTljf1",
  "1dHaQUVsr2-WBQxzeWV__Ed-FImNPNup3",
  "1V__IRQMgxIguQiLnImWhU0oj5QLqg-fd",
  "1vxBu_MhmkIjyxJwNSZ8phr0XrAtxoGCs",
  "1qDOdCO08kp0cY7JFadYfe8J4dMI3HKa6",
  "1mmqU0mawcDJFFFg__QBGLyKVsMBZx5XE",
  "1WafpdoGgTF37IQP9om-qbtoQ1Y9dl36O",
] as const;

// 2. Motion And Animation (14 Showreel & Motion Videos)
const motionVideoItems: ReadonlyArray<{ id: string; title: string }> = [
  { id: "1gSwbPJGmPDtsgtecR041WWrLUTxY2r5a", title: "Cinema 4D 3D Product Render" },
  { id: "1W3OY7nP_y0eU9PfxnD2Fn7Id7CFA65s8", title: "Brand Motion Presentation" },
  { id: "1U7s47ny7RC3qeYZAzD1nRQ5Sgy3nNSGd", title: "Gen Z Crow Character Animation" },
  { id: "1aOoCeRGKJPKOng0-X53zIp5F_XKG4Gv1", title: "Frame-by-Frame Stop Motion" },
  { id: "1J5kFI1H5_EKQ7gcn97ekIaefWOExmtlv", title: "21st February Tribute Motion" },
  { id: "12Q74VJyfhhMgHWDdwq6V6wxN8hM1tG1d", title: "Social Reel Motion Cut" },
  { id: "17lBvfzkmGzMlp1EGhAeP4NWmV4bKB_xu", title: "Commercial Motion Promo" },
  { id: "1LsTqZ-3FTq1gYKCoiN8oGmnUDz0pWVcj", title: "Brand Kinetic Reel #1" },
  { id: "12Ly6CdGtmIoEeQ4nTPkH6z0YARpXoE2A", title: "Brand Kinetic Reel #2" },
  { id: "1mpy7p6-w_MFAkVyNGtaPazte8EXFXH8A", title: "Motion Graphics Showcase #3" },
  { id: "10qmYNa4HOtGAWlOKt9wHO7cYGbrUHizI", title: "3D Motion Sequence #4" },
  { id: "1Tbptp1Zi1RV7xMNrFDOdznDHz-6DGx7K", title: "Visual Storytelling Clip #5" },
  { id: "1h4m6pfiHt0bx2cYtZFEIsn1FaVNgZE18", title: "Dynamic Edit Reel #6" },
  { id: "13QsOys-YKdNHGSmPsW09Be1YzaAGwwLi", title: "Animation Study #7" },
];

// 3. AI Animation (4 Educational & Storytelling Shorts)
const aiAnimationVideoItems: ReadonlyArray<{ id: string; title: string }> = [
  { id: "1M5q5wZX4cgv0WL58YvUkRJVitRacYJ5i", title: "The Lion & The Mouse — Narrative Animation" },
  { id: "1BAUv9fnF0PbEVN4YsmLcKSB1L6-fmqCJ", title: "Funny Fruit Dance Song — Kids Animation" },
  { id: "1hhZB5SVO42TCF6KDCDEMYfza-gt_yF0y", title: "123 Number Learning (Bengali EdTech)" },
  { id: "1cfZc2Q_zblie49NSk5o2hVCAGTevJibK", title: "Color Learning Educational Short" },
];

// 4. Cartoon & Illustration (28 Original Artworks)
const cartoonIllustrationIds = [
  "1hfN4sRcfLzDhDMLne6lYL2ZLAP1w1N_8",
  "1EmIhenpP92J-A-ciKo6_aeYQr-ZUNYjE",
  "1mFAHVUUmNqe4x02TXN1AAJMdykMzlDBg",
  "1PwOQP0o2qGTF9MWzOv8mr8c47gAW12dB",
  "1eh_eMvluU-AqmZDoVJ-1pI07jqox44gz",
  "13M8H4RMNSycqeTKmp5oVamDmoORP2pB2",
  "1MlSc_9RHSl7VDdOwmXhXfRXvs_Wkptwl",
  "1BqcqMswWiL9VWicC3M_LqK7mg9_FPRbh",
  "19KtGyRD4sbWAB7WUYNxG1EbOXSomATVb",
  "1Z2mJbPtBu6IO7jPc-XTgIb7r4vs_Uu36",
  "1oXxeW2Pmrtk9CEd_kr6kdOfIzhm12X4n",
  "1h0llFs-IKPwKFLxXmWGNbxgL5_CtQFKq",
  "1lI2PRfhV8oQzb0lvghdT69zFf6XINKW4",
  "1U01pa4tQXoacZMFXLFU0P5gecqrIAEBL",
  "17-4jDcLNqgkfF0VhXnoFUA8wvKewOJ0K",
  "1oCnl_jNlzu1lzP930zjLsh0KAYnJif8z",
  "1tQAo1MvfIfiJJ3Jdi258cx_l0QsnjQHB",
  "1S04O5Oro8-Jv9xsjiH8TctBSmTBim_Iz",
  "1VR8tbbR8D-ewkuZxBtL-QlJ7UfspK4Vq",
  "12xPhYL9SvBhHSg7GmsX6qxxEeEyH6G9M",
  "1FLSzJxhDNNYv8UkxLwxuynAmRhfmKRDC",
  "1vxZXBdLRfrNnoTudN7_ujjb5Xh0QTaIY",
  "1wU7Kd984c2KwPx3XwAWNSFTOFMw-ydmA",
  "1aw78T60tkrUbn3NrbbDJF6sGM5mLdq13",
  "1nqfgn8SL8DQNKcRbkGRbIAL8lmW8gX_s",
  "1QyQ42vT8zGQqXtSKxoVDwj-w_xEfeqzi",
  "1fm1s0P4JuUGPt8j-0OjB-lXunKkv9dFd",
  "192VyVxfQidoE5DKRKBEFFkZRjm8SJfhn",
] as const;

// 5. Social Media Post Design (43 Raster Creatives — excluding source .psd file)
export const driveImageIds = [
  "1PSRF_9XfyUdl6hWUW7-07qM5Z0Y1Q1Tx",
  "1GwTT_Ii3ceu-5rU5NRxjwbz5YY922l47",
  "1mV3xixceHXpYhUaLuEGCEMxDrPHdChHP",
  "1Tx_--2xj3UhfZC9G4m-3AFZtOU7muurR",
  "1MynHMZf9MMBzRsOalhdBO_6RxwFHrr--",
  "12YSNUD9WDf9uqdMx7n_YiyZBVxFQby7-",
  "11dwtwybJKkUkzpGpZJpIr3ut2zoIrECu",
  "1vgt79EFE0IM32lF1a2AGy9VmDE0dFrFa",
  "1nDQjw34LSO4okF_aY8ipSb6BDjzQDL_H",
  "1QPFa0eunZqTXvGa15ranrg_YCHFtWkhQ",
  "1fA-J3bo01g3_OwpxXsRqnXwMjJL20j7K",
  "1BKfWbysoFyTTtAh1x88KRxG7nCI0PnLN",
  "15yTgI2MLuSvhrXVpegmYVhj5cIP0-WK-",
  "1dpnYfTHY4H7-N_E6clPcMpOSxQqB7PKN",
  "1EpmZUK2FwMWyvyhsIZ90rLsYLT_HpmcV",
  "1Fyjwnd8SmyB7ru0y_wdeUB4AyKpFGgWj",
  "18Hb4Xw5G4auTtLroAWr-chSynNzez621",
  "11VWagkPMtnskQ_q9h3G7vx_aTScpyCxT",
  "1dvmtjbSEKbUVta3GiNf_0b7-lA4Zpo-s",
  "19IgQeFkh2Be9-5kJOS3FHXu30tWHmdFW",
  "1OxHjyi6ScJ3w4qzD6tomEbKqR7XMcSzD",
  "1MKIPI-x3dPeZlzuQgBytqT_KzpIAC2Ik",
  "1p_aFNRsJfK-g1mVATGLRh8TxQzk2duAz",
  "1JAhgkrOY1JEmXplXBbp7ELX3qGJT9Ckl",
  "12pkD135RbRCIblRnl-yrB-ft6taHfiHX",
  "1BFEMrcyxv1Vx0yYXCeGuQgwprtGILUin",
  "1zuSdmf1trowa1XuXiLjKhrLgCtQyaz3h",
  "1mr__UoeLmx0KtIt1BgJytfb3yqWFBEdj",
  "1_POY6KAjb8hjr-QZsnP4qI662QtWnDMa",
  "1x0vtoLIrub0XvGvT3kPSx3d7C1xI-cw2",
  "1Fn0wDbBR6FFTe4TpDQ6mkKP8ueGlphkp",
  "14JrmWLqQ4pUpYkBuHfUoEorGecO3YCP8",
  "1gbR2-R2gzLqdTXjpW1VXT9sdb8B_l_xH",
  "1lmh51sTx11gq9YLLCEz2bGvg3lnA3FP2",
  "1GAZcUKCgiHvJSyYnXQLIW2bCGdqFcYi4",
  "1b6DZs7BdChjOIH6Ki2_ropGe-e_bSD-D",
  "1omtWdSmrukE8PS6WQoWnw8pSPN_LOmz4",
  "1QkKD--U3RtCmitkBUo_is4-lxCFxI23-",
  "1tFyJhNxI5bMJslQ3xRjH0Jg5XiwYeOrT",
  "17-FWyWwTq-L9DsJijAgJAMSJxk7Ybp07",
  "1qffkrIXRy1jaCmsGmOa4nySDaMrGAQh7",
  "1G_uPkNyWXzmvsuMHSzlFL9O0VqBq6Dhk",
  "1QIlzBHtm-xr-jIgj1tOARzI4XW7KAWCx",
] as const;

export const socialMediaProjectUrls = driveImageIds.map((id) => driveThumb(id));

export const socialMediaProject: DriveShowcaseProject = {
  id: "social-media-post-design",
  title: "Social Media & Campaign Visuals",
  slug: "social-media-post-design",
  image: driveThumb(driveImageIds[0]),
  year: "2024–2026",
  catId: "Social Media Design",
  role: "Senior Brand & Social Media Designer",
  client: "Commercial Campaigns & Cultural Events",
  overview:
    "A curated collection of 43 social media campaigns, exhibition posters, cultural festival visuals, product advertising creative, and digital marketing layouts built for high engagement and brand recall.",
  tools: ["Adobe Photoshop", "Adobe Illustrator", "Generative AI Workflows", "Figma"],
  deliverables: [
    "43 High-Conversion Social Creatives",
    "Exhibition & Cultural Event Posters",
    "Product Launch Key Visuals",
    "Campaign Ad Templates",
  ],
  results: [
    { label: "Design Pieces", value: `${driveImageIds.length}` },
    { label: "Formats", value: "IG / FB / Print" },
  ],
  gallery: socialMediaProjectUrls,
  liveLink: driveFolder("1kiWsJDxv0MwhK1065BdLTY9toPXqXsYO"),
  source: "drive",
};

export const montMarteProject: DriveShowcaseProject = {
  id: "mont-marte-branding",
  title: "Mont Marte — Visual Identity & Brand Campaign",
  slug: "mont-marte-branding",
  image: driveThumb(montMarteIds[0]),
  year: "2025",
  catId: "Branding",
  role: "Brand Identity & Visual Designer",
  client: "Mont Marte Bangladesh",
  overview:
    "End-to-end visual identity and brand campaign series for Mont Marte art supplies — unifying vibrant studio color systems, packaging-led layouts, and high-craft promotional key visuals.",
  tools: ["Adobe Illustrator", "Adobe Photoshop", "Brand Systems", "Art Direction"],
  deliverables: [
    "10-Piece Brand Campaign Series",
    "Packaging & Product Key Visuals",
    "Retail & Digital Launch Collateral",
  ],
  results: [
    { label: "Brand Plates", value: `${montMarteIds.length}` },
    { label: "Focus", value: "Identity + Retail" },
  ],
  gallery: montMarteIds.map((id) => driveThumb(id)),
  liveLink: driveFolder("1Sip8S-EbXy71jmIijvqJMaCXGgsAsfAk"),
  source: "drive",
};

export const motionAnimationProject: DriveShowcaseProject = {
  id: "motion-and-3d-animation",
  title: "Motion Graphics, 3D & Stop Motion Showreel",
  slug: "motion-and-3d-animation",
  image: driveThumb("1gSwbPJGmPDtsgtecR041WWrLUTxY2r5a"),
  year: "2024–2026",
  catId: "Motion Design",
  role: "Motion Designer & 3D Generalist",
  client: "Commercial Reels, Cultural & Studio Pieces",
  overview:
    "14 playable motion design, Cinema 4D 3D product renders, character animation, frame-by-frame stop motion, and fast-paced social reel productions created for commercial and cultural storytelling.",
  tools: ["Cinema 4D", "After Effects", "Premiere Pro", "Blender"],
  deliverables: [
    "14 Playable Motion & 3D Videos",
    "3D Product Render Sequences",
    "Kinetic Typography & Social Reels",
  ],
  results: [
    { label: "Video Reels", value: `${motionVideoItems.length}` },
    { label: "Pipeline", value: "3D + 2D + Stop Motion" },
  ],
  gallery: motionVideoItems.map((item) => driveThumb(item.id)),
  videos: buildVideoItems(motionVideoItems),
  liveLink: driveFolder("1L39aUis62S2VxBkDxA2YVIqJghM1fF9M"),
  source: "drive",
};

export const aiAnimationProject: DriveShowcaseProject = {
  id: "ai-educational-animation",
  title: "AI-Assisted Educational & Story Animation",
  slug: "ai-educational-animation",
  image: driveThumb("1M5q5wZX4cgv0WL58YvUkRJVitRacYJ5i"),
  year: "2025–2026",
  catId: "3D Animation",
  role: "AI Animation Director & Motion Artist",
  client: "EdTech & Children's Storytelling",
  overview:
    "Bilingual children's storytelling and early-learning animated shorts blending AI-assisted character pipelines, expressive motion editing, and clear pedagogical visual pacing.",
  tools: ["Runway / Gen-AI", "After Effects", "Premiere Pro", "Sound Design"],
  deliverables: [
    "4 Complete Animated Episodes",
    "Character Design & Scene Consistency",
    "Bengali & English EdTech Shorts",
  ],
  results: [
    { label: "Episodes", value: `${aiAnimationVideoItems.length}` },
    { label: "Genre", value: "EdTech & Narrative" },
  ],
  gallery: aiAnimationVideoItems.map((item) => driveThumb(item.id)),
  videos: buildVideoItems(aiAnimationVideoItems),
  liveLink: driveFolder("1_7D46IpltgCj0aLpFTYWgoj9_e7roxKc"),
  source: "drive",
};

export const cartoonIllustrationProject: DriveShowcaseProject = {
  id: "cartoon-and-illustration",
  title: "Cartoon, Character & Editorial Illustration",
  slug: "cartoon-and-illustration",
  image: driveThumb(cartoonIllustrationIds[0]),
  year: "2023–2026",
  catId: "Creative Direction",
  role: "Character Designer & Illustrator",
  client: "Editorial, Character IP & Concept Art",
  overview:
    "28 original character concepts, stylized cartoons, narrative ink/digital illustrations, and expressive portrait studies combining Fine Arts foundational drawing with modern digital rendering.",
  tools: ["Procreate", "Adobe Photoshop", "Adobe Illustrator", "Digital Painting"],
  deliverables: [
    "28 Original Character & Illustration Plates",
    "Concept Art & Creature Studies",
    "Editorial & Storyboard Visuals",
  ],
  results: [
    { label: "Artworks", value: `${cartoonIllustrationIds.length}` },
    { label: "Style", value: "Fine Arts + Digital" },
  ],
  gallery: cartoonIllustrationIds.map((id) => driveThumb(id)),
  liveLink: driveFolder("1NYciQEIQ29hLoi6VYIfLQLOa2xb5hEUi"),
  source: "drive",
};

export const corporatePortfolioBookProject: DriveShowcaseProject = {
  id: "corporate-portfolio-book",
  title: "Corporate Portfolio Book (Complete PDF Dossier)",
  slug: "corporate-portfolio-book",
  image:
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
  year: "2026",
  catId: "Creative Direction",
  role: "Lead Creative & Art Director",
  client: "Agency & Corporate HR Review",
  overview:
    "A comprehensive corporate-ready portfolio book presenting selected brand systems, visual campaigns, typography layouts, and commercial design case studies in a single printable PDF dossier.",
  tools: ["Adobe InDesign", "Illustrator", "Brand Architecture", "Editorial Layout"],
  deliverables: [
    "Interactive Embedded PDF Portfolio Book",
    "Corporate & Agency Case Summaries",
    "Print-Ready Editorial Layout",
  ],
  results: [
    { label: "Format", value: "Interactive PDF" },
    { label: "Audience", value: "HR & Creative Directors" },
  ],
  gallery: [],
  pdfPreviewUrl: drivePreview("1OK1y5uJgZ3z4-V9bCLpzS_baw4Qla9Pp"),
  liveLink: driveView("1OK1y5uJgZ3z4-V9bCLpzS_baw4Qla9Pp"),
  source: "drive",
};

export const drivePortfolioProjects: DriveShowcaseProject[] = [
  montMarteProject,
  motionAnimationProject,
  aiAnimationProject,
  socialMediaProject,
  cartoonIllustrationProject,
  corporatePortfolioBookProject,
];
