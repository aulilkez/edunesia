# Testing guidelines

Use Vitest for unit and integration tests, placed beside the package's `tests/` directory and named `*.test.ts` or `*.test.tsx`. Use Testing Library for user-visible React behavior. Keep tests deterministic and isolate external services.

Use Playwright `*.spec.ts` tests for browser flows. E2E runs in CI and on demand, not in every commit hook. Use Storybook for interactive component examples. k6 scripts belong in `tooling/k6/` and are run with `bun run test:load` against an available API.

Commands: `bun run test`, `bun run test:watch`, `bun run test:coverage`, and `bun run test:e2e`. Do not add tests that depend on production data or secrets.
