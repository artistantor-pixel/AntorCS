import PortfolioClient from "./PortfolioClient";
import { getAllPortfolioProjects } from "@/lib/portfolio-loader";

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await getAllPortfolioProjects();
  return <PortfolioClient initialProjects={projects} />;
}
