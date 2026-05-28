import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();
const localesDir = path.join(process.cwd(), "src", "locales");

export async function GET() {
  try {
    let contentRec = await prisma.content.findUnique({ where: { id: "locales" } });
    
    if (!contentRec) {
      // Auto-seed from JSON if DB is empty
      const enPath = path.join(localesDir, "en.json");
      const bnPath = path.join(localesDir, "bn.json");
      const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
      const bnData = JSON.parse(fs.readFileSync(bnPath, "utf8"));
      
      contentRec = await prisma.content.create({
        data: {
          id: "locales",
          data: { en: enData, bn: bnData }
        }
      });
    }

    return NextResponse.json(contentRec.data);
  } catch (error) {
    console.error("Error reading locales from DB:", error);
    return NextResponse.json({ error: "Failed to read content." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { en, bn } = await request.json();

    if (!en || !bn) {
      return NextResponse.json({ error: "Missing en or bn data." }, { status: 400 });
    }

    await prisma.content.upsert({
      where: { id: "locales" },
      update: { data: { en, bn } },
      create: { id: "locales", data: { en, bn } }
    });

    return NextResponse.json({ success: true, message: "Content updated successfully." });
  } catch (error) {
    console.error("Error writing locales to DB:", error);
    return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
  }
}
