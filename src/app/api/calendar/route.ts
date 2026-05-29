import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

function getEmailAndValidate(request: Request | { url: string }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email || !email.endsWith("@gmail.com")) {
    return null;
  }
  return email;
}

// GET: Fetch all calendar events for a specific Gmail user
export async function GET(request: Request) {
  try {
    const email = getEmailAndValidate(request);
    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Valid Gmail login required." }, { status: 401 });
    }

    const key = `calendar_user_${email}`;
    const record = await prisma.content.findUnique({
      where: { id: key }
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

// POST: Save/update calendar events list for a specific Gmail user
export async function POST(request: Request) {
  try {
    const email = getEmailAndValidate(request);
    if (!email) {
      return NextResponse.json({ error: "Unauthorized. Valid Gmail login required." }, { status: 401 });
    }

    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of events." }, { status: 400 });
    }

    const key = `calendar_user_${email}`;
    const updatedRecord = await prisma.content.upsert({
      where: { id: key },
      update: { data: body },
      create: { id: key, data: body }
    });

    return NextResponse.json({ success: true, events: updatedRecord.data });
  } catch (error) {
    console.error("Error saving calendar events:", error);
    return NextResponse.json({ error: "Failed to save calendar events." }, { status: 500 });
  }
}
