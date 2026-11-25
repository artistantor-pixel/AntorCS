import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Antor Kumar Biswas — Creative Designer & Animator",
    short_name: "Antor Biswas",
    description:
      "Portfolio & CV of Antor Kumar Biswas — Creative Designer, Brand Identity Strategist, and 2D/3D Animator (University of Dhaka).",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#ea3f40",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
