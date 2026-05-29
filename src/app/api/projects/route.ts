import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.project.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading projects:", error);
    return NextResponse.json({ error: "Failed to read projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedProjects = await request.json();

    if (!Array.isArray(updatedProjects)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
    }

    // 1. Delete projects not included in the payload (Guarantees data integrity for CRUD deletions)
    const incomingSlugs = updatedProjects.map(p => p.slug).filter(Boolean);
    await prisma.project.deleteMany({
      where: {
        slug: {
          notIn: incomingSlugs
        }
      }
    });

    // 2. Upsert the projects in the payload
    for (const p of updatedProjects) {
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: {
          titleKey: p.titleKey,
          categoryKey: p.categoryKey,
          title: p.title,
          image: p.image,
          size: p.size,
          year: String(p.year),
          catId: p.catId,
          client: p.client,
          duration: p.duration,
          role: p.role,
          liveLink: p.liveLink,
          videoUrl: p.videoUrl,
          isFeatured: p.isFeatured || false,
          isActive: p.isActive !== undefined ? p.isActive : true,
          overview: p.overview,
          challenge: p.challenge,
          solution: p.solution,
          results: p.results,
          gallery: p.gallery,
          blocks: p.blocks,
          themeBackground: p.themeBackground || "black",
          tools: p.tools,
          keywords: p.keywords
        },
        create: {
          titleKey: p.titleKey,
          categoryKey: p.categoryKey,
          title: p.title,
          slug: p.slug,
          image: p.image,
          size: p.size,
          year: String(p.year),
          catId: p.catId,
          client: p.client,
          duration: p.duration,
          role: p.role,
          liveLink: p.liveLink,
          videoUrl: p.videoUrl,
          isFeatured: p.isFeatured || false,
          isActive: p.isActive !== undefined ? p.isActive : true,
          overview: p.overview,
          challenge: p.challenge,
          solution: p.solution,
          results: p.results,
          gallery: p.gallery,
          blocks: p.blocks,
          themeBackground: p.themeBackground || "black",
          tools: p.tools,
          keywords: p.keywords
        }
      });
    }

    return NextResponse.json({ success: true, message: "Projects updated successfully." });
  } catch (error) {
    console.error("Error writing projects:", error);
    return NextResponse.json({ error: "Failed to save projects." }, { status: 500 });
  }
}
