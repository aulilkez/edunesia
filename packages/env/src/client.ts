const viteEnv =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

/** Explicit browser-safe environment allowlist. Never add secrets here. */
export const clientEnv = Object.freeze({
  APP_NAME: viteEnv.VITE_APP_NAME?.trim() || "Edunesia",
  APP_URL: viteEnv.VITE_APP_URL?.trim() || "",
});

export type ClientEnv = typeof clientEnv;
