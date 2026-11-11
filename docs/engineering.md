# Engineering standards

## Repository baseline

The root is a single TanStack Start application using Vite+ 1.3.0 and Bun
1.4.4. `vite.config.ts` is the shared source of truth for Vite+, formatting,
linting, tests, and application plugins. There are no workspace packages in
the root project.

The repository does not currently have Lingui catalogs or Better Auth runtime
configuration. The OAuth and auth variables in `.env.example` are not proof
that authentication flows exist. Keep these features disabled until a separate
implementation establishes the locale/session design.

## Commands

| Purpose                | Command                    |
| ---------------------- | -------------------------- |
| Development            | `bun run dev`              |
| Production build       | `bun run build`            |
| Preview                | `bun run preview`          |
| Format                 | `bun run format`           |
| Format check           | `bun run format:check`     |
| Lint                   | `bun run lint`             |
| Type check             | `bun run typecheck`        |
| Combined static checks | `bun run check`            |
| Unit/integration tests | `bun run test`             |
| Vitest UI              | `bun run test:ui`          |
| Content validation     | `bun run content:validate` |

CI uses the lockfile with `bun install --frozen-lockfile`, then validates
content, runs static checks and tests, and builds the app. No production OAuth
or SMTP secrets are needed by CI.

## Dependency updates

Renovate updates Bun dependencies and `bun.lock`, groups minor/patch and major
updates separately, and does not automerge. Dependabot updates GitHub Actions,
so action references remain independently maintained without duplicate Bun
dependency PRs. Dependabot does not currently own Bun lockfile updates. Enable
GitHub's repository-level dependency graph, Dependabot alerts, and security
updates to receive vulnerability alerts/PRs for supported ecosystems.

## Security scans

The Trivy workflow scans filesystem dependencies, misconfiguration, and
secrets. It fails on CRITICAL/HIGH findings and stores the SARIF output as a
workflow artifact. The current repository does not build a container image, so
CI does not perform image scanning. `.trivyignore` is reserved for explicitly
reviewed, documented, time-bounded exceptions.

## Git hooks

Lefthook is the only Git hook manager. Pre-commit runs Vite+ checks on staged
source files, commit messages must follow Conventional Commits, and pre-push
runs static checks and tests. Hooks are convenience checks; CI remains
authoritative.

## Testing and existing features

Vitest is used for unit and integration tests. `@vitest/ui` is local-only; CI
uses the headless test command. The root currently has no Playwright setup, so
no E2E command is advertised. Add one with a real application flow and browser
configuration rather than a placeholder script.

## Internationalization and authentication

There is no current Lingui or Better Auth runtime in this root project. Avoid
adding duplicate providers or pretending the placeholder environment variables
provide working login or locale handling. Implement these as focused features
once supported locales, identity provider, session strategy, and route
requirements are defined.
