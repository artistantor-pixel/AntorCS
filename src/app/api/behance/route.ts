import { NextResponse } from "next/server";
import { fetchBehanceProjects } from "@/lib/behance";

// Auto-refresh every 5 minutes — new Behance projects appear within 5 min
export const revalidate = 300;

export async function GET() {
  try {
    const projects = await fetchBehanceProjects();

    return NextResponse.json(
      { projects, source: "behance", cachedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Behance RSS error:", error);
    return NextResponse.json(
      { projects: [], error: "Failed to fetch Behance projects" },
      { status: 500 }
    );
  }
}
