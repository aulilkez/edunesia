import { defineConfig, lazyPlugins } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import evlog from "evlog/vite";
// loadEnv is a Vite helper not re-exported by Vite+.
// oxlint-disable-next-line vite-plus/prefer-vite-plus-imports
import { loadEnv } from "vite";

const config = defineConfig(({ mode }) => {
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
    fmt: {
      ignorePatterns: ["src/routeTree.gen.ts"],
    },
    lint: {
      jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
      rules: { "vite-plus/prefer-vite-plus-imports": "error" },
      options: { typeAware: true, typeCheck: true },
    },
    test: {
      include: ["src/**/*.test.{ts,tsx}"],
    },
    resolve: { tsconfigPaths: true },
    plugins: lazyPlugins(() => [
      contentCollections(),
      devtools(),
      evlog(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ]),
  };
});

export default config;
