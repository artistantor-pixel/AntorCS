import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

// GET: Fetch all calendar events
export async function GET() {
  try {
    const record = await prisma.content.findUnique({
      where: { id: "calendar" }
    });

    if (!record || !record.data) {
      return NextResponse.json([]);
    }

    return NextResponse.json(record.data);
  } catch (error) {
    console.error("Error reading calendar events:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Save/update calendar events list
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of events." }, { status: 400 });
    }

    const updatedRecord = await prisma.content.upsert({
      where: { id: "calendar" },
      update: { data: body },
      create: { id: "calendar", data: body }
    });

    return NextResponse.json({ success: true, events: updatedRecord.data });
  } catch (error) {
    console.error("Error saving calendar events:", error);
    return NextResponse.json({ error: "Failed to save calendar events." }, { status: 500 });
  }
}
