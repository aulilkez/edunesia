import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    channel: process.env.CI ? undefined : "chrome",
    baseURL: "http://127.0.0.1:4178",
  },
  webServer: {
    command: "vp dev --host 127.0.0.1 --port 4178",
    url: "http://127.0.0.1:4178/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
