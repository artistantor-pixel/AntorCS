import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const REAL_ORGANIZATIONS = [
  "Canvas",
  "Deepto TV",
  "ICT Division",
  "Bisorgo Technology",
  "CCJ-B",
  "Radiant Pharma",
  "University of Dhaka",
];

export async function GET() {
  try {
    const contentRec = await prisma.content.findUnique({
      where: { id: "social-proof" },
    });

    if (!contentRec) {
      return NextResponse.json(REAL_ORGANIZATIONS);
    }

    const rawData: unknown = contentRec.data;
    const logos =
      rawData &&
      typeof rawData === "object" &&
      !Array.isArray(rawData) &&
      "logos" in rawData &&
      Array.isArray((rawData as { logos?: unknown }).logos)
        ? (rawData as { logos: string[] }).logos
        : REAL_ORGANIZATIONS;
    return NextResponse.json(logos);
  } catch (error) {
    console.error("Failed to fetch social proof:", error);
    return NextResponse.json(REAL_ORGANIZATIONS);
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
