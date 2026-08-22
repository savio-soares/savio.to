import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Savio Soares";

// One image per locale, baked at build time — no font fetch or render work
// happens on a live request.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const fonts = join(process.cwd(), "assets/fonts");
  const [playfair, inter] = await Promise.all([
    readFile(join(fonts, "PlayfairDisplay-Italic-700.ttf")),
    readFile(join(fonts, "Inter-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#05080d",
          padding: "0 96px",
          // design.md forbids drop shadows for elevation; the hairline border
          // is the system's way of framing a surface.
          border: "1px solid #131d2c",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            // Copper is the only chromatic note, reserved for category labels.
            color: "#cc9166",
          }}
        >
          {t("ogEyebrow")}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair",
            fontStyle: "italic",
            fontSize: 128,
            color: "#ffffff",
            marginTop: 28,
          }}
        >
          Savio Soares
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 34,
            color: "#c5cbd3",
            marginTop: 24,
          }}
        >
          {t("ogSubtitle")}
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 1,
            background: "#374962",
            marginTop: 48,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: playfair, style: "italic", weight: 700 },
        { name: "Inter", data: inter, style: "normal", weight: 400 },
      ],
    },
  );
}
