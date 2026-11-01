# Linting and formatting

Oxlint is the only linter and Oxfmt is the only formatter. Both are run by the installed Vite+ toolchain; do not add ESLint, Prettier, or Biome.

Run `bun run lint`, `bun run lint:fix`, `bun run format`, and `bun run format:check`. Formatting uses two spaces, double quotes, semicolons, trailing commas, LF endings, and a 100-character print width. Imports are grouped as Node built-ins, third-party dependencies, `@edunesia/*`, app aliases, then relative paths.

Oxlint enables recommended plugin rules and type-aware checking, React Hooks checks in React packages, unused-variable and `any` checks, cycle detection, test focus/skip detection, and unused-suppression warnings. Keep exceptions targeted to the relevant file and rule.
