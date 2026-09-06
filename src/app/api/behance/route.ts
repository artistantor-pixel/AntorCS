import { NextResponse } from "next/server";

// Auto-refresh every 5 minutes — new Behance projects appear within 5 min
export const revalidate = 300;

const BEHANCE_USERNAME = "antorkumarbiswas";
const RSS_URL = `https://www.behance.net/feeds/user?username=${BEHANCE_USERNAME}`;

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
}

/**
 * Extract image URL from RSS description HTML and wrap in proxy
 */
function extractImage(description: string): string {
  const match = description.match(/src='([^']+)'/);
  if (match) {
    // Note: /404/ in Behance CDN URLs is a SIZE identifier, not an HTTP error!
    // Use the original URL directly — proxy handles the fetch
    const originalUrl = match[1];
    // Proxy through our server-side route to bypass hotlink protection
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  }
  return "";
}

/**
 * Extract plain text description
 */
function extractDescription(description: string): string {
  // Remove HTML tags
  const noHtml = description.replace(/<[^>]+>/g, " ");
  // Remove img tag artifacts
  const cleaned = noHtml.replace(/\s+/g, " ").trim();
  return cleaned.substring(0, 200) || "Creative work by Antor Biswas";
}

/**
 * Detect category from project title / description
 */
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

/**
 * Convert title to URL-safe slug
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Extract Behance gallery ID from URL
 */
function extractBehanceId(url: string): string {
  const match = url.match(/gallery\/(\d+)/);
  return match ? match[1] : "";
}

/**
 * Parse Behance RSS XML
 */
function parseRSS(xml: string): BehanceProject[] {
  const projects: BehanceProject[] = [];
  
  // Extract all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;
  let index = 0;
  
  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const item = itemMatch[1];
    
    // Extract fields
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
    const overview = extractDescription(description);
    const catId = detectCategory(title, description);
    const behanceId = extractBehanceId(link);
    const year = pubDate ? new Date(pubDate).getFullYear().toString() : new Date().getFullYear().toString();
    
    // Assign sizes in a repeating pattern: large, medium, small, small, large...
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
    });
    
    index++;
  }
  
  return projects;
}

export async function GET() {
  try {
    const response = await fetch(RSS_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AnitorCSWebsite/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Behance RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    const projects = parseRSS(xml);

    return NextResponse.json(
      { projects, source: "behance", cachedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Behance RSS error:", error);
    return NextResponse.json(
      { projects: [], error: "Failed to fetch Behance projects" },
      { status: 500 }
    );
  }
}
