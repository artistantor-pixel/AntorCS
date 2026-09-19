import PortfolioDetailClient from "./PortfolioDetailClient";
import { notFound } from "next/navigation";

// ISR: revalidate every minute
export const revalidate = 60;

import { fetchBehanceProjects } from "@/lib/behance";

async function getAllBehanceProjects() {
  try {
    const projects = await fetchBehanceProjects();
    return projects ?? [];
  } catch (error) {
    console.error("Failed to load Behance projects:", error);
    return [];
  }
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) notFound();

  const decodedSlug = decodeURIComponent(slug);
  const allProjects = await getAllBehanceProjects();
  const index = allProjects.findIndex(
    (p: { slug: string }) => p.slug === slug || p.slug === decodedSlug
  );

  if (index === -1) notFound();

  const project = allProjects[index];
  const nextProject = allProjects[(index + 1) % allProjects.length];

  return <PortfolioDetailClient project={project} nextProject={nextProject} behanceData={null} />;
}

