import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy route to bypass Behance CDN hotlink protection.
 * Usage: /api/image-proxy?url=https://mir-s3-cdn-cf.behance.net/...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow Behance CDN domains for security
  const allowedDomains = [
    "mir-s3-cdn-cf.behance.net",
    "mir-cdn.behance.net",
    "www.behance.net",
    "behance.net",
  ];

  try {
    const urlObj = new URL(imageUrl);
    const isAllowed = allowedDomains.some((domain) =>
      urlObj.hostname.endsWith(domain)
    );

    if (!isAllowed) {
      return new NextResponse("Domain not allowed", { status: 403 });
    }
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        // Pretend to be a browser visiting Behance directly
        "Referer": "https://www.behance.net/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 86400 }, // Cache proxy images for 24h
    });

    if (!response.ok) {
      return new NextResponse(`Image fetch failed: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
