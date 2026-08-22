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
    <ul className={"flex flex-wrap items-center gap-6 sm:gap-8 " + className}>
      {tags.map((tag) => (
        <li
          key={tag}
          // Padding halves on phones alongside the smaller type — shrinking
          // only the text leaves the chip the same size with more air in it.
          // The sm: values restore design.md's Pill Tag spec from 640px up.
          className="rounded-full border border-steel px-8 py-4 font-inter text-tag text-bone sm:px-10 sm:py-6"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
