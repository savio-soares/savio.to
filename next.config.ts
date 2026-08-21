import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Pin the workspace root: an unrelated package-lock.json in the parent
  // user directory would otherwise confuse Turbopack's root inference.
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
