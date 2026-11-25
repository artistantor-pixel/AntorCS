import type { MetadataRoute } from "next";
import { EXPERTISE_LIST } from "@/config/expertise";
import { readJournalEntries } from "@/lib/journal-store";
import { getAllPortfolioProjects } from "@/lib/portfolio-loader";
import { getRequestSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getRequestSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/hire`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
  ];

  const [projects, journalEntries] = await Promise.all([
    getAllPortfolioProjects().catch(() => []),
    readJournalEntries().catch(() => []),
  ]);

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = EXPERTISE_LIST.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const journalRoutes: MetadataRoute.Sitemap = journalEntries.map((entry) => ({
    url: `${baseUrl}/journal/${entry.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...journalRoutes];
}
