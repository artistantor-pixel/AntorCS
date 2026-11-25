import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";
import { getAllPortfolioProjects } from "@/lib/portfolio-loader";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Selected Works & Portfolio",
  description:
    "Explore branding, 2D/3D motion animation, character illustration, social media campaigns, and corporate portfolio books by Antor Kumar Biswas.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await getAllPortfolioProjects();
  return <PortfolioClient initialProjects={projects} />;
}
