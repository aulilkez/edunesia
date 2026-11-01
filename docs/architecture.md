# Architecture notes

The migrated ADI packages own the established auth, database, environment, i18n, logger, query, tRPC, and UI implementations. The health route and app shell live in `apps/web`.

TanStack Query owns remote/server state. Zustand currently owns the workspace theme, the cross-component client preference. The authentication validation schemas stay with `packages/auth` because their policy is specific to account creation and sign-in. A separate validators package should be added when a schema is shared across domains.

There is no authored Markdown or MDX content yet, so `content/` is reserved for it and no MDX compiler dependency is installed. Add a content package when a feature introduces MDX parsing or a reusable content API.
