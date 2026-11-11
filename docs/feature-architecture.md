# Feature architecture

## Adding a feature

Create `src/features/<feature>/` only when the feature has real code. Keep
domain UI and feature-specific client logic there; put server operations in
the corresponding `src/server/<domain>/` area. Export only the supported
cross-feature surface from the feature's `index.ts`.

Shared Shadcn UI remains in `src/components/ui/`. Do not copy it into a feature
or create an abstraction for a one-off component.

## Routes

TanStack file routes stay in `src/routes/`. A route owns its URL and params,
loader, metadata, and not-found/auth checks. It calls feature APIs and renders
feature pages; domain presentation and reusable behavior belong in the feature.
Use route loaders for server/data preparation and preserve the existing tRPC
and SSR QueryClient flow for API data.

The current `/courses` and lesson routes demonstrate the split:
`src/routes/` resolves metadata and content, while
`src/features/learning/pages/` owns the course and lesson UI. Curated content
access and MDX rendering are exposed by `src/features/content/index.ts`.

## Current domains

- `content`: schemas, relationship validation, published collection queries,
  MDX validation, and curated content rendering.
- `learning`: course catalog and lesson page presentation.
- `community`: safe Markdown renderer for untrusted community-authored text.

Auth and i18n are not represented as empty features because the root app does
not yet contain working Better Auth or Lingui implementations.
