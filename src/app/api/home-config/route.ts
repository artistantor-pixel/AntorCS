import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "src", "config", "homeSections.json");

function getConfig() {
  if (!fs.existsSync(configPath)) {
    // Default config if file missing
    const defaultConfig = [
      { id: "hero",         enabled: true, order: 1 },
      { id: "socialProof",  enabled: true, order: 2 },
      { id: "features",     enabled: true, order: 3 },
      { id: "services",     enabled: true, order: 4 },
      { id: "experience",   enabled: true, order: 5 },
      { id: "process",      enabled: true, order: 6 },
      { id: "testimonials", enabled: true, order: 7 },
      { id: "faqs",         enabled: true, order: 8 },
      { id: "cta",          enabled: true, order: 9 },
      { id: "footer",       enabled: true, order: 10 },
    ];
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf-8");
    return defaultConfig;
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json(config);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
