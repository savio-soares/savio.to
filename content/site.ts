/**
 * Single source of truth for everything the search engines and social
 * crawlers read: canonical origin, identity, and the profile URLs that feed
 * the JSON-LD `sameAs` graph.
 *
 * Keeping the profile links here (rather than inline in SocialLinks) means the
 * rendered links and the structured data can never drift apart — Google treats
 * a `sameAs` pointing somewhere the page doesn't actually link as a weak
 * signal, and vice versa.
 */

// The canonical origin. Overridable so preview deploys don't advertise
// themselves as savio.to and compete for the same index entry.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://savio.to"
).replace(/\/$/, "");

export const siteName = "Savio Soares";

/**
 * Profile URLs used for both the rendered social row and JSON-LD `sameAs`.
 *
 * A `null` here removes the icon from the page AND drops the entry from
 * `sameAs` — the two can never disagree. Keep it `null` rather than pointing at
 * a bare domain: `https://github.com/` in `sameAs` tells Google the site
 * belongs to GitHub-the-company, which is worse than claiming nothing.
 */
export const profiles: { lattes: string | null; github: string | null; instagram: string | null } = {
  // CNPq's Lattes is offline; add the permalink once it is reachable again.
  lattes: null,
  github: "https://github.com/savio-soares",
  // Canonical form: instagram.com/... 301s here, and sameAs should name the
  // final URL rather than send the crawler through a redirect.
  instagram: "https://www.instagram.com/savisoares",
};

/** Only the profiles actually filled in, in a shape ready for JSON-LD. */
export const sameAs = Object.values(profiles).filter(
  (url): url is string => typeof url === "string" && url.length > 0,
);

export const email = "savisoares@gmail.com";
