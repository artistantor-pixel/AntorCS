import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Hire Me / Send Job Offer",
  description:
    "Invite Antor Kumar Biswas for full-time, hybrid, or remote Creative Designer, Brand Designer, Animator, or Visual Communicator roles, and download his CV.",
  path: "/hire",
});

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
