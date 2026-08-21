import { Braces, Server, Database, Smartphone, Bot, LayoutTemplate } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useTranslations } from "next-intl";
import { MetaBlock } from "@/components/bio/MetaBlock";

const items: {
  key: "frontend" | "python" | "node" | "database" | "ai" | "mobile";
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { key: "frontend", Icon: LayoutTemplate },
  { key: "python", Icon: Braces },
  { key: "node", Icon: Server },
  { key: "database", Icon: Database },
  { key: "ai", Icon: Bot },
  { key: "mobile", Icon: Smartphone },
];

export function TechStack() {
  const t = useTranslations("stack");

  return (
    <MetaBlock label={t("label")}>
      <ul className="flex flex-wrap items-center justify-center gap-8 md:justify-start">
        {items.map(({ key, Icon }) => (
          <li
            key={key}
            className="flex items-center gap-8 rounded-full border border-steel px-10 py-6 font-inter text-[14px] text-bone"
          >
            {/* Explicit px: `h-4` resolves to 4px here — the design.md spacing
                tokens override Tailwind's size scale. */}
            <Icon className="h-[14px] w-[14px] shrink-0 text-steel" />
            {t(key)}
          </li>
        ))}
      </ul>
    </MetaBlock>
  );
}
