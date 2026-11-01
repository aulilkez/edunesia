# Git workflow

Use Conventional Commits: `type(scope): description`. Allowed types are `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, and `style`. Example: `fix(auth): handle expired sessions`. Lefthook validates commit messages.

Before commit, Lefthook lints staged JavaScript/TypeScript and checks formatting of staged supported files. It does not rewrite staged or unrelated files. Before push, it runs `bun run check` and `bun run test`. E2E remains in CI rather than the local commit hook.

Before a pull request, run `bun run check`, `bun run test`, and relevant build or browser checks. CI runs quality checks, unit tests, the web build, Playwright, and Storybook build.
