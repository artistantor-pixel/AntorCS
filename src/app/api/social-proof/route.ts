import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const contentRec = await prisma.content.findUnique({
      where: { id: "social-proof" },
    });

    if (!contentRec) {
      return NextResponse.json(["Vogue", "Spotify", "Nike", "Netflix", "Sony"]);
    }

    const data = contentRec.data as any;
    return NextResponse.json(data.logos || ["Vogue", "Spotify", "Nike", "Netflix", "Sony"]);
  } catch (error) {
    console.error("Failed to fetch social proof:", error);
    return NextResponse.json(["Vogue", "Spotify", "Nike", "Netflix", "Sony"]);
  }
}

export async function POST(req: Request) {
  try {
    const { logos } = await req.json();

    if (!Array.isArray(logos)) {
      return NextResponse.json({ error: "Logos must be an array" }, { status: 400 });
    }

    await prisma.content.upsert({
      where: { id: "social-proof" },
      update: { data: { logos } },
      create: { id: "social-proof", data: { logos } },
    });

    return NextResponse.json({ success: true, logos });
  } catch (error) {
    console.error("Failed to update social proof:", error);
    return NextResponse.json(
      { error: "Failed to update social proof" },
      { status: 500 }
    );
  }
}
