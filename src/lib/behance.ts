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
}

const BEHANCE_USERNAME = "antorkumarbiswas";
const RSS_URL = `https://www.behance.net/feeds/user?username=${BEHANCE_USERNAME}`;

function extractAllImages(description: string): string[] {
  const regex = /src='([^']+)'/g;
  let match;
  const urls: string[] = [];
  while ((match = regex.exec(description)) !== null) {
    const originalUrl = match[1];
    urls.push(`/api/image-proxy?url=${encodeURIComponent(originalUrl)}`);
  }
  return urls;
}

function extractImage(description: string): string {
  const images = extractAllImages(description);
  return images.length > 0 ? images[0] : "";
}

function extractDescription(description: string): string {
  const noHtml = description.replace(/<[^>]+>/g, " ");
  const cleaned = noHtml.replace(/\s+/g, " ").trim();
  return cleaned.substring(0, 200) || "Creative work by Antor Biswas";
}

function detectCategory(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase();
  if (text.includes("motion") || text.includes("animation") || text.includes("video") || text.includes("reel")) {
    return "Motion Design";
  }
  if (text.includes("3d") || text.includes("three dimensional") || text.includes("blender")) {
    return "3D Animation";
  }
  if (text.includes("logo") || text.includes("brand") || text.includes("identity")) {
    return "Branding";
  }
  if (text.includes("ui") || text.includes("ux") || text.includes("web design") || text.includes("interface")) {
    return "UI/UX";
  }
  if (text.includes("poster") || text.includes("social media") || text.includes("advertising") || text.includes("lettering") || text.includes("doodle")) {
    return "Creative Direction";
  }
  return "Creative Direction";
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractBehanceId(url: string): string {
  const match = url.match(/gallery\/(\d+)/);
  return match ? match[1] : "";
}

function parseRSS(xml: string): BehanceProject[] {
  const projects: BehanceProject[] = [];
  
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;
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
    
    const image = extractImage(description);
    const gallery = extractAllImages(description); // Get all images for the project body
    const overview = extractDescription(description);
    const catId = detectCategory(title, description);
    const behanceId = extractBehanceId(link);
    const year = pubDate ? new Date(pubDate).getFullYear().toString() : new Date().getFullYear().toString();
    
    const sizePattern: Array<"large" | "medium" | "small"> = ["large", "medium", "small", "small", "large", "medium", "small", "small", "medium", "small", "small", "medium"];
    const size = sizePattern[index % sizePattern.length];
    
    projects.push({
      id: behanceId || `project-${index}`,
      title,
      slug: slugify(title),
      image,
      link,
      overview,
      year,
      catId,
      size,
      behanceId,
      gallery,
    });
    
    index++;
  }
  
  return projects;
}

export async function fetchBehanceProjects(): Promise<BehanceProject[]> {
  const response = await fetch(RSS_URL, {
    next: { 
      revalidate: 60, // Cache for 1 minute
      tags: ["behance"] 
    },
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AnitorCSWebsite/1.0)",
      "Accept": "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Behance RSS fetch failed: ${response.status}`);
  }

  const xml = await response.text();
  return parseRSS(xml);
}
