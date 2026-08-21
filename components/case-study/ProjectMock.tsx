import type { MockKind } from "@/content/types";

/**
 * Generated stand-ins for real screenshots. The thumbnails used to be an
 * empty Onyx rectangle on an Obsidian canvas — near-invisible, which left the
 * hover tilt with nothing to read as depth. Each archetype below draws the
 * kind of artefact its project actually produced.
 *
 * Everything is deterministic: shapes are seeded from the slug, never from
 * Math.random, so server and client markup match.
 *
 * When a real screenshot arrives, set `image` on the project — CaseStudyCard
 * renders that instead and none of this changes.
 */

// FNV-1a hash into an xorshift stream: the same slug always yields the same
// sequence.
function seeded(slug: string) {
  let state = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    state ^= slug.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 10000) / 10000;
  };
}

const W = 320;
const H = 400;

// Token colors, read straight from the Tailwind v4 @theme block.
const HAIR = "var(--color-graphite)";
const LINE = "var(--color-slate)";
const FILL = "var(--color-smoke)";
const TEXT = "var(--color-ash)";
const BRIGHT = "var(--color-silver)";
const ACCENT = "var(--color-copper)";

/** Ghosted label rows — stands in for copy without faking readable text. */
function TextRows({
  x,
  y,
  widths,
  gap = 9,
  height = 5,
  color = TEXT,
}: {
  x: number;
  y: number;
  widths: number[];
  gap?: number;
  height?: number;
  color?: string;
}) {
  return (
    <>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * (height + gap)}
          width={w}
          height={height}
          rx={height / 2}
          fill={color}
          opacity={0.5}
        />
      ))}
    </>
  );
}

function MapMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  // Irregular district blocks, then case points clustered over them.
  const cells = Array.from({ length: 40 }, (_, i) => ({
    x: 24 + (i % 5) * 55,
    y: 60 + Math.floor(i / 5) * 40,
    o: 0.06 + rand() * 0.3,
  }));
  const points = Array.from({ length: 22 }, () => ({
    x: 30 + rand() * 260,
    y: 70 + rand() * 290,
    r: 2 + rand() * 6,
  }));

  return (
    <>
      <TextRows x={24} y={26} widths={[86, 48]} />
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={51}
          height={36}
          rx={2}
          fill={FILL}
          opacity={cell.o}
        />
      ))}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={i % 5 === 0 ? ACCENT : BRIGHT}
          opacity={i % 5 === 0 ? 0.85 : 0.28}
        />
      ))}
      <rect x={24} y={356} width={120} height={3} rx={1.5} fill={LINE} />
    </>
  );
}

function ChartMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  // Two series over a gridded plot: the shape of a cohort or coverage curve.
  const build = (drift: number) => {
    let value = 0.45;
    return Array.from({ length: 14 }, (_, i) => {
      value = Math.min(0.95, Math.max(0.08, value + (rand() - 0.5) * 0.24 + drift));
      return { x: 28 + i * 20.5, y: 300 - value * 190 };
    });
  };
  const path = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => (i === 0 ? "M" : "L") + p.x + " " + p.y).join(" ");
  const a = build(0.02);
  const b = build(-0.015);

  return (
    <>
      <TextRows x={24} y={26} widths={[70, 110]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={24}
          x2={296}
          y1={120 + i * 45}
          y2={120 + i * 45}
          stroke={HAIR}
          strokeWidth={1}
        />
      ))}
      <path d={path(b)} fill="none" stroke={FILL} strokeWidth={2} strokeLinejoin="round" />
      <path d={path(a)} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinejoin="round" />
      {a.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2} fill={ACCENT} opacity={0.9} />
      ))}
      <TextRows x={24} y={336} widths={[54, 92]} height={4} gap={8} />
    </>
  );
}

function DashboardMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  const bars = Array.from({ length: 9 }, () => 0.25 + rand() * 0.75);

  return (
    <>
      <TextRows x={24} y={24} widths={[64]} />
      {/* KPI row */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={24 + i * 92}
            y={48}
            width={80}
            height={62}
            rx={6}
            fill={FILL}
            opacity={0.13}
            stroke={HAIR}
          />
          <rect x={34 + i * 92} y={60} width={30} height={4} rx={2} fill={TEXT} opacity={0.6} />
          <rect
            x={34 + i * 92}
            y={74}
            width={44}
            height={11}
            rx={3}
            fill={i === 0 ? ACCENT : BRIGHT}
            opacity={i === 0 ? 0.85 : 0.45}
          />
          <rect x={34 + i * 92} y={94} width={22} height={3} rx={1.5} fill={TEXT} opacity={0.45} />
        </g>
      ))}
      {/* Bar panel */}
      <rect
        x={24}
        y={126}
        width={272}
        height={168}
        rx={6}
        fill={FILL}
        opacity={0.09}
        stroke={HAIR}
      />
      {bars.map((v, i) => (
        <rect
          key={i}
          x={40 + i * 28}
          y={274 - v * 124}
          width={14}
          height={v * 124}
          rx={3}
          fill={i === bars.length - 1 ? ACCENT : BRIGHT}
          opacity={i === bars.length - 1 ? 0.85 : 0.3}
        />
      ))}
      {/* Table stub */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={24} x2={296} y1={318 + i * 24} y2={318 + i * 24} stroke={HAIR} />
          <rect x={24} y={326 + i * 24} width={96} height={4} rx={2} fill={TEXT} opacity={0.5} />
          <rect x={248} y={326 + i * 24} width={48} height={4} rx={2} fill={TEXT} opacity={0.35} />
        </g>
      ))}
    </>
  );
}

function MobileMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  const rows = Array.from({ length: 5 }, () => 60 + rand() * 74);

  return (
    <>
      {/* Handset frame, floating on the card surface */}
      <rect x={86} y={40} width={148} height={320} rx={22} fill={HAIR} stroke={LINE} />
      <rect x={94} y={48} width={132} height={304} rx={17} fill="var(--color-obsidian)" />
      <rect x={140} y={57} width={40} height={5} rx={2.5} fill={LINE} />
      <rect x={106} y={78} width={58} height={6} rx={3} fill={BRIGHT} opacity={0.55} />
      {/* Triage entries */}
      {rows.map((w, i) => (
        <g key={i}>
          <rect
            x={106}
            y={100 + i * 46}
            width={108}
            height={36}
            rx={6}
            fill={FILL}
            opacity={0.16}
          />
          <circle
            cx={120}
            cy={118 + i * 46}
            r={5}
            fill={i === 1 ? ACCENT : BRIGHT}
            opacity={i === 1 ? 0.9 : 0.35}
          />
          <rect x={132} y={111 + i * 46} width={w * 0.5} height={4} rx={2} fill={TEXT} opacity={0.6} />
          <rect x={132} y={121 + i * 46} width={w * 0.34} height={3} rx={1.5} fill={TEXT} opacity={0.4} />
        </g>
      ))}
      <rect x={106} y={330} width={108} height={12} rx={6} fill={BRIGHT} opacity={0.18} />
    </>
  );
}

function MediaMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  const bars = Array.from({ length: 46 }, () => 0.12 + rand() * 0.88);

  return (
    <>
      <circle cx={160} cy={128} r={58} fill={FILL} opacity={0.14} stroke={HAIR} />
      <circle cx={160} cy={128} r={20} fill={HAIR} />
      <circle cx={160} cy={128} r={5} fill={ACCENT} opacity={0.8} />
      {/* Waveform */}
      {bars.map((v, i) => (
        <rect
          key={i}
          x={22 + i * 6.2}
          y={252 - v * 44}
          width={2.6}
          height={v * 88}
          rx={1.3}
          fill={i > 18 && i < 26 ? ACCENT : BRIGHT}
          opacity={i > 18 && i < 26 ? 0.8 : 0.28}
        />
      ))}
      <line x1={22} x2={296} y1={252} y2={252} stroke={HAIR} />
      <TextRows x={22} y={288} widths={[128, 78]} />
      <rect x={22} y={330} width={44} height={16} rx={8} fill={FILL} opacity={0.2} />
      <rect x={74} y={330} width={62} height={16} rx={8} fill={FILL} opacity={0.2} />
    </>
  );
}

function EditorialMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  const column = (x: number) =>
    Array.from({ length: 11 }, () => 60 + rand() * 58).map((w, i) => ({
      x,
      y: 196 + i * 15,
      w,
    }));
  const lines = [...column(26), ...column(170)];

  return (
    <>
      {/* Page plate — the one lighter field on the card, so the tilt has a
          surface to catch. */}
      <rect x={14} y={16} width={292} height={368} rx={4} fill={FILL} opacity={0.1} stroke={HAIR} />
      <rect x={26} y={36} width={54} height={4} rx={2} fill={ACCENT} opacity={0.9} />
      <rect x={26} y={58} width={220} height={16} rx={3} fill={BRIGHT} opacity={0.5} />
      <rect x={26} y={82} width={168} height={16} rx={3} fill={BRIGHT} opacity={0.5} />
      <rect x={26} y={120} width={268} height={58} rx={3} fill={FILL} opacity={0.18} />
      {lines.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height={3.5} rx={1.75} fill={TEXT} opacity={0.45} />
      ))}
      <line x1={26} x2={294} y1={362} y2={362} stroke={HAIR} />
    </>
  );
}

function ModelMock({ slug }: { slug: string }) {
  const rand = seeded(slug);
  // Confusion-matrix heat grid above a feature-importance list.
  const grid = Array.from({ length: 36 }, () => rand());

  return (
    <>
      <TextRows x={24} y={26} widths={[92]} />
      {grid.map((v, i) => (
        <rect
          key={i}
          x={24 + (i % 6) * 46}
          y={52 + Math.floor(i / 6) * 34}
          width={42}
          height={30}
          rx={3}
          fill={i % 7 === 0 ? ACCENT : BRIGHT}
          opacity={0.08 + v * 0.55}
        />
      ))}
      <line x1={24} x2={296} y1={276} y2={276} stroke={HAIR} />
      {/* Feature weights */}
      {[0.86, 0.62, 0.44, 0.29].map((v, i) => (
        <g key={i}>
          <rect x={24} y={296 + i * 24} width={64} height={4} rx={2} fill={TEXT} opacity={0.55} />
          <rect
            x={98}
            y={294 + i * 24}
            width={198 * v}
            height={8}
            rx={4}
            fill={i === 0 ? ACCENT : FILL}
            opacity={i === 0 ? 0.8 : 0.5}
          />
        </g>
      ))}
    </>
  );
}

const MOCKS: Record<MockKind, (props: { slug: string }) => React.ReactNode> = {
  map: MapMock,
  chart: ChartMock,
  dashboard: DashboardMock,
  mobile: MobileMock,
  media: MediaMock,
  editorial: EditorialMock,
  model: ModelMock,
};

export function ProjectMock({
  slug,
  kind,
  className = "",
}: {
  slug: string;
  kind: MockKind;
  className?: string;
}) {
  const Mock = MOCKS[kind];

  return (
    <svg
      viewBox={"0 0 " + W + " " + H}
      preserveAspectRatio="xMidYMid slice"
      className={"h-full w-full " + className}
      aria-hidden
      focusable="false"
    >
      <Mock slug={slug} />
    </svg>
  );
}
