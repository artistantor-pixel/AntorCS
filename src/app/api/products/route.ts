import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error reading products:", error);
    return NextResponse.json({ error: "Failed to read products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedProducts = await request.json();

    if (!Array.isArray(updatedProducts)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
    }

    // 1. Delete products not in the payload (Ensures CRUD data integrity)
    const incomingIds = updatedProducts.map(p => p.id).filter(id => typeof id === "number" && id < 10000000000); // Exclude temporary IDs
    await prisma.product.deleteMany({
      where: {
        id: {
          notIn: incomingIds
        }
      }
    });

    // 2. Upsert incoming products
    for (const p of updatedProducts) {
      const isTempId = p.id >= 10000000000; // Temporary ID from client
      if (isTempId) {
        // Create new
        await prisma.product.create({
          data: {
            title: p.title,
            description: p.description,
            price: parseFloat(p.price) || 0,
            pdfUrl: p.pdfUrl,
            image: p.image,
            isActive: p.isActive !== undefined ? p.isActive : true
          }
        });
      } else {
        // Update existing
        await prisma.product.upsert({
          where: { id: p.id },
          update: {
            title: p.title,
            description: p.description,
            price: parseFloat(p.price) || 0,
            pdfUrl: p.pdfUrl,
            image: p.image,
            isActive: p.isActive !== undefined ? p.isActive : true
          },
          create: {
            title: p.title,
            description: p.description,
            price: parseFloat(p.price) || 0,
            pdfUrl: p.pdfUrl,
            image: p.image,
            isActive: p.isActive !== undefined ? p.isActive : true
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: "Products updated successfully." });
  } catch (error) {
    console.error("Error writing products:", error);
    return NextResponse.json({ error: "Failed to save products." }, { status: 500 });
  }
}
