import { ChevronDown } from "lucide-react";

/**
 * Icon-only on purpose: it sits beside the section title, which already names
 * the destination, so a visible label would just repeat it.
 */
export function ScrollCue({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`flex shrink-0 text-steel transition-colors hover:text-paper-white ${className}`}
    >
      <ChevronDown className="h-[40px] w-[40px] animate-nudge" aria-hidden />
    </a>
  );
}
