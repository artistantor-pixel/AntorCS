import prisma from "@/lib/prisma";
import { drivePortfolioProjects, type DriveVideoItem } from "@/lib/driveData";
import localProjectsJson from "@/data/projects.json";

export interface PortfolioProject {
  id: string | number;
  title: string;
  slug: string;
  image: string;
  year: string;
  catId: string;
  role?: string;
  client?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  liveLink?: string;
  link?: string;
  tools?: string[];
  deliverables?: string[];
  results?: Array<{ label: string; value: string }>;
  gallery?: string[];
  videos?: DriveVideoItem[];
  pdfPreviewUrl?: string;
  blocks?: unknown[];
  themeBackground?: string;
  source?: "curated" | "drive" | "db";
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  );
}

function normalizeCuratedProject(raw: Record<string, unknown>): PortfolioProject | null {
  const title = normalizeText(raw.title);
  const slug = normalizeText(raw.slug);
  const image = normalizeText(raw.image);
  if (!title || !slug || !isValidImageUrl(image)) return null;

  return {
    id: (raw.id as string | number) ?? slug,
    title,
    slug,
    image,
    year: normalizeText(raw.year) || "2024",
    catId: normalizeText(raw.catId) || "Creative Direction",
    role: normalizeText(raw.role),
    client: normalizeText(raw.client),
    overview: normalizeText(raw.overview),
    challenge: normalizeText(raw.challenge),
    solution: normalizeText(raw.solution),
    liveLink: normalizeText(raw.liveLink),
    tools: Array.isArray(raw.tools) ? (raw.tools as string[]) : [],
    deliverables: Array.isArray(raw.deliverables) ? (raw.deliverables as string[]) : [],
    results: Array.isArray(raw.results)
      ? (raw.results as Array<{ label: string; value: string }>)
      : [],
    gallery: Array.isArray(raw.gallery) ? (raw.gallery as string[]) : [],
    blocks: Array.isArray(raw.blocks) ? raw.blocks : undefined,
    themeBackground: normalizeText(raw.themeBackground) || undefined,
    source: "curated",
  };
}

async function getDatabaseProjects(): Promise<PortfolioProject[]> {
  try {
    const rec = await prisma.content.findUnique({ where: { id: "projects" } });
    const list = (rec?.data as { projects?: Record<string, unknown>[] } | null)?.projects;
    if (!Array.isArray(list)) return [];
    const results: PortfolioProject[] = [];
    for (const item of list) {
      const normalized = normalizeCuratedProject(item);
      if (normalized) {
        results.push({ ...normalized, source: "db" });
      }
    }
    return results;
  } catch {
    return [];
  }
}

/** Loads and merges Google Drive showcase collections, DB custom projects, and curated case studies. */
export async function getAllPortfolioProjects(): Promise<PortfolioProject[]> {
  const dbProjects = await getDatabaseProjects();

  const seenSlugs = new Set<string>();
  const merged: PortfolioProject[] = [];

  const pushUnique = (project: PortfolioProject) => {
    const slug = project.slug.toLowerCase();
    if (!slug || seenSlugs.has(slug)) return;
    seenSlugs.add(slug);
    merged.push(project);
  };

  // 1. Database custom projects (if user added any via /admin)
  for (const p of dbProjects) {
    pushUnique(p);
  }

  // 2. Primary Google Drive My Work showcases (Branding, Motion, AI Animation, Social Media, Illustration, PDF Book)
  for (const driveItem of drivePortfolioProjects) {
    pushUnique({
      ...driveItem,
      source: "drive",
    });
  }

  // 3. Curated local studio case studies from src/data/projects.json
  const curatedRaw = (localProjectsJson as { projects?: Record<string, unknown>[] }).projects ?? [];
  for (const raw of curatedRaw) {
    const normalized = normalizeCuratedProject(raw);
    if (normalized) {
      pushUnique(normalized);
    }
  }

  return merged;
}

export async function getPortfolioProjectBySlug(slug: string): Promise<{
  project: PortfolioProject | null;
  nextProject: PortfolioProject | null;
}> {
  const all = await getAllPortfolioProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { project: null, nextProject: null };
  const nextProject = all.length > 1 ? all[(idx + 1) % all.length] : null;
  return { project: all[idx], nextProject };
}
