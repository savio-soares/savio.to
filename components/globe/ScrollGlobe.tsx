"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useScrollProgress } from "@/components/scroll/scroll-progress";

/** Canvas edge in CSS px at full size. The wrapper is scaled, never resized. */
const SIZE = 560;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
// Slow at both ends so the dock lands softly instead of snapping.
const easeInOut = (n: number) => (n < 0.5 ? 2 * n * n : 1 - (-2 * n + 2) ** 2 / 2);

export function ScrollGlobe({ anchorId }: { anchorId: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const wallProgress = useScrollProgress();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const fade = fadeRef.current;
    const sheen = sheenRef.current;
    if (!wrapper || !canvas || !fade || !sheen) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let spin = 0;
    let eased = 0;
    let frame = 0;
    // Docking progress is smoothed frame-to-frame rather than read straight
    // off the scroll position, which is what gives the travel its weight.
    let smoothP: number | null = null;
    // Pointer in viewport coordinates, and how close it is to the sphere as
    // 0…1, smoothed so the lift does not flicker at the edge of the falloff.
    let pointerX = -9999;
    let pointerY = -9999;
    let near = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: SIZE * 2,
      height: SIZE * 2,
      phi: 0,
      theta: 0.25,
      // `dark: 1` sinks half the sphere into the page; easing it keeps the
      // globe reading as a full circle on a near-black canvas.
      dark: 0.7,
      diffuse: 1.1,
      mapSamples: 16000,
      mapBrightness: 4,
      // Ocean blue, well above the canvas in lightness — the sphere had no
      // edge to read against a near-black page.
      baseColor: [0.11, 0.25, 0.45],
      glowColor: [0.06, 0.11, 0.2],
      // No markers: the landmass dots carry the globe on their own.
      // markerColor is required by the type but unused with an empty list.
      markerColor: [0.9, 0.63, 0.44],
      markers: [],
    });

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const anchor = document.getElementById(anchorId);

      // Docking progress: 0 while the anchor is still below the fold, 1 once
      // it has climbed most of the way up the viewport.
      let rawP = 0;
      let target = { x: vw * 0.5, y: vh * 0.5, scale: 1 };
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        rawP = easeInOut(clamp01((vh - rect.top) / (vh * 0.9)));
        target = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          scale: rect.width / SIZE,
        };
      }
      // Snap on the first frame so a deep-linked load does not animate in.
      smoothP = smoothP === null ? rawP : smoothP + (rawP - smoothP) * 0.07;
      const p = smoothP;

      // Home: oversized and pushed right, so the hero copy keeps the left.
      const home = { x: vw * 0.78, y: vh * 0.44, scale: 1 };
      const x = home.x + (target.x - home.x) * p;
      const y = home.y + (target.y - home.y) * p;
      const scale = home.scale + (target.scale - home.scale) * p;

      wrapper.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0) scale(${scale})`;

      // The cursor light landing on the sphere.
      const radius = (SIZE / 2) * scale;
      const distance = Math.hypot(pointerX - x, pointerY - y);
      // Reaches a little past the silhouette, so the globe answers as the
      // pointer approaches rather than only once it is on top.
      const rawNear = clamp01(1 - distance / (radius * 1.55));
      near += (rawNear - near) * 0.09;

      // Almost a ghost while it is backdrop; full strength once it is the
      // section's subject.
      //
      // Applied as a mask rather than as opacity, which is what lets the
      // pointer lift it locally. Opacity is uniform over the element, so
      // raising it popped the whole silhouette out of the page as a hard
      // disc; a mask can hold the sphere at `dim` everywhere and rise to
      // `peak` under the pointer across a soft gradient. The colour is never
      // touched — the lit region is simply the real globe, at the vividness
      // it already has once docked beside the Projects heading.
      // Almost a ghost while it is backdrop; full strength once it is the
      // section's subject. Deliberately NOT lifted by the pointer: opacity on
      // this element is uniform across the whole sphere, so raising it pops
      // the entire silhouette out of the dark page as a hard-edged disc. All
      // of the pointer's brightening happens in the masked sheen instead,
      // which fades out before it ever reaches the edge.
      fade.style.opacity = `${0.12 + 0.88 * p}`;

      // Pointer position in the wrapper's own coordinate space: the sheen is
      // a child, so it lives in unscaled SIZE units, not viewport pixels.
      sheen.style.setProperty("--sx", `${(pointerX - x) / scale + SIZE / 2}px`);
      sheen.style.setProperty("--sy", `${(pointerY - y) / scale + SIZE / 2}px`);
      sheen.style.opacity = near.toFixed(3);

      // ~26s per revolution — present, but calm enough to stay backdrop.
      if (!reduceMotion) spin += 0.004;
      // Ease toward the wall's horizontal scroll so flicks feel weighted.
      if (wallProgress) {
        eased += (wallProgress.current * Math.PI * 2 - eased) * 0.08;
      }
      globe.update({
        phi: spin + eased + p * Math.PI * 0.5,
        // Tilting through the dock gives the shrink its sense of depth.
        theta: 0.25 + p * 0.35,
      });

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      globe.destroy();
    };
  }, [anchorId, wallProgress]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      // Negative z keeps it above the page background but under all in-flow
      // content, so text never has to fight it.
      className="pointer-events-none fixed left-0 top-0 -z-10 origin-center will-change-transform"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* The fade is its own element so the sheen below can sit outside it.
          With the sheen nested inside, the wrapper's opacity multiplied it
          down to nothing on the hero. */}
      <div ref={fadeRef} className="h-full w-full">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <div ref={sheenRef} className="globe-sheen" />
    </div>
  );
}
