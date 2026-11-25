import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioProjectBySlug } from "@/lib/portfolio-loader";
import { buildPageMetadata } from "@/lib/seo";
import PortfolioDetailClient from "./PortfolioDetailClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getPortfolioProjectBySlug(slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return buildPageMetadata({
    title: project.title,
    description:
      project.overview ||
      `${project.title} — ${project.catId} work by Antor Kumar Biswas.`,
    path: `/portfolio/${project.slug}`,
    image: project.image || "/antor-portrait.jpg",
  });
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const { project, nextProject } = await getPortfolioProjectBySlug(slug);
  if (!project) notFound();

  return <PortfolioDetailClient project={project} nextProject={nextProject} />;
}
