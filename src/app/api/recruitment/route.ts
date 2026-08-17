import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch all recruitment proposals/briefs submitted by HRs
export async function GET() {
  try {
    const record = await prisma.content.findUnique({
      where: { id: "recruitment" }
    });

    if (!record) {
      return NextResponse.json([]);
    }

    return NextResponse.json(record.data);
  } catch (error) {
    console.error("Error reading recruitment proposals:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Submit a new recruitment proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, hrName, email, phone, positionType, offeredRange, jobDescription } = body;

    if (!companyName || !hrName || !email || !phone || !jobDescription) {
      return NextResponse.json({ error: "Missing required recruitment parameters." }, { status: 400 });
    }

    const newProposal = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      companyName,
      hrName,
      email,
      phone,
      positionType,
      offeredRange,
      jobDescription,
      createdAt: new Date().toISOString()
    };

    // Load current list
    const record = await prisma.content.findUnique({
      where: { id: "recruitment" }
    });

    let currentList: any[] = [];
    if (record && Array.isArray(record.data)) {
      currentList = record.data;
    }

    currentList.unshift(newProposal); // Put newest proposal at top

    await prisma.content.upsert({
      where: { id: "recruitment" },
      update: { data: currentList },
      create: { id: "recruitment", data: currentList }
    });

    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (error) {
    console.error("Error saving recruitment proposal:", error);
    return NextResponse.json({ error: "Failed to submit recruitment proposal." }, { status: 500 });
  }
}

// DELETE: Delete a specific recruitment proposal
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing proposal ID." }, { status: 400 });
    }

    const record = await prisma.content.findUnique({
      where: { id: "recruitment" }
    });

    if (!record || !Array.isArray(record.data)) {
      return NextResponse.json({ error: "No proposals found." }, { status: 404 });
    }

    const updatedList = record.data.filter((item: any) => item.id !== id);

    await prisma.content.update({
      where: { id: "recruitment" },
      data: { data: updatedList }
    });

    return NextResponse.json({ success: true, message: "Proposal deleted successfully." });
  } catch (error) {
    console.error("Error deleting recruitment proposal:", error);
    return NextResponse.json({ error: "Failed to delete proposal." }, { status: 500 });
  }
}
