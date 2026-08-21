"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CaseStudyCard } from "./CaseStudyCard";
import { ProjectDialog } from "./ProjectDialog";
import { TagList } from "@/components/tags/TagList";
import { useScrollProgress } from "@/components/scroll/scroll-progress";
import type { Project } from "@/content/types";

/**
 * Copies of the list laid end to end. Three is the minimum that lets the row
 * be re-centred on the middle copy without ever exposing an edge: whichever
 * way you are heading, a full list is already rendered ahead of you.
 */
const COPIES = 3;

export function ProjectWall({
  projects,
  tags,
  prevLabel,
  nextLabel,
}: {
  projects: Project[];
  tags: string[];
  prevLabel: string;
  nextLabel: string;
}) {
  const shared = useScrollProgress();
  const local = useRef(0);
  // The docked globe reads this; fall back to a local ref if unprovided.
  const progress = shared ?? local;
  const rowRef = useRef<HTMLDivElement>(null);
  // Set by the effect so the buttons can drive the same motion the wheel uses.
  const stepRef = useRef<((direction: number) => void) | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  // Read by the animation frame, which must not be torn down and rebuilt every
  // time the dialog opens.
  const pausedRef = useRef(false);
  pausedRef.current = active !== null;

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // How close each card sits to the centre of the row, as 0…1. Written as a
    // CSS var the card scales and fades from, so the growth is continuous
    // rather than the on/off an IntersectionObserver would give.
    //
    // offsetLeft/offsetWidth, never getBoundingClientRect: the rect already
    // includes the scale this value produces, which would feed back on itself.
    const paintFocus = () => {
      const centre = el.clientWidth / 2;
      for (const node of el.children) {
        const card = node as HTMLElement;
        const cardCentre = card.offsetLeft + card.offsetWidth / 2 - el.scrollLeft;
        const falloff = card.offsetWidth * 1.25;
        const focus = Math.max(0, 1 - Math.abs(cardCentre - centre) / falloff);
        // Ease the ramp so the middle of the row stays near full size and the
        // fade concentrates at the edges.
        card.style.setProperty("--focus", (focus * focus * (3 - 2 * focus)).toFixed(3));
      }
    };

    // The position the row eases toward. Wheel notches and button clicks push
    // it; easing toward a target is what turns a discrete ~100px notch into
    // continuous motion.
    let target = el.scrollLeft;
    let frame = 0;
    let gliding = false;
    // The last scrollLeft this component wrote, so a touch drag or a focus
    // jump can be told apart from its own writes.
    let written = -1;

    // Width of one copy of the list. Read live rather than cached: the cards
    // are viewport-relative, so this changes on every resize.
    const copyWidth = () => el.scrollWidth / COPIES;

    // Keeps the row parked on the middle copy. Because `target` is shifted by
    // the same amount, motion carries straight through the seam — the jump is
    // invisible, since the copy it lands on is pixel-identical.
    const wrap = () => {
      const copy = copyWidth();
      if (copy <= 0) return;
      if (el.scrollLeft >= copy * 2) {
        el.scrollLeft -= copy;
        target -= copy;
      } else if (el.scrollLeft < copy) {
        el.scrollLeft += copy;
        target += copy;
      }
    };

    const sync = () => {
      wrap();
      const copy = copyWidth();
      // Position within one copy, so the docked globe keeps turning at a
      // constant rate instead of pinning at 1 once the list has looped.
      progress.current = copy > 0 ? (((el.scrollLeft - copy) / copy) % 1 + 1) % 1 : 0;
      paintFocus();
      written = el.scrollLeft;
    };

    const glide = () => {
      const delta = target - el.scrollLeft;
      if (Math.abs(delta) < 0.5) {
        el.scrollLeft = target;
        gliding = false;
        sync();
        return;
      }
      el.scrollLeft += delta * 0.12;
      sync();
      frame = requestAnimationFrame(glide);
    };

    // No clamping: the row loops, so there is no end to stop at. `wrap` keeps
    // both the target and the live position inside the middle copy.
    const moveBy = (amount: number) => {
      target += amount;
      if (!gliding) {
        gliding = true;
        frame = requestAnimationFrame(glide);
      }
    };

    // One card plus its gap, so a click always lands on a fresh card rather
    // than leaving a sliver of the previous one.
    stepRef.current = (direction) => {
      const card = el.firstElementChild as HTMLElement | null;
      const stride = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
      moveBy(direction * stride);
    };

    // The wall only takes the wheel once the page itself has nowhere left to
    // go. Gating on the band merely being visible meant the takeover could
    // happen mid-scroll, freezing the page with the section half-framed — the
    // user ends up stuck partway with the layout out of register. Letting the
    // page finish means the band is always fully composed before the cards
    // start moving, and the handover has an unambiguous trigger.
    const atPageEnd = () => {
      const doc = document.documentElement;
      // A couple of pixels of tolerance: fractional device pixels and browser
      // rounding mean the sum rarely lands exactly on scrollHeight.
      return window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
    };

    // On the window, not the row: the wheel drives the wall from anywhere on
    // the page, so the pointer no longer has to be parked on a card.
    const onWheel = (event: WheelEvent) => {
      if (pausedRef.current || !atPageEnd()) return;
      // Trackpad horizontal gestures already scroll the row natively.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      // Downward drives the wall; upward is always handed back to the page.
      // The row loops, so it has no end of its own to release the gesture at —
      // without this the band would be a trap with no way back to the bio.
      if (event.deltaY < 0) return;


      event.preventDefault();
      moveBy(event.deltaY);
    };

    const onScroll = () => {
      // Only react to scrolls this component did not cause; otherwise a glide
      // would re-sync twice per frame and a touch drag would fight the target.
      if (Math.abs(el.scrollLeft - written) <= 1) return;
      target = el.scrollLeft;
      sync();
    };

    // Card width is viewport-relative, so a resize changes both the focus
    // falloff and the copy width — the latter can leave the row parked
    // outside the middle copy, so this runs the full sync, not just repaint.
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(el);

    // Start on the middle copy so there is already a full list to travel
    // through in either direction.
    el.scrollLeft = copyWidth();
    target = el.scrollLeft;
    sync();

    window.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      stepRef.current = null;
      window.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
    };
  }, [progress]);

  return (
    <div className="flex flex-col gap-16">
      {/* Three columns from md, same trick ProjectsHeading uses: an empty
          first cell puts the tags on the true page centre, which a
          justify-between row would offset by half the arrow group's width. */}
      <div className="flex flex-col items-center gap-12 px-24 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-16">
        <div aria-hidden className="hidden md:block" />
        <TagList tags={tags} />
        <div className="flex shrink-0 gap-8 md:justify-self-end">
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => stepRef.current?.(-1)}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-smoke text-silver transition-colors hover:border-paper-white hover:text-paper-white"
          >
            <ChevronLeft className="h-[18px] w-[18px]" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => stepRef.current?.(1)}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-smoke text-silver transition-colors hover:border-paper-white hover:text-paper-white"
          >
            <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </div>
      {/* pt leaves room for the focused card to grow without clipping against
          the row's own overflow. */}
      <div
        ref={rowRef}
        className="no-scrollbar flex w-full gap-16 overflow-x-auto px-24 pt-16 pb-16"
      >
        {/* Copies are visually identical, so only the first carries the real
            reading order — the rest are hidden from assistive tech. */}
        {Array.from({ length: COPIES }, (_, copy) =>
          projects.map((project) => (
            <CaseStudyCard
              key={project.slug + "-" + copy}
              project={project}
              onOpen={setActive}
              duplicate={copy !== 0}
            />
          )),
        )}
      </div>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  );
}
