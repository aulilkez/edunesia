# Naming conventions

- React components and component files: `PascalCase`.
- Hooks: `useCamelCase`; functions and variables: `camelCase`.
- Types and interfaces: `PascalCase`; Zod schemas: `camelCaseSchema`.
- Reserve `UPPER_SNAKE_CASE` for true immutable constants.
- Utility and feature files: `kebab-case`.
- Unit and integration tests: `*.test.ts` or `*.test.tsx`; browser tests: `*.spec.ts`.

Framework-required filenames are exceptions: TanStack route files follow route conventions, `__root.tsx` is the root route, and `routeTree.gen.ts` is generated. Do not edit generated route output by hand.
