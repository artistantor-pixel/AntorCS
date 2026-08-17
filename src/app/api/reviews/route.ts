import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { clientName, role, content, rating } = await req.json();

    if (!clientName || !content) {
      return NextResponse.json(
        { error: "Name and content are required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        clientName,
        role: role || "",
        content,
        rating: Number(rating) || 5,
        isApproved: false, // Must be approved by admin
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { error: "Failed to submit review." },
      { status: 500 }
    );
  }
}
