"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A spotlight that follows the pointer, with the pointer drawn as a mouse.
 *
 * Three parts, one animation frame:
 *
 * 1. A lamp behind the content (z-index -1) that lights the page background.
 *    Behind, because a glow this size riding above the page passes over the
 *    type and brightens it — that reads as paint, not as light. Anything large
 *    enough to cover a line of text belongs under it.
 * 2. A small bright core at the same point, above the content, held down to
 *    30% behind the icon so it does not eat the mark's contrast.
 * 3. The mouse itself, seen from above, its wheel rolling with the real one.
 *    The whole page is driven by the wheel, so a cursor showing a wheel says
 *    how to use it without a word.
 *
 * Nothing here moves on its own. An earlier version had the light chase the
 * pointer on an ease and wander on out-of-phase sines — a firefly — and it was
 * cut: a light that keeps moving after the hand stops reads as a thing with
 * its own will, not as a pointer. Everything is pinned to the pointer, exactly
 * where it is, on the frame it moves. The only animation left is a one-time
 * grow-in, the fade when the pointer leaves the window, the ease on the hover
 * scale, and the wheel spinning down — all of which are responses to input.
 *
 * There is also deliberately no trail. An accumulation buffer was tried and
 * cut for two reasons. It read as painting rather than lighting, which is the
 * wrong register for this page. And it could not be made to clear: canvas
 * alpha is 8-bit, so a multiplicative fade stalls once a pixel reaches 1/255 —
 * 1 x 0.91 rounds back to 1 — leaving the pointer's whole path permanently
 * smudged onto the background.
 *
 * The light is warm gold rather than the neutral white of the page halo. It is
 * one of the two chromatic things on the page besides Copper, and it stays
 * adjacent to that hue on purpose (see design.md § Do's and Don'ts).
 */

// The wheel's opening, in the SVG's user units.
const WHEEL = { x: 9.7, y: 7.4, w: 4.6, h: 9.2 };
// Gap between grooves, sized so four sit in the opening at once. Three read
// cleanly but sparse, five turned back into a blur — thickness is what carries
// the travel, so the count is capped by how thick each groove can stay.
const TREAD_GAP = 2.3;
// Positions running one gap above the opening to one gap below, so the pattern
// still covers it fully at every point in the wrap.
const TREADS = [5.1, 7.4, 9.7, 12, 14.3, 16.6];

