import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Each locale is its own entry and declares the others as alternates, which
  // is the sitemap-side half of the hreflang contract set in the layout.
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: {
      languages: {
        "pt-BR": `${siteUrl}/pt`,
        en: `${siteUrl}/en`,
      },
    },
  }));
}
