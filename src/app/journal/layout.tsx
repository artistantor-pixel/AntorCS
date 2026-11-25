import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Journal, Thoughts & Creative Journey",
  description:
    "Personal essays, studio notes, and creative reflections by Antor Kumar Biswas on Fine Arts, visual storytelling, animation, and design thinking.",
  path: "/journal",
});

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
