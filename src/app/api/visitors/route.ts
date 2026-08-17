import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_BASE_VISITORS = 1428;

export async function GET() {
  try {
    const record = await prisma.content.findUnique({
      where: { id: "visitors" }
    });

    if (!record) {
      return NextResponse.json({ count: DEFAULT_BASE_VISITORS });
    }

    const data = record.data as { count: number };
    return NextResponse.json({ count: data.count || DEFAULT_BASE_VISITORS });
  } catch (error) {
    console.error("Error reading visitors:", error);
    return NextResponse.json({ count: DEFAULT_BASE_VISITORS });
  }
}

export async function POST() {
  try {
    const record = await prisma.content.findUnique({
      where: { id: "visitors" }
    });

    let currentCount = DEFAULT_BASE_VISITORS;
    if (record && record.data && typeof (record.data as any).count === "number") {
      currentCount = (record.data as any).count;
    }

    const newCount = currentCount + 1;

    await prisma.content.upsert({
      where: { id: "visitors" },
      update: { data: { count: newCount } },
      create: { id: "visitors", data: { count: newCount } }
    });

    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error("Error saving visitor count:", error);
    return NextResponse.json({ error: "Failed to increment visitors" }, { status: 500 });
  }
}
