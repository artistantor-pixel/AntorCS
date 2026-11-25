import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Core Expertise & Design Capabilities",
  description:
    "Brand identity, motion graphics, 2D/3D animation, digital illustration, UI/UX design, and creative direction capabilities of Antor Kumar Biswas.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
