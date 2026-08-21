"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Phones only. The bio is taller than a phone screen, so the projects heading
 * cannot peek at the fold the way it does on desktop; this pins the same
 * affordance to the bottom of the viewport instead, and retires once the
 * target section is actually on screen.
 */
export function FloatingCue({ targetId, label }: { targetId: string; label: string }) {
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      // A sliver counts as arrived — waiting for the whole section would keep
      // the cue up well past the point it is useful.
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <a
      ref={ref}
      href={`#${targetId}`}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={`fixed bottom-24 left-1/2 z-20 flex h-[48px] w-[48px] -translate-x-1/2 items-center justify-center rounded-full border border-smoke bg-carbon/70 text-silver backdrop-blur-md transition-opacity duration-300 md:hidden ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ChevronDown className="h-[22px] w-[22px] animate-nudge" aria-hidden />
    </a>
  );
}
