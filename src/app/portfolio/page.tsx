import PortfolioClient from "./PortfolioClient";

// Auto-refresh every 5 minutes — new Behance projects appear within 5 min
export const revalidate = 300;

async function getBehanceProjects() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/behance`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Behance fetch failed");
    const data = await res.json();
    return data.projects ?? [];
  } catch (error) {
    console.error("Failed to load Behance projects:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getBehanceProjects();
  return <PortfolioClient initialProjects={projects} />;
}
