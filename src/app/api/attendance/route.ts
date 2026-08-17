import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// Fetch attendance logs for a specific user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const logs = await prisma.attendance.findMany({
      where: { userEmail: email },
      orderBy: { clockIn: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/attendance Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Clock In
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if there is an active session (clockOut is null)
    const activeSession = await prisma.attendance.findFirst({
      where: { userEmail: email, clockOut: null },
    });

    if (activeSession) {
      return NextResponse.json(
        { error: "Already clocked in", activeSession },
        { status: 400 }
      );
    }

    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const newLog = await prisma.attendance.create({
      data: {
        userEmail: email,
        clockIn: new Date(),
        dateString: dateString,
      },
    });

    return NextResponse.json(newLog);
  } catch (error) {
    console.error("POST /api/attendance Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Clock Out
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the active session
    const activeSession = await prisma.attendance.findFirst({
      where: { userEmail: email, clockOut: null },
      orderBy: { clockIn: "desc" },
    });

    if (!activeSession) {
      return NextResponse.json(
        { error: "No active clock-in session found" },
        { status: 400 }
      );
    }

    const updatedLog = await prisma.attendance.update({
      where: { id: activeSession.id },
      data: { clockOut: new Date() },
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("PUT /api/attendance Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
