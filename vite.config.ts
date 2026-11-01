import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["adi/**", "apps/web/src/routeTree.gen.ts"],
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    endOfLine: "lf",
    sortPackageJson: true,
    sortImports: {
      internalPattern: ["@edunesia/**", "@/*"],
      customGroups: [
        { groupName: "workspace", elementNamePattern: ["@edunesia/**"] },
        { groupName: "app-alias", elementNamePattern: ["@/**"] },
      ],
      groups: [
        "builtin",
        "external",
        "workspace",
        "app-alias",
        ["parent", "sibling", "index"],
        "unknown",
      ],
      newlinesBetween: true,
    },
  },
  lint: {
    ignorePatterns: ["adi/**", "apps/web/src/routeTree.gen.ts"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "vitest"],
    rules: {
      "no-debugger": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "vite-plus/prefer-vite-plus-imports": "error",
      "eslint/no-unused-vars": "error",
      "typescript/no-explicit-any": "error",
      "import/no-cycle": "error",
      "eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@edunesia/*/src/**"],
              message: "Import workspace packages through their declared public exports.",
            },
          ],
        },
      ],
      "vitest/no-disabled-tests": "error",
      "vitest/no-focused-tests": "error",
    },
    overrides: [
      {
        files: ["apps/web/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
        plugins: ["react"],
        rules: { "react/rules-of-hooks": "error", "react/exhaustive-deps": "warn" },
      },
      {
        files: ["**/*.test.{ts,tsx}", "**/*.spec.ts"],
        rules: { "no-console": "off", "vitest/no-conditional-expect": "off" },
      },
    ],
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: "warn" },
  },
  test: {
    include: ["tests/**/*.{test,spec}.{ts,tsx}", "packages/*/tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "apps/**"],
    clearMocks: true,
    restoreMocks: true,
  },
  run: {
    cache: true,
  },
});
