import { notFound } from "next/navigation";
import { getPortfolioProjectBySlug } from "@/lib/portfolio-loader";
import PortfolioDetailClient from "./PortfolioDetailClient";

export const revalidate = 60;

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const { project, nextProject } = await getPortfolioProjectBySlug(slug);
  if (!project) notFound();

  return <PortfolioDetailClient project={project} nextProject={nextProject} behanceData={null} />;
}
