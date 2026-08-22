"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { ProjectMock } from "@/components/case-study/ProjectMock";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";

// TODO: replace with the real contact address
const CONTACT_EMAIL = "hello@savio.to";

const FEATURED = 3;

/**
 * The panel behind the nav's menu button: a peek at the latest work plus the
 * few destinations the site has. Anchored to the pill rather than centred, so
 * it reads as belonging to the control that opened it.
 */
export function NavMenu({
  open,
  onClose,
  contracted,
}: {
  open: boolean;
  onClose: () => void;
  contracted: boolean;
}) {
  const t = useTranslations("menu");
  const tProjects = useTranslations("projects");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  const featured: Project[] = projects.slice(0, FEATURED);
  const current = featured[slide];

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // Pointerdown, not click: a click that starts inside the panel and ends
    // outside it (a drag on the carousel) should not close the menu.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        // The toggle button handles its own close; ignore it here so the two
        // do not cancel each other out.
        if (!(target instanceof Element && target.closest("[data-menu-toggle]"))) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label={tNav("menu")}
      className={
        "nav-menu absolute top-[calc(100%+12px)] z-30 flex w-[320px] max-w-[calc(100vw-48px)] flex-col gap-16 rounded-lg border border-slate bg-carbon/95 p-16 backdrop-blur-md " +
        // Contracted, the pill hugs the left edge and the panel hangs from it;
        // at rest the pill is centred and so is the panel.
        (contracted ? "left-0" : "left-1/2 -translate-x-1/2")
      }
    >
      <div className="flex items-center justify-between">
        <p className="font-ivy-presto text-body-sm leading-body-sm text-paper-white">
          {tNav("brand")}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="tap [--tap:10px] flex h-[28px] w-[28px] items-center justify-center rounded-full text-fog transition-colors hover:text-paper-white"
        >
          <X className="h-[16px] w-[16px]" aria-hidden />
        </button>
      </div>

      <p className="text-center font-inter text-ui-xs font-medium text-fog">
        {t("latest")}
      </p>

      {/* Single visible slide rather than a scroll track: at this width a
          partially visible neighbour reads as a layout bug, not as an
          affordance. */}
      <div className="flex flex-col gap-12">
        <div className="aspect-4/3 w-full overflow-hidden rounded-lg border border-graphite bg-obsidian">
          <ProjectMock slug={current.slug} kind={current.mock} />
        </div>
        <div className="flex flex-col gap-4 text-center">
          <p className="font-ivy-presto italic text-body-sm leading-body-sm text-paper-white">
            {tProjects("items." + current.slug + ".title")}
          </p>
          <p className="font-inter text-ui-xs leading-body-xs text-fog">
            {tProjects("items." + current.slug + ".category")}
          </p>
        </div>
        {/* gap-12, up from 8: the dots are 6px tall, so they need the most
            reach of anything here and the gap has to make room for it. */}
        <div className="flex items-center justify-center gap-12">
          {featured.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={tProjects("items." + project.slug + ".title")}
              aria-current={i === slide}
              className={
                "tap [--tap:6px] h-[6px] rounded-full transition-all duration-300 " +
                (i === slide ? "w-[18px] bg-paper-white" : "w-[6px] bg-smoke")
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <a
          href="#projetos"
          onClick={onClose}
          className="flex items-center justify-center rounded-full border border-slate bg-graphite/60 px-20 py-12 font-inter text-ui-sm font-medium text-bone transition-colors hover:border-paper-white hover:text-paper-white"
        >
          {t("archive")}
        </a>
        <div className="grid grid-cols-2 gap-8">
          <a
            href="#top"
            onClick={onClose}
            className="flex items-center justify-center rounded-full border border-slate bg-graphite/60 px-16 py-12 font-inter text-ui-sm font-medium text-bone transition-colors hover:border-paper-white hover:text-paper-white"
          >
            {t("about")}
          </a>
          <a
            href={"mailto:" + CONTACT_EMAIL}
            className="flex items-center justify-center rounded-full border border-slate bg-graphite/60 px-16 py-12 font-inter text-ui-sm font-medium text-bone transition-colors hover:border-paper-white hover:text-paper-white"
          >
            {t("email")}
          </a>
        </div>
      </div>

      {/* Language, not theme: the site is dark by design, so a theme toggle
          would be a switch with one position. */}
      <div className="flex items-center justify-between border-t border-graphite pt-12">
        <p className="font-inter text-ui-2xs text-ash">{t("footnote")}</p>
        <div className="flex items-center gap-8">
          {routing.locales.map((option) => (
            <Link
              key={option}
              href={pathname}
              locale={option}
              onClick={onClose}
              aria-current={option === locale}
              className={
                "tap [--tap:4px] rounded-full px-10 py-6 font-inter text-ui-2xs font-medium uppercase transition-colors " +
                (option === locale ? "text-paper-white" : "text-ash hover:text-fog")
              }
            >
              {option}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
