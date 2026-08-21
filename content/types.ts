/**
 * Visual archetype the card thumbnail renders when there is no real
 * screenshot yet. Each maps to a generated CSS/SVG mock in ProjectMock.tsx.
 */
export type MockKind =
  | "map"
  | "chart"
  | "dashboard"
  | "mobile"
  | "media"
  | "editorial"
  | "model";

/**
 * Structure only — every string a reader sees lives in `messages/*.json`
 * under `projects.items.<slug>`, so the wall and the detail dialog are
 * translated like the rest of the page.
 */
export type Project = {
  slug: string;
  year: string;
  /** Real screenshot; when absent the `mock` archetype is drawn instead. */
  image?: string;
  mock: MockKind;
  /** External "live link" target for the detail dialog, when one exists. */
  link?: string;
};
