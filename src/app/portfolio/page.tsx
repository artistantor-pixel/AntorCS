import PortfolioClient from "./PortfolioClient";

// Auto-refresh every 1 minute — new Behance projects appear within 1 min
export const revalidate = 60;

import { fetchBehanceProjects } from "@/lib/behance";

async function getBehanceProjects() {
  try {
    const projects = await fetchBehanceProjects();
    return projects ?? [];
  } catch (error) {
    console.error("Failed to load Behance projects:", error);
    return [];
  }
}

import { socialMediaProject } from "@/lib/driveData";

export default async function PortfolioPage() {
  const behanceProjects = await getBehanceProjects();
  // Inject the local Google Drive project into the array
  const projects = [socialMediaProject, ...behanceProjects];
  
  return <PortfolioClient initialProjects={projects} />;
}
