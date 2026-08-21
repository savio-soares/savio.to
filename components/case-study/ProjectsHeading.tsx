import { ScrollCue } from "@/components/scroll/ScrollCue";

export function ProjectsHeading({
  title,
  dockId,
  cue,
}: {
  title: string;
  dockId: string;
  cue?: { href: string; label: string };
}) {
  return (
    /* Centred flex row on mobile so the globe stays beside the title; from md
       the three columns put the heading on the true page centre, which that
       row would otherwise offset by half the globe's width. */
    <div className="flex w-full items-center justify-center gap-12 px-24 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-24">
      {/* From md only: on phones the same job is done by the viewport-pinned
          FloatingCue, since the heading never reaches the fold there. */}
      {cue ? (
        <ScrollCue
          href={cue.href}
          label={cue.label}
          className="hidden md:flex md:justify-self-end"
        />
      ) : (
        <div aria-hidden className="hidden md:block" />
      )}
      <h2 className="whitespace-nowrap font-ivy-presto italic text-heading-sm leading-heading tracking-heading text-paper-white md:text-heading">
        {title}
      </h2>
      {/* Empty slot: the fixed globe reads this rect each frame and animates
          itself into it. Explicit px because the design.md spacing tokens
          override Tailwind's size scale. */}
      <div
        id={dockId}
        aria-hidden
        className="h-[80px] w-[80px] shrink-0 sm:h-[110px] sm:w-[110px] md:h-[170px] md:w-[170px] md:justify-self-start"
      />
    </div>
  );
}
