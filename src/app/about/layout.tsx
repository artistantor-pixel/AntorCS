import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About & CV",
  description:
    "Background, BFA in Graphic Design (University of Dhaka), awards, 2D/3D animation experience, and downloadable CV of Antor Kumar Biswas.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
