import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

const DEFAULT_CONFIG = {
  brandingBase: 25000,
  brandingLogoExtra: 5000,
  brandingGuidelines: 10000,
  brandingSocial: 5000,
  brandingStationery: 3000,
  motionBase: 30000,
  motionDurationExtra: 5000,
  motionStyle3dExtra: 20000,
  motionVoiceover: 5000,
  motionSfx: 3000,
  uiuxBase: 40000,
  uiuxScreenExtra: 3000,
  uiuxPrototype: 10000,
  uiuxDesignSystem: 15000,
  uiuxResponsive: 10000,
  illustrationBase: 15000,
  illustrationExtra: 3000,
  illustrationCharacterDesign: 8000,
  illustrationStoryboard: 10000,
  illustrationVectorHandoff: 5000,
  creativeDirectionBase: 50000,
  creativeDirectionDayExtra: 10000,
  creativeDirection3dMapping: 25000,
  creativeDirectionPrintCollaterals: 15000,
  creativeDirectionCurationConsulting: 20000,
  timelineRushMultiplier: 1.3
};

export async function GET() {
  try {
    const configRecord = await prisma.content.findUnique({
      where: { id: "calculator" }
    });

    if (!configRecord) {
      return NextResponse.json(DEFAULT_CONFIG);
    }

    return NextResponse.json(configRecord.data);
  } catch (error) {
    console.error("Error reading calculator config:", error);
    return NextResponse.json(DEFAULT_CONFIG); // Graceful fallback
  }
}

export async function POST(request: Request) {
  try {
    const newConfig = await request.json();

    await prisma.content.upsert({
      where: { id: "calculator" },
      update: { data: newConfig },
      create: { id: "calculator", data: newConfig }
    });

    return NextResponse.json({ success: true, message: "Estimator prices updated successfully." });
  } catch (error) {
    console.error("Error saving calculator config:", error);
    return NextResponse.json({ error: "Failed to save prices." }, { status: 500 });
  }
}
