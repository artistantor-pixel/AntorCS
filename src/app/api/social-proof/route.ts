import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_ORGANIZATIONS, mergeOrganizations } from "@/lib/organizations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contentRec = await prisma.content.findUnique({
      where: { id: "social-proof" },
    });

    if (!contentRec) {
      return NextResponse.json(DEFAULT_ORGANIZATIONS);
    }

    const rawData: unknown = contentRec.data;
    const dbLogos =
      rawData &&
      typeof rawData === "object" &&
      !Array.isArray(rawData) &&
      "logos" in rawData &&
      Array.isArray((rawData as { logos?: unknown }).logos)
        ? (rawData as { logos: string[] }).logos
        : [];
    return NextResponse.json(mergeOrganizations(dbLogos));
  } catch (error) {
    console.error("Failed to fetch social proof:", error);
    return NextResponse.json(DEFAULT_ORGANIZATIONS);
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
