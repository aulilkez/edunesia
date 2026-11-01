# Contributing

Use Bun 1.4.4 and the repository's Vite+ toolchain. Install dependencies with `bun install`; Lefthook is installed by the root prepare script.

Before submitting a change, run:

```sh
bun run check
bun run test
```

For browser changes, also run `bun run test:e2e`; for UI components, run Storybook with `bun run storybook`. Use the scripts documented in [engineering standards](docs/engineering/coding-standards.md).

Commit messages use `type(scope): description` with the supported types in [Git workflow](docs/engineering/git-workflow.md). Keep changes focused and include tests for changed behavior.
