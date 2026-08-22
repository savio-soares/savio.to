import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // The negative lookahead lists every path that must NOT be locale-prefixed.
  // `.*\..*` covers anything with an extension (sitemap.xml, robots.txt,
  // manifest.webmanifest, images), but Next's generated metadata routes are
  // extensionless — without naming them here the proxy 307s `/icon` to
  // `/pt/icon`, which does not exist, and the site ships with no favicon.
  matcher: [
    "/((?!api|_next|_vercel|icon|apple-icon|opengraph-image|twitter-image|.*\..*).*)",
  ],
};
