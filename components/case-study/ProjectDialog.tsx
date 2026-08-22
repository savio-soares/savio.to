"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { ProjectMock } from "./ProjectMock";
import type { Project } from "@/content/types";

/**
 * Full case study, opened from a card in the wall.
 *
 * It keeps rendering for one beat after `project` goes null so the closing
 * transition can play — hence the local `shown`/`leaving` pair rather than
 * driving visibility straight off the prop.
 */
export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const t = useTranslations("projects");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Held so the dialog can finish its exit with content still on screen.
  const [visible, setVisible] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setVisible(project);
      // Next frame, so the panel mounts at its "closed" transform and then
      // transitions — mounting straight into the open state would skip it.
      const frame = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(frame);
    }
    setOpen(false);
    const timer = setTimeout(() => setVisible(null), 320);
    return () => clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    // `visible` as well as `project`: on the commit where the prop arrives the
    // panel has not mounted yet, so closeRef would still be null.
    if (!project || !visible) return;

    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep Tab inside the panel — behind it sits the whole page.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [project, visible, onClose]);

  if (!visible) return null;

  const key = (field: string) => "items." + visible.slug + "." + field;
  const title = t(key("title"));
  const body = t.raw(key("body")) as string[];

  const meta = [
    { label: t("detail.role"), value: t(key("role")) },
    { label: t("detail.client"), value: t(key("org")) },
    { label: t("detail.year"), value: visible.year },
  ];

  return (
    <div
      className={
        "project-overlay fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-16 md:p-24 " +
        (open ? "is-open" : "")
      }
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="project-panel no-scrollbar relative my-auto max-h-[92svh] w-full max-w-[1040px] overflow-y-auto rounded-lg border border-graphite bg-onyx"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("detail.close")}
          className="absolute top-16 right-16 z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full border border-slate bg-carbon/80 text-silver backdrop-blur-md transition-colors hover:border-paper-white hover:text-paper-white"
        >
          <X className="h-[18px] w-[18px]" aria-hidden />
        </button>

        {/* Hero plate. The mock is drawn at a wider crop here than on the card,
            so the dialog does not just look like a magnified thumbnail. */}
        <div className="relative aspect-4/3 w-full overflow-hidden border-b border-graphite bg-carbon md:aspect-video">
          {visible.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={visible.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <ProjectMock slug={visible.slug} kind={visible.mock} />
          )}
        </div>

        <div className="grid gap-32 p-24 md:grid-cols-[220px_1fr] md:gap-48 md:p-48">
          <div className="flex flex-col gap-24">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-4">
                <p className="font-inter text-eyebrow leading-eyebrow tracking-eyebrow font-semibold text-copper">
                  {item.label}
                </p>
                <p className="font-inter text-body-xs leading-body-xs text-bone">
                  {item.value}
                </p>
              </div>
            ))}
            {visible.link ? (
              <a
                href={visible.link}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-8 rounded-full border border-paper-white px-20 py-10 font-inter text-ui-sm font-medium text-paper-white transition-colors hover:bg-paper-white hover:text-obsidian"
              >
                {t("detail.link")}
                <span aria-hidden>↗</span>
              </a>
            ) : null}
          </div>

          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-12">
              <h3 className="font-inter text-body-xs leading-body-xs font-medium text-fog">
                {title}
              </h3>
              {/* The serif carries the thesis line — never the running copy
                  below it (design.md § Do's and Don'ts). */}
              <p className="font-ivy-presto text-heading-sm leading-heading tracking-heading-sm text-paper-white">
                {t(key("summary"))}
              </p>
            </div>
            {body.map((paragraph, i) => (
              <p
                key={i}
                className="font-inter text-body-xs leading-body-xs text-bone"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
