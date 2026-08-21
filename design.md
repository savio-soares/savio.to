# savio.to
> public health modern portfolio
context: savio is a dentist, epidemiologist, ms in coletive health

portofolio in pt/br and english

**Theme:** dark
**Style reference:** Slash — midnight vault with gilded ledger lines.

savio.to operates in a midnight gallery mode: an almost-black canvas, white type, and a single warm copper accent that functions as editorial punctuation. Display headings are set in a high-contrast didone serif used at extreme sizes — this serif-versus-sans collision is the system's signature, lending seriousness without institutional stiffness. The rest of the UI is deliberately quiet: thin borders, pill-shaped controls, compact body text, and barely-there elevation that lets the serif breathe. The copper accent injects warmth into an otherwise monochrome system.

## Tokens — Colors

The ramp is a single ~215° blue hue. Every step keeps the HSL lightness of the
neutral palette it replaced, so all contrast pairs are unchanged — only
saturation was introduced. Token names are inherited from that neutral system
and describe position in the ramp, not literal hue.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#05080d` | `--color-obsidian` | Page canvas, footer background, deepest surface — near-black midnight blue |
| Onyx | `#030507` | `--color-onyx` | Card surface, secondary backdrop — one step deeper than the page for visual weight |
| Carbon | `#0c131d` | `--color-carbon` | Elevated panels, subtle UI fills — the first clearly lighter step in the surface stack |
| Graphite | `#131d2c` | `--color-graphite` | Borders, dividers, icon containers — the hairline color that defines structure |
| Slate | `#213045` | `--color-slate` | Secondary borders, muted icon strokes, subtle dividers between content blocks |
| Smoke | `#374962` | `--color-smoke` | Tertiary borders, inactive nav items — barely visible structural lines |
| Ash | `#50627c` | `--color-ash` | Muted body text, placeholder content, secondary metadata |
| Steel | `#697c96` | `--color-steel` | Button borders, icon strokes, secondary text, ghost button outlines |
| Fog | `#8996a9` | `--color-fog` | Nav text, body descriptions, helper text — the workhorse readable tone |
| Mist | `#a7b1be` | `--color-mist` | Subdued body copy, supplementary text, less-emphasized paragraphs |
| Silver | `#c5cbd3` | `--color-silver` | Light body text, medium-emphasis paragraphs, secondary headings |
| Bone | `#e2e5e9` | `--color-bone` | High-emphasis body text, dense data labels, the default text tone across most UI |
| Paper White | `#ffffff` | `--color-paper-white` | Primary action button fill, headings, nav active state — highest contrast, reserved for elements that must command attention |
| Copper | `#cc9166` | `--color-copper` | Category labels, editorial links, warm accent punctuation — the only chromatic color, used sparingly |

## Tokens — Typography

### Ivy Presto — Display and heading serif
Used exclusively for headings at 28px and above. The high-contrast didone strokes with hairline serifs create editorial luxury; the slight 0.01em positive tracking gives the type a printed, ledger-like feel. This serif is the primary brand signature. · `--font-ivy-presto`
- **Substitute:** Playfair Display (in use), DM Serif Display, Libre Caslon Display
- **Weights:** 400, 500
- **Sizes:** 28px, 44px, 52px, 64px, 88px
- **Line height:** 1.0–1.38
- **Letter spacing:** 0.0100em

### Inter — UI sans
Body, nav, buttons, labels, links, form fields. Weight 300 on 18px body for whisper-quiet secondary copy; 500 dominates for medium-emphasis text and button labels; 600 reserved for small-caps category labels. · `--font-inter`
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px, 20px, 24px, 48px

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 13px | 1 | -0.26px | `--text-eyebrow` |
| body-xs | 16px | 1.5 | — | `--text-body-xs` |
| body-sm | 18px | 1.38 | -0.36px | `--text-body-sm` |
| body | 20px | 1.38 | -0.8px | `--text-body` |
| subheading | 24px | 1 | -0.31px | `--text-subheading` |
| heading-sm | 44px | 1.38 | 0.44px | `--text-heading-sm` |
| heading | 52px | 1.13 | 0.52px | `--text-heading` |
| heading-lg | 64px | 1.13 | 0.64px | `--text-heading-lg` |
| display | 88px | 1 | 0.88px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 105 | 105px | `--spacing-105` |
| 224 | 224px | `--spacing-224` |

> **Trap:** these tokens override Tailwind's size scale, so `h-4` resolves to **4px**, not 16px. Use explicit px (`h-[18px]`) for icon sizing.

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| tags | 9999px |
| cards | 10px |
| icons | 9999px |
| inputs | 9999px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1216px
- **Section gap:** 160px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Action Button
**Role:** Highest-emphasis interactive element