export function CursorLight() {
  const lampRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);
  const treadRef = useRef<SVGGElement>(null);
  const leftRef = useRef<SVGRectElement>(null);
  const rightRef = useRef<SVGRectElement>(null);
  // Nothing is rendered at all until a real mouse is confirmed, so a phone
  // never has the markup to reveal in the first place.
  const [enabled, setEnabled] = useState(false);
  // Latched, never cleared: once a device has been touched it is a touch
  // device for the rest of the session, whatever the media queries say later.
  const touched = useRef(false);

  useEffect(() => {
    // `hover: hover` as well as `pointer: fine`. On its own, `pointer: fine`
    // is not a mouse test — a stylus reports fine too, and some phones report
    // it for their touch digitiser, which is how the cursor was appearing on a
    // tap. A device that can hover has a pointer that exists between clicks,
    // which is the thing this component actually needs.
    const hasMouse = window.matchMedia("(pointer: fine) and (hover: hover)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setEnabled(!touched.current && hasMouse.matches && !still.matches);
    };
    // Belt and braces for the devices that answer the query wrongly: a real
    // touch is proof no query can override.
    const onTouch = () => {
      touched.current = true;
      setEnabled(false);
    };

    sync();
    hasMouse.addEventListener("change", sync);
    still.addEventListener("change", sync);
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      hasMouse.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const lamp = lampRef.current;
    const glow = glowRef.current;
    const mouse = mouseRef.current;
    const tread = treadRef.current;
    const leftBtn = leftRef.current;
    const rightBtn = rightRef.current;
    if (!lamp || !glow || !mouse || !tread || !leftBtn || !rightBtn) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    // Size multiplier, eased in JS rather than by a CSS transition: the
    // transform is rewritten every frame, so a transition would fight it.
    let scale = 1;
    let targetScale = 1;
    // Visibility is eased here rather than in CSS: the loop writes `opacity`
    // inline every frame, and an inline value beats any stylesheet rule that
    // tried to gate it.
    let lit = 0;
    // Eased once on the first frames so the mark grows in rather than
    // appearing at full size. It never closes again — the mouse is the cursor
    // everywhere now, not a state some elements enter.
    let opened = 0;
    // Total distance the tread pattern has rolled, in SVG units, and the
    // velocity carrying it. Never reset: a wheel keeps whatever position it
    // was left in. What the eye reads as rotation is the pattern travelling
    // past a fixed rim, the way a tyre seen from above gives itself away — so
    // the capsule stays put and only the grooves move. This is the one thing
    // that keeps moving after the input stops, and it should: a wheel that
    // halted dead on the notch would read as jammed, not as spun.
    let rotation = 0;
    let spin = 0;
    // Which buttons are down, and how far the drawn ones have followed them.
    // Eased fast — a button that takes visible time to go down feels mushy —
    // but eased all the same, because snapping between two states reads as a
    // flicker at this size.
    let downLeft = false;
    let downRight = false;
    let pressLeft = 0;
    let pressRight = 0;
    let inside = false;
    let seen = false;
    let frame = 0;

    const draw = () => {
      frame = requestAnimationFrame(draw);

      scale += (targetScale - scale) * 0.12;
      lit += ((inside ? 1 : 0) - lit) * 0.12;
      opened += (1 - opened) * 0.16;
      pressLeft += ((downLeft ? 1 : 0) - pressLeft) * 0.35;
      pressRight += ((downRight ? 1 : 0) - pressRight) * 0.35;
      // The shell takes the hand's weight from either button, never twice.
      const pressed = Math.max(pressLeft, pressRight);
      // Coasts to a stop rather than halting with the notch, which is what
      // makes one flick read as the wheel spinning down instead of jumping.
      rotation += spin;
      spin *= 0.9;

      // One anchor for everything: the pointer, exactly where it is.
      const at = "translate3d(" + x + "px," + y + "px,0) translate(-50%,-50%)";

      lamp.style.transform = at + " scale(" + scale.toFixed(3) + ")";
      // The light flares a little on the press. The mark going down and the
      // page brightening are the same event seen twice, which is what sells a
      // click that has no physical button under it.
      lamp.style.opacity = Math.min(1, 0.85 * lit * (1 + 0.3 * pressed)).toFixed(3);

      glow.style.transform = at + " scale(" + scale.toFixed(3) + ")";
      // Held down behind the icon. The core is a near-white point sitting
      // exactly where the mark is drawn, and a warm outline on a warm
      // highlight has almost no contrast left. What is left at 30% still reads
      // as a halo around the mouse, and the lamp behind is untouched.
      glow.style.opacity = (lit * (1 - opened * 0.7)).toFixed(3);

      // Never magnified by the glow — that is how a 34px icon once ended up
      // drawing at 54. The only motion left on it is the one-time grow-in.
      // The whole mark dips on the press, not just the button: a real mouse
      // takes the hand's weight through its whole shell.
      mouse.style.transform =
        at +
        " scale(" +
        ((0.72 + 0.28 * opened) * (1 - 0.045 * pressed)).toFixed(3) +
        ")";
      mouse.style.opacity = (opened * lit).toFixed(3);
      leftBtn.style.opacity = (pressLeft * 0.42).toFixed(3);
      rightBtn.style.opacity = (pressRight * 0.42).toFixed(3);

      // Wrapped into a single groove spacing: past that the pattern repeats,
      // so one step of travel is indistinguishable from any other and the roll
      // can continue forever without the group drifting out of the clip.
      const rolled = ((rotation % TREAD_GAP) + TREAD_GAP) % TREAD_GAP;
      tread.style.transform = "translateY(" + rolled.toFixed(3) + "px)";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      inside = true;
      seen = true;
    };

    // Elements opt in with data-cursor; anything else clickable gets "link".
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const match = target.closest("[data-cursor], a[href], button");
      const mode = match ? match.getAttribute("data-cursor") ?? "link" : "default";
      // The mark itself no longer changes — the glow around it carries the
      // hover feedback, so the cursor does not resize as it crosses the page.
      targetScale = mode === "card" ? 1.4 : mode === "link" ? 1.15 : 1;
    };

    // Passive: ProjectWall owns whether the gesture is cancelled. This only
    // mirrors it, feeding the wheel's velocity.
    const onWheel = (event: WheelEvent) => {
      spin += event.deltaY * 0.009;
    };

    // `pointerup` and `pointercancel` go on the window rather than the target,
    // so a press that ends outside where it started — or over an element that
    // swallowed the event — still lifts the drawn button.
    const onDown = (event: PointerEvent) => {
      if (event.button === 0) downLeft = true;
      if (event.button === 2) downRight = true;
    };
    const onUp = (event: PointerEvent) => {
      // A cancel reports no button, so it releases both.
      if (event.type !== "pointerup") {
        downLeft = downRight = false;
        return;
      }
      if (event.button === 0) downLeft = false;
      if (event.button === 2) downRight = false;
    };
    // A press held while the window loses focus never reports its release.
    const onBlur = () => {
      downLeft = downRight = false;
    };
    // The context menu often takes the pointerup with it, which would leave
    // the right button drawn down until the next click.
    const onContextMenu = () => {
      downRight = false;
    };

    const onLeave = () => {
      inside = false;
    };
    const onEnter = () => {
      inside = seen;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={lampRef} className="cursor-lamp" aria-hidden />
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={mouseRef} className="cursor-mouse" aria-hidden>
        <svg viewBox="0 0 24 36" fill="none">
          <defs>
            <clipPath id="cursor-wheel">
              <rect
                x={WHEEL.x}
                y={WHEEL.y}
                width={WHEEL.w}
                height={WHEEL.h}
                rx={WHEEL.w / 2}
              />
            </clipPath>
            {/* The body, in the theme's own blue ramp. Opaque, and lighter at
                the top than the bottom, so the shell reads as a solid object
                lit from above rather than as an outline with the page showing
                through it. */}
            <linearGradient
              id="cursor-body-fill"
              x1="0"
              y1="1.4"
              x2="0"
              y2="34.6"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--color-ash)" />
              <stop offset="0.45" stopColor="var(--color-slate)" />
              <stop offset="1" stopColor="var(--color-carbon)" />
            </linearGradient>
            <clipPath id="cursor-body">
              <rect x="1.4" y="1.4" width="21.2" height="33.2" rx="10.6" />
            </clipPath>
            {/* The bevel. One stroke whose colour runs from a light rim at the
                top to a dark one at the bottom, which is the whole of what
                makes a shape read as raised: a lit edge facing the light and a
                shaded edge facing away. Drawn inset and clipped to the shell,
                so it is an inner edge rather than an outline. */}
            <linearGradient
              id="cursor-body-bevel"
              x1="0"
              y1="1.4"
              x2="0"
              y2="34.6"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="0.28" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="0.55" stopColor="var(--color-obsidian)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--color-obsidian)" stopOpacity="0.6" />
            </linearGradient>
            {/* The specular: where a light above and to the left would land on
                a curved shell. Off-centre on purpose — a highlight centred on
                the object describes a flat disc. */}
            <radialGradient
              id="cursor-body-sheen"
              cx="0.5"
              cy="0.5"
              r="0.5"
            >
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            {/* The wheel's inner rim, and the one place the light is inverted:
                dark at the top, bright at the bottom. That inversion is what
                separates a well from a bump — the shell's bevel runs the other
                way, so the wheel reads as sunk into it rather than sitting on
                it. The lower rim is warm rather than white, which is where the
                Copper accent went when its outline came off. */}
            <linearGradient
              id="cursor-wheel-bevel"
              x1="0"
              y1={WHEEL.y}
              x2="0"
              y2={WHEEL.y + WHEEL.h}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--color-obsidian)" stopOpacity="0.7" />
              <stop offset="0.4" stopColor="var(--color-obsidian)" stopOpacity="0" />
              <stop offset="0.62" stopColor="var(--color-copper)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--color-copper)" stopOpacity="0.85" />
            </linearGradient>
            {/* Darkens both ends of the wheel so it reads as a cylinder rather
                than a flat slot — the grooves compress out of sight at the
                edges, which is the other half of the seen-from-above cue. */}
            <linearGradient
              id="cursor-wheel-shade"
              x1="0"
              y1={WHEEL.y}
              x2="0"
              y2={WHEEL.y + WHEEL.h}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--color-obsidian)" stopOpacity="0.55" />
              <stop offset="0.34" stopColor="var(--color-obsidian)" stopOpacity="0" />
              <stop offset="0.66" stopColor="var(--color-obsidian)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--color-obsidian)" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <g clipPath="url(#cursor-body)">
            <rect
              x="1.4"
              y="1.4"
              width="21.2"
              height="33.2"
              rx="10.6"
              fill="url(#cursor-body-fill)"
            />
            <ellipse cx="8.6" cy="9" rx="7.4" ry="6.2" fill="url(#cursor-body-sheen)" />
            {/* The seam between the two buttons, running from the top edge
                down to the wheel and on to the shell divide. Two hairlines a
                fraction apart, dark then light, is how a groove is drawn: the
                far wall in shadow, the near wall catching the light. */}
            <path
              d="M12 2.2V6.6M12 17.4V19.6"
              stroke="var(--color-obsidian)"
              strokeOpacity="0.55"
              strokeWidth="0.7"
            />
            <path
              d="M12.55 2.2V6.6M12.55 17.4V19.6"
              stroke="#ffffff"
              strokeOpacity="0.14"
              strokeWidth="0.5"
            />
            {/* Where the button shell meets the body. Same two-line groove,
                and the reason the lower half does not read as one slab. */}
            <path
              d="M2.6 20.1H21.4"
              stroke="var(--color-obsidian)"
              strokeOpacity="0.5"
              strokeWidth="0.7"
            />
            <path
              d="M2.6 20.85H21.4"
              stroke="#ffffff"
              strokeOpacity="0.12"
              strokeWidth="0.5"
            />
            {/* The buttons going down. Darker, because a pressed key sits
                further from the light than the shell around it — brightening
                it would read as a lamp switching on rather than as travel.
                Each is bounded by the seam near x=12 and the shell divide at
                y=20.1, and left to the body clip for its rounded corner. */}
            <rect
              ref={leftRef}
              x="1.4"
              y="1.4"
              width="10.6"
              height="18.7"
              fill="var(--color-obsidian)"
              opacity="0"
            />
            <rect
              ref={rightRef}
              x="12.55"
              y="1.4"
              width="10.05"
              height="18.7"
              fill="var(--color-obsidian)"
              opacity="0"
            />
            {/* The monogram, on the palm rest — where a mouse carries its
                maker's mark. Engraved, not raised: shadow peeking above the
                glyph, a lit edge peeking below, and the silver laid over both.
                That inversion is the same one the wheel uses, and it is what
                tells a cut into the shell from a badge stuck onto it.

                All three kept low. An opaque silver fill is what made it read
                as a sticker: a mark cut into a surface shows the material
                through it, so the shell's own gradient has to stay visible
                inside the glyph. The edges carry the shape, not the fill.

                Upright, not italic: this is the same monogram the nav pill
                contracts to, and that one is upright. The italic serif belongs
                to project titles. */}
            <text
              x="12"
              y="27.4"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5.6"
              fill="var(--color-obsidian)"
              opacity="0.5"
            >
              S
            </text>
            <text
              x="12"
              y="28"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5.6"
              fill="#ffffff"
              opacity="0.13"
            >
              S
            </text>
            <text
              x="12"
              y="27.7"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5.6"
              fill="var(--color-silver)"
              opacity="0.4"
            >
              S
            </text>
            {/* Inset by half its own width so the stroke lands just inside the
                silhouette instead of straddling it. */}
            <rect
              x="2.1"
              y="2.1"
              width="19.8"
              height="31.8"
              rx="9.9"
              fill="none"
              stroke="url(#cursor-body-bevel)"
              strokeWidth="1.4"
            />
          </g>
          {/* Blue wheel, light grooves. The fill is the shell's own gradient,
              not a copy of one of its stops — because that gradient is laid
              out in user space over the whole body, the wheel picks up exactly
              the colour the shell has at that height, and the two stay in step
              if the ramp is ever retuned.

              The cost is that the well no longer has a tone of its own to mark
              it. Everything separating it from the shell is now edge work: the
              bevel rim above and below, and the shading at the two ends.

              The end shading sits at 0.55 — above the 0.4 the near-white wheel
              used, because it is dimming bright stripes here rather than
              darkening a bright field, and below the 0.75 the black one needed,
              because a mid-tone field does not swallow it.

              Copper is not an outline at all: it survives as the warm lower
              rim of the bevel, the only lit edge of an inset well. Its
              opposite number at the top is shadow on black and simply does not
              show, which is correct — there is nothing there to catch. */}
          <g clipPath="url(#cursor-wheel)">
            <rect
              x={WHEEL.x}
              y={WHEEL.y}
              width={WHEEL.w}
              height={WHEEL.h}
              fill="url(#cursor-body-fill)"
            />
            <g ref={treadRef}>
              {TREADS.map((y) => (
                <rect
                  key={y}
                  x={WHEEL.x}
                  y={y}
                  width={WHEEL.w}
                  height="0.85"
                  fill="#fff8ea"
                  opacity="0.85"
                />
              ))}
            </g>
            <rect
              x={WHEEL.x}
              y={WHEEL.y}
              width={WHEEL.w}
              height={WHEEL.h}
              fill="url(#cursor-wheel-shade)"
            />
            <rect
              x={WHEEL.x + 0.45}
              y={WHEEL.y + 0.45}
              width={WHEEL.w - 0.9}
              height={WHEEL.h - 0.9}
              rx={(WHEEL.w - 0.9) / 2}
              fill="none"
              stroke="url(#cursor-wheel-bevel)"
              strokeWidth="0.9"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
