import type { MetadataRoute } from "next";
import { siteName } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — Epidemiologia e saúde coletiva`,
    short_name: siteName,
    start_url: "/pt",
    display: "standalone",
    background_color: "#05080d",
    theme_color: "#05080d",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
