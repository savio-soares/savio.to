import { GraduationCap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useTranslations } from "next-intl";
import { profiles } from "@/content/site";

// Thin-line outline marks — lucide-react dropped brand/logo icons, so
// GitHub and Instagram are hand-drawn to match the design system's stroke style.
function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

// Icons in display order. The URLs come from content/site.ts, which also feeds
// the JSON-LD `sameAs`, so the links a visitor can click and the profiles the
// site claims to own are the same list by construction.
const icons: Record<"lattes" | "github" | "instagram", ComponentType<SVGProps<SVGSVGElement>>> = {
  lattes: GraduationCap,
  github: GithubIcon,
  instagram: InstagramIcon,
};

const order = ["lattes", "github", "instagram"] as const;

export function SocialLinks() {
  const t = useTranslations("social");

  // A profile with no URL yet is dropped rather than linked somewhere generic.
  const links = order
    .map((key) => ({ key, href: profiles[key], Icon: icons[key] }))
    .filter((link): link is { key: typeof order[number]; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> } =>
      typeof link.href === "string" && link.href.length > 0,
    );

  return (
    <div className="flex items-center justify-center gap-20 sm:gap-16">
      {links.map(({ key, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={t(key)}
          // The well halves on phones, but the tap region must not: --tap grows
          // to 9px there so the 26px circle still presents a 44px target, and
          // the gap widens to 20px so those regions stay clear of each other.
          // From sm the design.md 46px well and 6px reach come back.
          className="tap [--tap:9px] sm:[--tap:6px] flex h-[26px] w-[26px] sm:h-[46px] sm:w-[46px] items-center justify-center rounded-full border border-smoke bg-carbon text-silver transition-colors hover:border-paper-white hover:text-paper-white"
        >
          {/* Explicit px: `h-4` resolves to 4px here — the design.md spacing
              tokens override Tailwind's size scale. */}
          <Icon className="h-[13px] w-[13px] sm:h-[20px] sm:w-[20px]" />
        </a>
      ))}
    </div>
  );
}
