import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const validatedClientEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_NAME: z.string().trim().min(1).default("Edunesia"),
    VITE_APP_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  },
  emptyStringAsUndefined: true,
});

export const clientEnv = Object.freeze({
  APP_NAME: validatedClientEnv.VITE_APP_NAME,
  APP_URL: validatedClientEnv.VITE_APP_URL,
});

export type ClientEnv = typeof clientEnv;
