"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NavMenu } from "./NavMenu";

/**
 * Full centred wordmark pill at rest; once you scroll it contracts into a
 * monogram hugging the left edge. Same behaviour at every width — from the
 * fold down the page is centred display type, and a wide pill parked in the
 * middle sits right in its path regardless of screen size.
 */
export function FloatingNav() {
  const t = useTranslations("nav");
  const [contracted, setContracted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      // Compared against current state so this only re-renders on the two
      // threshold crossings, not on every scroll event.
      const next = window.scrollY > 80;
      setContracted((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      /* `fixed` is itself a containing block, so the menu panel below can be
         absolutely positioned against this pill without a `relative`. */
      className={`fixed top-24 z-20 flex w-fit items-center rounded-full border border-slate bg-carbon/70 backdrop-blur-md transition-all duration-300 ${
        contracted
          ? "left-24 translate-x-0 flex-col gap-12 px-12 py-12"
          : "left-1/2 -translate-x-1/2 flex-row gap-24 px-20 py-10"
      }`}
    >
      {/* Wordmark carries the display serif — the brand's signature register.
          It contracts to the monogram where there is no room for the name. */}
      <Link
        href="/"
        aria-label={t("brand")}
        className="font-ivy-presto text-subheading leading-subheading tracking-subheading text-paper-white"
      >
        <span className={contracted ? "inline" : "hidden"} aria-hidden>
          S
        </span>
        <span className={contracted ? "hidden" : "inline"} aria-hidden>
          {t("brand")}
        </span>
      </Link>
      <button
        type="button"
        data-menu-toggle
        aria-label={t("menu")}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
        // 12px reach: the pill puts 24px between this and the wordmark, so
        // the two regions meet exactly halfway and neither steals the other.
        className="tap [--tap:12px] text-fog transition-colors hover:text-paper-white aria-expanded:text-paper-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="h-[20px] w-[20px]"
        >
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </svg>
      </button>
      <NavMenu open={menuOpen} onClose={closeMenu} contracted={contracted} />
    </div>
  );
}
