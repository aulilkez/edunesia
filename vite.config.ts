import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
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
  },
  lint: {
    ignorePatterns: ["adi/**", "apps/web/src/routeTree.gen.ts"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "no-debugger": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["tests/**/*.{test,spec}.ts", "packages/*/tests/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "apps/**"],
    clearMocks: true,
    restoreMocks: true,
  },
  run: {
    cache: true,
  },
});
