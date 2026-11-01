# Edunesia

Edunesia is a Bun and Vite+ monorepo. The web app uses TanStack Start, React, Tailwind CSS, Better Auth, PostgreSQL/Drizzle, tRPC, TanStack Query, Lingui, and shared UI and form packages.

## Workspace

- `apps/web`: TanStack Start routes, features, API handlers, and app providers.
- `packages/auth`: Better Auth server/client setup and auth schemas.
- `packages/database`: PostgreSQL connection, Drizzle schemas, helpers, and migrations.
- `packages/env`: Zod validated client and server environment.
- `packages/i18n`: Lingui locale catalogs and locale utilities.
- `packages/query` and `packages/trpc`: typed API and query integration.
- `packages/ui`: shared shadcn-style components, styles, and utilities.
- `packages/logger`: shared logging setup.
- `packages/config`: shared TypeScript base configuration.
- `content`, `docs`, and `tooling`: project content, documentation, and scripts.

## Setup

Install Bun 1.4.4 and run:

```sh
bun install
cp .env.example .env
docker compose up -d postgres
vp run dev
```

The local database uses `postgres://postgres:postgres@localhost:5432/edunesia`. `.env.example` contains development placeholders only. Set OAuth client credentials to enable either optional provider.

## Commands

```sh
vp check
vp run -r test
vp run web#build
vp run web#test:e2e
vp run web#storybook
vp run web#storybook:build
vp run @edunesia/database#db:generate
vp run @edunesia/database#db:migrate
vp run @edunesia/database#db:studio
k6 run tooling/k6/trpc-health.js
docker compose down
```

`db:generate` creates a new Drizzle migration from schema changes; review generated SQL before applying it with `db:migrate`. Migrations do not run automatically during startup.

Playwright uses the installed Google Chrome locally and the Chromium browser in CI. Install k6 separately to run the load smoke script. The theme is the current Zustand UI store; server data remains in TanStack Query.
