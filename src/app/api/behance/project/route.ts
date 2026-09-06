import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600;

/**
 * Fetches Behance project details using the oEmbed API (public, no auth needed).
 * Usage: GET /api/behance/project?id=241729721
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("id");

  if (!projectId) {
    return NextResponse.json({ error: "Missing project id" }, { status: 400 });
  }

  const projectUrl = `https://www.behance.net/gallery/${projectId}/`;

  try {
    // Use Behance oEmbed API — public, no auth, not rate-limited
    const oembedUrl = `https://www.behance.net/oembed?url=${encodeURIComponent(projectUrl)}`;
    const response = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AnitorCSWebsite/1.0)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`oEmbed fetch failed: ${response.status}`);
    }

    const data = await response.json();

    // Extract thumbnail and embed HTML
    const thumbnail = data.thumbnail_url
      ? `/api/image-proxy?url=${encodeURIComponent(data.thumbnail_url)}`
      : null;

    return NextResponse.json(
      {
        projectId,
        title: data.title || "",
        authorName: data.author_name || "",
        thumbnail,
        thumbnailRaw: data.thumbnail_url || null,
        embedHtml: data.html || null,
        projectUrl,
        images: thumbnail ? [thumbnail] : [],
        imageCount: thumbnail ? 1 : 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Behance oEmbed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project", images: [], imageCount: 0, projectUrl },
      { status: 500 }
    );
  }
}
