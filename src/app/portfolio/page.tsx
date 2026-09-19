import PortfolioClient from "./PortfolioClient";

// Auto-refresh every 5 minutes — new Behance projects appear within 5 min
export const revalidate = 300;

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
