import fs from 'fs';

function extractImage(description: string): string {
  const match = description.match(/src='([^']+)'/);
  if (match) {
    const originalUrl = match[1];
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  }
  return "";
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

function parseRSS(xml: string): any[] {
  const projects: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;
  let index = 0;
  
  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const item = itemMatch[1];
    const titleMatch = item.match(/<title><\!\[CDATA\[(.+?)\]\]><\/title>/);
    const linkMatch = item.match(/<link><\!\[CDATA\[(.+?)\]\]><\/link>/);
    const descMatch = item.match(/<description><\!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    const dateMatch = item.match(/<pubDate><\!\[CDATA\[(.+?)\]\]><\/pubDate>/);
    
    if (!titleMatch || !linkMatch) continue;
    
    const title = titleMatch[1].trim();
    const link = linkMatch[1].trim();
    const description = descMatch ? descMatch[1] : "";
    const pubDate = dateMatch ? dateMatch[1] : "";
    
    const image = extractImage(description);
    const overview = extractDescription(description);
    const catId = detectCategory(title, description);
    const behanceId = extractBehanceId(link);
    const year = pubDate ? new Date(pubDate).getFullYear().toString() : new Date().getFullYear().toString();
    
    projects.push({
      id: behanceId || `project-${index}`,
      title,
      link,
    });
    index++;
  }
  return projects;
}

const xml = fs.readFileSync('/Users/antorbiswas/.gemini/antigravity-ide/brain/e75706b1-daf5-4476-8f4b-c6c8674aad4e/.system_generated/steps/33/content.md', 'utf8');
console.log(parseRSS(xml));
