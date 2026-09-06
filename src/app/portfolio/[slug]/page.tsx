import PortfolioDetailClient from "./PortfolioDetailClient";
import { notFound } from "next/navigation";

// ISR: revalidate every hour
export const revalidate = 3600;

async function getAllBehanceProjects() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/behance`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Behance fetch failed");
    const data = await res.json();
    return data.projects ?? [];
  } catch {
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

