import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// GET: Fetch orders for Admin panel OR verify single order status for client polling OR get outbound email logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trxId = searchParams.get("trxId");
    const type = searchParams.get("type");

    if (type === "email-logs") {
      // Return simulated email outbox logs
      const logsPath = path.join(process.cwd(), "public", "uploads", "email-logs.json");
      try {
        const fileContent = await readFile(logsPath, "utf-8");
        return NextResponse.json(JSON.parse(fileContent));
      } catch (err) {
        // Return empty list if no logs exist yet
        return NextResponse.json([]);
      }
    }

    if (trxId) {
      // Client polling - check specific order status
      const order = await prisma.order.findUnique({
        where: { trxId: trxId.toUpperCase() }
      });
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // Admin console - list all orders
    const orders = await prisma.order.findMany({
      orderBy: { id: "desc" }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error reading orders:", error);
    return NextResponse.json({ error: "Failed to read orders." }, { status: 500 });
  }
}

// POST: Create a new pending checkout transaction order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, clientEmail, whatsappNumber, productTitle, price, paymentMethod, trxId } = body;

    if (!clientName || !clientPhone || !clientEmail || !whatsappNumber || !productTitle || !price || !paymentMethod || !trxId) {
      return NextResponse.json({ error: "Missing required checkout parameters." }, { status: 400 });
    }

    // Check if TrxID already exists to prevent duplicate checks
    const existing = await prisma.order.findUnique({
      where: { trxId: trxId.toUpperCase() }
    });
    if (existing) {
      return NextResponse.json({ error: "This Transaction ID has already been submitted." }, { status: 409 });
    }

    const newOrder = await prisma.order.create({
      data: {
        clientName,
        clientPhone,
        clientEmail,
        whatsappNumber,
        productTitle,
        price: parseFloat(price) || 0,
        paymentMethod,
        trxId: trxId.toUpperCase(),
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to submit checkout order." }, { status: 500 });
  }
}

// PATCH: Update order status (Approve or Reject by Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or status value." }, { status: 400 });
    }

    if (status !== "APPROVED" && status !== "REJECTED" && status !== "PENDING") {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // Generate simulated HTML email if status transitions to APPROVED
    if (status === "APPROVED") {
      try {
        // Fetch product to resolve downloadable PDF url
        const product = await prisma.product.findFirst({
          where: { title: updated.productTitle }
        });
        const downloadLink = product ? product.pdfUrl : `/uploads/manual-delivery-required`;

        // Styled HTML body aligning with warm-cream / brand-red branding
        const htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 40px; background-color: #f6f3ee; border-radius: 28px; border: 1px solid #e2e8f0; color: #1f2937;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
              <h2 style="font-family: Georgia, serif; color: #ea3f40; margin: 0; font-size: 26px; font-weight: 900;">Antor Creative Studio</h2>
              <p style="font-size: 9px; text-transform: uppercase; letter-spacing: 3px; color: #9ca3af; font-weight: bold; margin-top: 8px; margin-bottom: 0; font-family: monospace;">Digital Outbox Delivery</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 35px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.015); border: 1px solid #f1f5f9;">
              <h3 style="margin-top: 0; color: #111827; font-family: Georgia, serif; font-size: 20px;">Payment Verified Successfully! 🎉</h3>
              <p style="line-height: 1.6; font-size: 14px;">Dear <strong>${updated.clientName}</strong>,</p>
              <p style="line-height: 1.6; font-size: 14px;">Thank you for ordering with us. Your checkout transaction (TrxID: <code style="background-color: #f1f5f9; padding: 3px 6px; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: bold; color: #ea3f40;">${updated.trxId}</code>) submitted via <strong>${updated.paymentMethod.toUpperCase()}</strong> has been approved.</p>
              
              <div style="background-color: #faf9f6; border: 1px dashed #c2b59b; padding: 20px; border-radius: 14px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Resource:</strong> <span style="color: #111827; font-weight: bold;">${updated.productTitle}</span></p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #4b5563;"><strong>Price Paid:</strong> <span style="color: #ea3f40; font-weight: bold; font-family: monospace;">৳${updated.price}</span></p>
              </div>

              <p style="margin-bottom: 30px; line-height: 1.6; font-size: 14px;">You can instantly access and download your premium PDF guide using the secure button below:</p>
              
              <div style="text-align: center;">
                <a href="${downloadLink}" download style="display: inline-block; background-color: #ea3f40; color: #ffffff; text-decoration: none; font-weight: bold; padding: 16px 36px; border-radius: 14px; font-size: 14px; box-shadow: 0 6px 20px rgba(234,63,64,0.3); transition: all 0.3s;">Download PDF File</a>
              </div>
              
              <p style="font-size: 10px; color: #9ca3af; text-align: center; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-family: monospace;">Secure transaction validated by AntorStudio Admin Console.</p>
            </div>
          </div>
        `;

        // Save simulated mail outbox log
        const logsPath = path.join(process.cwd(), "public", "uploads", "email-logs.json");
        let currentLogs: any[] = [];
        try {
          const content = await readFile(logsPath, "utf-8");
          currentLogs = JSON.parse(content);
        } catch (err) {
          // ignore - logs file doesn't exist yet
        }

        const newLog = {
          id: Math.random().toString(36).substring(2, 9),
          to: updated.clientEmail,
          subject: "Your Unlocked Creative PDF Resource is Ready! 📚",
          clientName: updated.clientName,
          productTitle: updated.productTitle,
          trxId: updated.trxId,
          sentAt: new Date().toISOString(),
          html: htmlContent
        };

        currentLogs.unshift(newLog); // Put new email at top of list
        await writeFile(logsPath, JSON.stringify(currentLogs, null, 2), "utf-8");
        console.log(`[Email Simulator] Success! Simulated validation email sent to ${updated.clientEmail} for product "${updated.productTitle}"`);
      } catch (err) {
        console.error("Failed to run mock outbound email logger:", err);
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Failed to update order status." }, { status: 500 });
  }
}
