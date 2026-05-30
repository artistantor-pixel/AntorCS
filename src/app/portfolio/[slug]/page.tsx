import { PrismaClient } from "@prisma/client";
import PortfolioDetailClient from "./PortfolioDetailClient";
import { notFound } from "next/navigation";

// Ensure dynamic rendering to fetch the latest project details
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  const decodedSlug = decodeURIComponent(slug);

  // Fetch all active projects ordered by ID to determine next/prev
  const allProjects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  });

  const index = allProjects.findIndex(p => p.slug === slug || p.slug === decodedSlug);
  
  if (index === -1) {
    notFound();
  }

  const project = allProjects[index];
  const nextProject = allProjects[(index + 1) % allProjects.length];

  return <PortfolioDetailClient project={project} nextProject={nextProject} />;
}
