# savio.to

Portfolio site. Next.js (App Router) + TypeScript + Tailwind v4, i18n via `next-intl` (`/pt`, `/en`). No database — content is hardcoded in `content/`.

Design system spec: [design.md](./design.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/pt` by default.

## Structure

- `app/[locale]/` — routes, one tree shared across locales via `next-intl`
- `components/` — UI components grouped by design.md's component families (nav, buttons, typography, case-study, footer)
- `content/` — hardcoded project/case-study data
- `messages/` — `pt.json` / `en.json` translation strings
- `i18n/` — `next-intl` routing, navigation, and request config

## Deploy

Deployed on [Railway](https://railway.app) via Nixpacks auto-detect (`railway.json` pins the start command).
