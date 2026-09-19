import PortfolioClient from "./PortfolioClient";

// Auto-refresh every 1 minute — new Behance projects appear within 1 min
export const revalidate = 60;

import { fetchBehanceProjects } from "@/app/api/behance/route";

async function getBehanceProjects() {
  try {
    const projects = await fetchBehanceProjects();
    return projects ?? [];
  } catch (error) {
    console.error("Failed to load Behance projects:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getBehanceProjects();
  return <PortfolioClient initialProjects={projects} />;
}
