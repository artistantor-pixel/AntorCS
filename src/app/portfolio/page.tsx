import prisma from "@/lib/prisma";
import PortfolioClient from "./PortfolioClient";

// Ensure this page is dynamically rendered so it always fetches the latest projects
export const dynamic = "force-dynamic";


export default async function PortfolioPage() {
  // Fetch projects directly from the database during server-side rendering
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  });

  return <PortfolioClient initialProjects={projects} />;
}
