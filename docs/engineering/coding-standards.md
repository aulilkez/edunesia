# Coding standards

Edunesia uses Bun, Vite+, Oxlint, Oxfmt, and strict TypeScript. Run `bun run check` before opening a pull request. Keep changes focused and follow the package boundaries in [monorepo guidelines](monorepo-guidelines.md).

Use the formatter instead of hand-aligning code. Do not suppress lint rules globally; a narrow suppression must name its rule and explain why it is needed. Avoid `any`, debugging statements, circular imports, and unneeded abstractions.

See [linting and formatting](linting-and-formatting.md), [TypeScript](typescript-guidelines.md), [naming](naming-conventions.md), [testing](testing-guidelines.md), and [Git workflow](git-workflow.md) for the specific conventions.
