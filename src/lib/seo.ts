import type { Metadata } from "next";
import { headers } from "next/headers";
import { CONTACT_INFO } from "@/config/contact";

export function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** Resolves canonical site URL from env vars (safe in static & build contexts). */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const c of candidates) {
    if (c) {
      const normalized = normalizeBaseUrl(c);
      if (normalized) return normalized;
    }
  }
  return "https://antor.design";
}

/** Resolves the live request origin at runtime so sitemap.xml & robots.txt match whatever domain is connected. */
export async function getRequestSiteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host && !host.includes("localhost") && !host.startsWith("127.0.0.1")) {
      const proto = h.get("x-forwarded-proto") || "https";
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  } catch {
    // Fall back to environment variables outside a request context
  }
  return getSiteUrl();
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/antor-portrait.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${CONTACT_INFO.name}`,
      description,
      url: path,
      siteName: `${CONTACT_INFO.name} — Creative Portfolio`,
      type: "website",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${CONTACT_INFO.name}`,
      description,
      images: [image],
    },
  };
}
