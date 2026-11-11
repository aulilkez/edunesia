# Server and client boundaries

## Server code

Put database connections, Drizzle schema/operations, migration helpers,
server-side tRPC, and server logging under `src/server/`. These modules may
read `serverEnv`; they must not be imported by browser components or hooks.

The database entry points and tRPC context use
`@tanstack/react-start/server-only` to make accidental client imports fail.
The Drizzle CLI config and migration runner are root/tooling entry points and
use server environment values only.

## Client and universal code

Browser UI and feature-specific presentation belong in `src/features/*`.
Shared Shadcn components stay in `src/components/ui/`; cross-feature hooks and
safe utilities stay in `src/hooks/` and `src/lib/`.

Use `clientEnv` from `src/lib/env/client.ts` for approved `VITE_*` settings.
Use `serverEnv` only in server modules. `src/lib/trpc.ts` is the established
isomorphic client adapter; browser code should use its hooks and query options,
not create another tRPC or query client.

Content schemas, public collection queries, and rendering are safe to use in
routes/features. They contain public Git-managed content and no database
connection or secrets. Community Markdown uses its separate safe renderer;
trusted MDX remains restricted to curated content.

## Import direction

- Routes may import feature public APIs and shared infrastructure.
- Features may import shared UI/utilities and another feature's public
  `index.ts` API, not its internal implementation.
- Server modules may import server and universal modules, never browser hooks
  or UI.
- Shared modules must not import `src/server/**` or `serverEnv`.
- Keep generated route/content files out of manual edits.

The framework's `server-only` marker is the current hard boundary check. Keep
imports explicit and use feature entry points for cross-feature dependencies;
the root does not currently have a separate dependency-boundary lint plugin.
