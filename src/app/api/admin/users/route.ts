import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch all registered workspace users
export async function GET() {
  try {
    const record = await prisma.content.findUnique({
      where: { id: "workspace_users" }
    });

    if (!record || !Array.isArray(record.data)) {
      return NextResponse.json([]);
    }

    // Map to remove passwords or keep it simple for the admin console
    const formatted = record.data.map((u: any) => ({
      name: u.name,
      email: u.email,
      password: u.password || "N/A"
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching workspace users:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// DELETE: Remove a registered workspace user
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const emailToDelete = url.searchParams.get("email")?.toLowerCase().trim();

    if (!emailToDelete) {
      return NextResponse.json({ error: "Missing email parameter." }, { status: 400 });
    }

    const record = await prisma.content.findUnique({
      where: { id: "workspace_users" }
    });

    if (!record || !Array.isArray(record.data)) {
      return NextResponse.json({ error: "No registered users found." }, { status: 404 });
    }

    const updatedUsers = record.data.filter((u: any) => u.email.toLowerCase().trim() !== emailToDelete);

    await prisma.content.update({
      where: { id: "workspace_users" },
      data: { data: updatedUsers }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workspace user:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
