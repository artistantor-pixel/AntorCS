import prisma from "@/lib/prisma";
import { fetchBehanceProjects } from "@/lib/behance";
import { socialMediaProject } from "@/lib/driveData";
import localProjectsJson from "@/data/projects.json";

export interface PortfolioProject {
  id: string | number;
  title: string;
  slug: string;
  image: string;
  year: string;
  catId: string;
  size?: string;
  client?: string;
  duration?: string;
  role?: string;
  liveLink?: string;
  link?: string;
  videoUrl?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  results?: Array<{ label: string; value: string }>;
  gallery?: string[];
  blocks?: unknown[];
  themeBackground?: string;
  behanceId?: string;
  source?: "curated" | "behance" | "drive" | "db";
}

function normalizeCategory(rawCat: string): string {
  const c = (rawCat || "").toLowerCase();
  if (c.includes("social")) return "Social Media Design";
  if (c.includes("3d")) return "3D Animation";
  if (c.includes("motion")) return "Motion Design";
  if (c.includes("animation")) return "3D Animation";
  if (c.includes("ui") || c.includes("ux")) return "UI/UX";
  if (c.includes("brand") || c.includes("poster") || c.includes("textile")) return "Branding";
  if (c.includes("creative")) return "Creative Direction";
  return rawCat || "Creative Direction";
}

async function getDatabaseProjects(): Promise<PortfolioProject[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });
    return rows.map((row) => ({
      id: `db-${row.id}`,
      title: row.title,
      slug: row.slug,
      image: row.image,
      year: row.year,
      catId: normalizeCategory(row.catId),
      size: row.size,
      client: row.client || undefined,
      duration: row.duration || undefined,
      role: row.role || undefined,
      liveLink: row.liveLink || undefined,
      videoUrl: row.videoUrl || undefined,
      overview: row.overview || undefined,
      challenge: row.challenge || undefined,
      solution: row.solution || undefined,
      results: Array.isArray(row.results)
        ? (row.results as Array<{ label: string; value: string }>)
        : undefined,
      gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : undefined,
      blocks: Array.isArray(row.blocks) ? (row.blocks as unknown[]) : undefined,
      themeBackground: row.themeBackground,
      source: "db" as const,
    }));
  } catch {
    return [];
  }
}

function getCuratedJsonProjects(): PortfolioProject[] {
  return localProjectsJson.map((p) => ({
    ...p,
    id: `curated-${p.id}`,
    catId: normalizeCategory(p.catId),
    source: "curated" as const,
  }));
}

/** Loads and merges curated case studies, DB projects, Google Drive gallery, and live Behance projects. */
export async function getAllPortfolioProjects(): Promise<PortfolioProject[]> {
  const [dbProjects, behanceProjects] = await Promise.all([
    getDatabaseProjects(),
    fetchBehanceProjects().catch((err) => {
      console.error("Failed to load Behance projects:", err);
      return [];
    }),
  ]);

  const curated = getCuratedJsonProjects();
  const seenSlugs = new Set<string>();
  const merged: PortfolioProject[] = [];

  const pushUnique = (item: PortfolioProject) => {
    if (!item.slug) return;
    let uniqueSlug = item.slug;
    if (seenSlugs.has(uniqueSlug)) {
      uniqueSlug = `${item.slug}-${String(item.id).replace(/[^a-zA-Z0-9]/g, "")}`;
    }
    seenSlugs.add(uniqueSlug);
    merged.push({ ...item, slug: uniqueSlug });
  };

  // 1. Admin / Database projects take precedence if present
  for (const p of dbProjects) {
    pushUnique(p);
  }

  // 2. Curated flagship case studies from src/data/projects.json
  for (const p of curated) {
    if (!seenSlugs.has(p.slug)) {
      pushUnique(p);
    }
  }

  // 3. Google Drive 31-piece Social Media showcase
  pushUnique({
    ...socialMediaProject,
    source: "drive",
  });

  // 4. Live Behance projects (with unique slugs & max_808 covers)
  for (const p of behanceProjects) {
    pushUnique({
      ...p,
      liveLink: p.link,
      source: "behance",
    });
  }

  return merged;
}

export async function getPortfolioProjectBySlug(slug: string): Promise<{
  project: PortfolioProject | null;
  nextProject: PortfolioProject | null;
}> {
  const all = await getAllPortfolioProjects();
  const decoded = decodeURIComponent(slug);
  const index = all.findIndex((p) => p.slug === slug || p.slug === decoded);

  if (index === -1) {
    return { project: null, nextProject: null };
  }

  return {
    project: all[index],
    nextProject: all.length > 1 ? all[(index + 1) % all.length] : null,
  };
}
