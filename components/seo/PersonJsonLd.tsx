import { getTranslations } from "next-intl/server";
import { sameAs, siteName, siteUrl } from "@/content/site";

/**
 * Person + WebSite structured data.
 *
 * This is what lets Google resolve the site to a person rather than a bag of
 * words — it is the difference between ranking for "savio soares" and being
 * understood as the epidemiologist in Palmas. `sameAs` is the strongest signal
 * in the block, and it is deliberately omitted while the profile URLs in
 * content/site.ts are still null.
 */
export async function PersonJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "seo" });

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: siteName,
    // The other strings people actually type. Google uses alternateName to
    // resolve short and domain-shaped queries ("savio", "savio to") to the
    // same entity as the full name.
    alternateName: ["Savio", "savio.to", "Savio Soares"],
    url: `${siteUrl}/${locale}`,
    jobTitle: t("jobTitle"),
    description: t("description"),
    image: `${siteUrl}/${locale}/opengraph-image`,
    knowsLanguage: ["pt-BR", "en", "es"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palmas",
      addressRegion: "TO",
      addressCountry: "BR",
    },
    worksFor: {
      "@type": "GovernmentOrganization",
      name: "Secretaria Municipal de Saúde de Palmas",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidade de Brasília",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        alternateName: "savio.to",
        inLanguage: locale === "pt" ? "pt-BR" : "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is not attacker-controlled here (every value is
      // a build-time constant), so this is safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
