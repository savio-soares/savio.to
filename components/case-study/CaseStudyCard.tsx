"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ProjectMock } from "./ProjectMock";
import type { Project } from "@/content/types";

/**
 * Two independent motions stack on this card:
 *
 * 1. Focus — how close the card is to the centre of the wall. ProjectWall
 *    writes `--focus` (0…1) on the <article> every frame, so the card grows
 *    and brightens continuously as it glides past rather than snapping.
 * 2. Tilt — pointer-driven rotation on the inner plate. `--rx`/`--ry` are
 *    written on pointermove; the thumbnail and the caption sit at different
 *    translateZ depths, so they part slightly as the plate turns.
 *
 * Elevation never uses a drop shadow (see design.md § Elevation) — depth
 * comes from the surface step, a hairline border and the pointer sheen.
 */

const MAX_TILT = 9;

export function CaseStudyCard({
  project,
  onOpen,
  duplicate = false,
}: {
  project: Project;
  onOpen: (project: Project) => void;
  /** One of the loop's repeated copies — same pixels, hidden from the a11y
   *  tree so the wall is announced as one list of twelve, not thirty-six. */
  duplicate?: boolean;
}) {
  const t = useTranslations("projects");
  const plateRef = useRef<HTMLButtonElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const el = plateRef.current;
    // Coarse pointers get no tilt: on touch the transform would stick at
    // whatever angle the finger lifted at.
    if (!el || event.pointerType !== "mouse") return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--ry", ((x - 0.5) * 2 * MAX_TILT).toFixed(2) + "deg");
    el.style.setProperty("--rx", ((0.5 - y) * 2 * MAX_TILT).toFixed(2) + "deg");
    el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  };

  const resetTilt = () => {
    const el = plateRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const title = t("items." + project.slug + ".title");

  return (
    <article
      aria-hidden={duplicate || undefined}
      className="project-card flex w-[88vw] max-w-[442px] shrink-0 flex-col gap-16"
    >
      <button
        ref={plateRef}
        type="button"
        onClick={() => onOpen(project)}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
        data-cursor="card"
        aria-label={title}
        // Without this the copies would be focus stops inside an aria-hidden
        // subtree — the one combination screen readers cannot recover from.
        tabIndex={duplicate ? -1 : undefined}
        className="project-plate group flex flex-col gap-16 text-left outline-none focus-visible:ring-1 focus-visible:ring-paper-white"
      >
        {/* Explicit height, not an aspect ratio: the card was widened by 30%
            and an aspect ratio would have carried that into the height too,
            breaking the fit of the projects band in the viewport. These are
            the heights the old 340px/4-5 and 68vw/square cards resolved to. */}
        <div className="project-thumb relative h-[68vw] overflow-hidden rounded-lg border border-graphite bg-carbon md:h-[425px]">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ProjectMock slug={project.slug} kind={project.mock} />
          )}
          {/* Sheen tracks the pointer. soft-light keeps it a highlight on the
              existing surface rather than a white wash. */}
          <span aria-hidden className="project-sheen" />
        </div>
        <div className="project-caption flex flex-col gap-8">
          {/* Copper is reserved for category labels — see design.md. */}
          <p className="font-inter text-eyebrow leading-eyebrow tracking-eyebrow font-semibold text-copper">
            {t("items." + project.slug + ".category")}
          </p>
          <p className="flex items-center gap-8 font-ivy-presto italic text-subheading leading-subheading text-paper-white">
            {title}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-[3px]">
              ↗
            </span>
          </p>
        </div>
      </button>
    </article>
  );
}
