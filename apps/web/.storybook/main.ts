import type { StorybookConfig } from "@storybook/react-vite";

function filterTanStackStartPlugins(plugin: unknown): unknown {
  if (Array.isArray(plugin)) {
    return plugin.map(filterTanStackStartPlugins).filter((item) => item !== undefined);
  }
  if (
    typeof plugin === "object" &&
    plugin !== null &&
    "name" in plugin &&
    String(plugin.name).startsWith("tanstack-start:")
  ) {
    return undefined;
  }
  return plugin;
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: viteConfig.plugins
      ?.map(filterTanStackStartPlugins)
      .filter((plugin) => plugin !== undefined) as typeof viteConfig.plugins,
  }),
};

export default config;
