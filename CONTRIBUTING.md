# Contributing

## Setup

Use the Bun version declared in `package.json`:

```sh
bun install
cp .env.example .env
bun run dev
```

The development and production build scripts validate curated content before
starting Vite. Content Collections also validates frontmatter and MDX while
generating its typed output.

## Quality checks

```sh
bun run content:validate
bun run format:check
bun run lint
bun run typecheck
bun run test
bun run build
```

`bun run check` combines formatting, linting, and type checking. Use
`bun run test:ui` for the local Vitest UI; CI runs tests headlessly. Lefthook
runs staged checks before commits, validates Conventional Commit messages, and
runs static checks plus tests before pushes.

## Content

Read [content/README.md](./content/README.md) before adding courses or lessons.
Only curated Git-managed MDX is compiled. Community content must use the
non-evaluating Markdown renderer and must never be treated as trusted MDX.

## Dependencies and security

Renovate owns Bun dependency and lockfile updates. Dependabot owns GitHub
Actions updates; GitHub's repository-level Dependabot alerts/security updates
should be enabled for dependency vulnerabilities. Trivy CI scans dependencies,
configuration, and secrets, and fails on CRITICAL/HIGH findings. Add exceptions
to `.trivyignore` only after review, with a reason and expiry recorded in the
associated change.

## Authentication and translations

The root application currently has no Better Auth or Lingui runtime. Auth-like
environment variables are placeholders and do not implement authentication.
Do not add private routes or translation catalogs until the corresponding
provider/locale design is agreed and implemented.
