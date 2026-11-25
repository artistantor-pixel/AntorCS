export interface BehanceProject {
  id: string;
  title: string;
  slug: string;
  image: string;
  link: string;
  overview: string;
  year: string;
  catId: string;
  size: "large" | "medium" | "small";
  behanceId: string;
  gallery?: string[];
  source: "behance";
}

const BEHANCE_USERNAME = "antorkumarbiswas";
const RSS_URL = `https://www.behance.net/feeds/user?username=${BEHANCE_USERNAME}`;

function upgradeBehanceImageResolution(url: string): string {
  // Behance RSS serves small 404px covers; upgrade to crisp max_808
  return url.replace("/projects/404/", "/projects/max_808/");
}

function extractAllImages(description: string): string[] {
  const regex = /src=['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  const urls: string[] = [];
  while ((match = regex.exec(description)) !== null) {
    const upgraded = upgradeBehanceImageResolution(match[1]);
    urls.push(`/api/image-proxy?url=${encodeURIComponent(upgraded)}`);
  }
  return urls;
}

function extractDescription(description: string): string {
  const noHtml = description.replace(/<[^>]+>/g, " ");
  const cleaned = noHtml.replace(/\s+/g, " ").trim();
  return cleaned.substring(0, 200) || "Visual design showcase published on Behance.";
}

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("social media")) {
    return "Social Media Design";
  }
  if (text.includes("3d") || text.includes("three dimensional") || text.includes("blender")) {
    return "3D Animation";
  }
  if (text.includes("motion") || text.includes("animation") || text.includes("video") || text.includes("reel")) {
    return "Motion Design";
  }
  if (text.includes("logo") || text.includes("brand") || text.includes("identity") || text.includes("tote")) {
    return "Branding";
  }
  if (text.includes("ui") || text.includes("ux") || text.includes("web design") || text.includes("interface")) {
    return "UI/UX";
  }
  return "Creative Direction";
}

function slugify(title: string, fallbackId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
  if (!base) return `behance-${fallbackId}`;
  return fallbackId ? `${base}-${fallbackId.slice(-4)}` : base;
}

function extractBehanceId(url: string): string {
  const match = url.match(/gallery\/(\d+)/);
  return match ? match[1] : "";
}

function parseRSS(xml: string): BehanceProject[] {
  const projects: BehanceProject[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch: RegExpExecArray | null;
  let index = 0;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const item = itemMatch[1];

    const titleMatch = item.match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/);
    const linkMatch = item.match(/<link><!\[CDATA\[(.+?)\]\]><\/link>/);
    const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    const dateMatch = item.match(/<pubDate><!\[CDATA\[(.+?)\]\]><\/pubDate>/);

    if (!titleMatch || !linkMatch) continue;

    const title = titleMatch[1].trim();
    const link = linkMatch[1].trim();
    const description = descMatch ? descMatch[1] : "";
    const pubDate = dateMatch ? dateMatch[1] : "";

    const gallery = extractAllImages(description);
    const image = gallery[0] || "";
    const overview = extractDescription(description);
    const catId = detectCategory(title, description);
    const behanceId = extractBehanceId(link);
    const year = pubDate
      ? new Date(pubDate).getFullYear().toString()
      : new Date().getFullYear().toString();

    projects.push({
      id: behanceId || `behance-${index}`,
      title,
      slug: slugify(title, behanceId || String(index)),
      image,
      link,
      overview,
      year,
      catId,
      size: "medium",
      behanceId,
      gallery,
      source: "behance",
    });

    index++;
  }

  return projects;
}

export async function fetchBehanceProjects(): Promise<BehanceProject[]> {
  const response = await fetch(RSS_URL, {
    next: {
      revalidate: 60,
      tags: ["behance"],
    },
    signal: AbortSignal.timeout(7000),
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AntorCSWebsite/1.0)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Behance RSS fetch failed: ${response.status}`);
  }

  const xml = await response.text();
  return parseRSS(xml);
}
