/**
 * design.md's "Pill Tag": transparent fill, cool-gray border so it reads as
 * secondary, never the white of an action.
 */
export function TagList({
  tags,
  className = "justify-center",
}: {
  tags: string[];
  className?: string;
}) {
  return (
    <ul className={"flex flex-wrap items-center gap-8 " + className}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-steel px-10 py-6 font-inter text-[14px] text-bone"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
