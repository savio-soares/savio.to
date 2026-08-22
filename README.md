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

Deployed on [Railway](https://railway.app).

- `railway.json` — Nixpacks builder, build/start commands, healthcheck, restart policy, and the watch patterns that decide when a push triggers a rebuild.
- `nixpacks.toml` — pins Node 22 and installs devDependencies (`npm ci --include=dev`), which the build needs even with `NODE_ENV=production`.
- `.nvmrc` — same Node version for local work.
- `/api/health` — returns `200 {"status":"ok"}`; Railway waits on it before shifting traffic to a new deploy. It lives outside `app/[locale]/` because the proxy matcher skips `/api`, so it is not caught by the locale redirect.

Railway injects `PORT`; `next start` reads it and binds `0.0.0.0` by default, so no extra flags are needed. The app reads no other environment variables.

First-time setup:

```bash
railway init          # or link an existing project
railway up            # or connect the GitHub repo for push-to-deploy
railway domain        # generate a public URL
```

### Lockfile e versao do npm

A imagem de build do Railway roda **npm 10.9.x** (o que vem com o Node 22), enquanto
o ambiente local pode estar em npm 11. As duas versoes geram `package-lock.json`
diferentes: o npm 11 poda entradas de dependencias opcionais de outras plataformas
(`@emnapi/core`, `@emnapi/runtime`) que o npm 10 exige, e o `npm ci` do build falha
com `can only install packages when your package.json and package-lock.json are in sync`.

O lock commitado foi gerado com npm 10 de proposito — as duas versoes o aceitam.
Se voce rodar `npm install` com npm 11 e o lock mudar, normalize antes de dar push:

```bash
npx npm@10.9.3 install --package-lock-only
npx npm@10.9.3 ci --dry-run   # tem que passar
```

Verify a build locally the way Railway runs it:

```bash
npm ci --include=dev
npm run build
PORT=8080 npm run start
```