Pill-shaped, 9999px radius. White (#ffffff) fill, black (#000000) text at 14px Inter weight 500. Padding 10px 20px. No border. The white-on-black inversion is the system's only loud visual signal — treat it as a scarce resource, once per viewport.

### Ghost Outline Button
**Role:** Secondary action

Transparent fill with 1px white (#ffffff) border, 9999px radius. White text at 14px Inter weight 500. Padding 10px 20px.

### Pill Tag
**Role:** Tech-stack chip, category filter, status indicator

Transparent background, 1px border in #777a88, 9999px radius, padding 6px 10px. Text at 12–14px Inter. The border is intentionally cool gray, not white, to read as secondary.

### Top Navigation Bar
**Role:** Fixed page header

Full-width fixed bar on the page canvas with a 1px bottom border in #1c1d22. Brand wordmark left in the display serif; nav controls right. Nav text at 14px Inter in #9194a1, #ffffff when active.

### Project Card
**Role:** Work preview in the horizontal gallery

10px radius thumbnail on the Onyx (#040406) surface, no visible border. Below the thumbnail: category eyebrow in Copper (#cc9166) at 13px Inter weight 600, then title in the display serif, italic, at 24px in white. Cards separate through whitespace alone.

### Horizontal Scroll Gallery
**Role:** Full-bleed project showcase

Single row of project cards scrolling horizontally, driven by vertical wheel input. Full viewport width with no padding constraints. The scroll track hands the gesture back to the page at either end.

### Icon Well
**Role:** Social link container

Circular (9999px), 1px border in #2e3038, transparent fill. Contains a 1px-stroke monochrome glyph in #777a88 or #e2e3e9. Never filled with brand color.

### Section Heading
**Role:** Section title

Display serif at 44–64px weight 400 in white, 0.01em tracking. Centered on the page axis.

### Footer Link Bar
**Role:** Minimal site footer

Obsidian canvas, 1px top border in #1c1d22. Links at 14px Inter in #9194a1.

## Do's and Don'ts

### Do
- Use the display serif for headings and for project titles, always in italic — the italic serif is the editorial voice. It may drop to 24px on card titles, but never carries running body copy.
- Set body text at 16px Inter weight 400 with line-height 1.5 in #e2e3e9 (Bone) — the default readable tone.
- Use the white (#ffffff) filled pill button exclusively for the single most important action on each screen.
- Apply Copper (#cc9166) only to category labels and editorial links — never to buttons, icons, or large text blocks.
- Use 1px borders in #1c1d22 or #2e3038 for card and table edges; never drop shadows for elevation.
- Space sections with 160px vertical gaps on desktop — the breathing room lets the serif headlines dominate.
- Use 9999px radius for buttons, inputs, tags, and icon wells; 10px for cards; 2px for nav underlines.

### Don't
- Don't substitute Inter for the display serif on headings or project titles — the serif/sans contrast is the brand's identity, not decoration.
- Don't introduce blue, green, or any chromatic color as a brand accent — Copper is the only warm note.
- Don't use the white filled button more than once per viewport — its power diminishes with repetition.
- Don't add drop shadows to cards, modals, or popovers — use surface color steps and 1px borders.
- Don't set running body text larger than 20px in Inter — larger sizes belong to the serif.
- Don't use #ffffff for long-form body copy — switch to #e2e3e9 (Bone) to reduce eye strain.
- Don't apply the copper/gilded accent outside data-visualization or category-label contexts.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#08080a` | Page canvas, page-level background |
| 1 | Card | `#040406` | Card surfaces, contained content blocks |
| 2 | Panel | `#121317` | Elevated panels, dropdown surfaces, input backgrounds |
| 3 | Floating | `#1c1d22` | Borders, dividers, floating UI elements, icon wells |

## Elevation

No drop shadows. Depth comes from the surface stack and 1px hairline borders. Icon rings may use `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px`.

## Page Lighting

The canvas is not flat. A soft elliptical halo sits behind the hero copy at the top of the page, scrolling with the content so it belongs to that block rather than following the eye. A viewport-fixed vignette holds the edges and corners dark as a permanent frame. This is the one sanctioned use of gradients on the page chrome.

## Layout

Max-width 1216px centered content with 160px vertical section gaps. Fixed top nav bar: brand left, controls right. Hero is a centered single column. The projects band breaks out of the max-width to run full-bleed as a horizontal scroll row. Rhythm is established by generous whitespace between bands, not by alternating background colors — the entire page is one continuous #08080a canvas.

## Quick Start

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #08080a;
  --color-onyx: #040406;
  --color-carbon: #121317;
  --color-graphite: #1c1d22;
  --color-slate: #2e3038;
  --color-smoke: #464853;
  --color-ash: #5e616e;
  --color-steel: #777a88;
  --color-fog: #9194a1;
  --color-mist: #acafb9;
  --color-silver: #c7c9d1;
  --color-bone: #e2e3e9;
  --color-paper-white: #ffffff;
  --color-copper: #cc9166;

  /* Typography */
  --font-ivy-presto: 'Ivy Presto', ui-serif, Georgia, serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 13px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: -0.26px;
  --text-body-xs: 16px;
  --leading-body-xs: 1.5;
  --text-body-sm: 18px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: -0.36px;
  --text-body: 20px;
  --leading-body: 1.38;
  --tracking-body: -0.8px;
  --text-subheading: 24px;
  --leading-subheading: 1;
  --tracking-subheading: -0.31px;
  --text-heading-sm: 44px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.44px;
  --text-heading: 52px;
  --leading-heading: 1.13;
  --tracking-heading: 0.52px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: 0.64px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: 0.88px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-105: 105px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-full: 9999px;
}
```
