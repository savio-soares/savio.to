import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CursorLight } from "@/components/cursor/CursorLight";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { siteName, siteUrl } from "@/content/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter-google",
});

// Substitute for the licensed Ivy Presto typeface (see design.md).
// Swap for `next/font/local` pointing at real Ivy Presto files later,
// keeping the same `variable: "--font-display"` binding.
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// Search engines want one canonical URL per locale plus a reciprocal hreflang
// map. `x-default` points at pt because that is `routing.defaultLocale` — the
// locale `/` redirects to.
function alternatesFor(locale: string) {
  return {
    canonical: `${siteUrl}/${locale}`,
    languages: {
      "pt-BR": `${siteUrl}/pt`,
      en: `${siteUrl}/en`,
      "x-default": `${siteUrl}/${routing.defaultLocale}`,
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  // The name alone. Google weighs the title heavily for a name query, and
  // every word added to it dilutes the match; the topic terms still reach
  // the index through the description, the h1 and the JSON-LD below.
  const title = t("title");
  const description = t("description");

  return {
    // Makes every relative URL below (og:image, canonical) resolve to an
    // absolute one, which is what crawlers require.
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: t("titleTemplate"),
    },
    description,
    keywords: t.raw("keywords") as string[],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    alternates: alternatesFor(locale),
    openGraph: {
      type: "profile",
      siteName,
      title,
      description,
      url: `${siteUrl}/${locale}`,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      alternateLocale: locale === "pt" ? ["en_US"] : ["pt_BR"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        // Without these Google may show only a thumbnail-sized image and a
        // truncated snippet for the site.
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Fill in after claiming the property in Google Search Console, if you
    // choose the HTML-tag verification method over the DNS one.
    // verification: { google: "..." },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opts the locale tree into static rendering: without it every request is
  // server-rendered on demand, which slows first paint and gives crawlers a
  // worse time for a site whose content never changes per request.
  setRequestLocale(locale);

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : locale}
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PersonJsonLd locale={locale} />
        <CursorLight />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
