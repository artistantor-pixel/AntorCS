import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "antor-revalidate-2026";

/**
 * On-demand revalidation webhook.
 * Call this after uploading a new project to Behance to instantly update the website.
 *
 * Usage:
 *   POST /api/revalidate
 *   Header: x-revalidate-secret: antor-revalidate-2026
 *
 * Or via URL param:
 *   POST /api/revalidate?secret=antor-revalidate-2026
 */
export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-revalidate-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate the portfolio page and Behance API
    revalidatePath("/portfolio");
    revalidatePath("/api/behance");
    revalidateTag("behance");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: "Portfolio revalidated! New Behance projects will appear now.",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Also support GET for easy browser testing
export async function GET(request: NextRequest) {
  return POST(request);
}
