import type { ReactNode } from "react";

/**
 * A copper eyebrow over its content — design.md's "typographic period before
 * each content block", used here to give the bio real sections instead of a
 * run of same-weight centred lines.
 */
export function MetaBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <p className="font-inter text-eyebrow leading-eyebrow tracking-eyebrow font-semibold uppercase text-copper">
        {label}
      </p>
      {children}
    </div>
  );
}
