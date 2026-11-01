# Monorepo guidelines

Applications live in `apps/`; reusable, independently owned capabilities live in `packages/`. Keep app-specific behavior inside that app or feature. Extract shared code only when multiple consumers need the same responsibility.

Consume workspace packages through their declared `@edunesia/*` exports. Do not import another package's `src/` implementation directly. Add public entry points in that package's `exports` map and keep dependencies explicit. Avoid circular dependencies and unnecessary barrels. `tooling/`, `scripts/`, and root configuration follow the same lint and format rules.
