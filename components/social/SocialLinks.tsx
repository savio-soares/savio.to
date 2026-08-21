import { GraduationCap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useTranslations } from "next-intl";

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

// TODO: replace with the real profile URLs
const links: { key: "lattes" | "github" | "instagram"; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "lattes", href: "http://lattes.cnpq.br/", Icon: GraduationCap },
  { key: "github", href: "https://github.com/", Icon: GithubIcon },
  { key: "instagram", href: "https://instagram.com/", Icon: InstagramIcon },
];

export function SocialLinks() {
  const t = useTranslations("social");

  return (
    <div className="flex items-center justify-center gap-16">
      {links.map(({ key, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={t(key)}
          // 6px reach against a 16px gap, so the three regions stay clear of
          // one another with room to spare.
          className="tap [--tap:6px] flex h-[46px] w-[46px] items-center justify-center rounded-full border border-smoke bg-carbon text-silver transition-colors hover:border-paper-white hover:text-paper-white"
        >
          {/* Explicit px: `h-4` resolves to 4px here — the design.md spacing
              tokens override Tailwind's size scale. */}
          <Icon className="h-[20px] w-[20px]" />
        </a>
      ))}
    </div>
  );
}
