import { defineConfig } from "drizzle-kit";

import { serverEnv } from "./src/lib/env/server";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: serverEnv.DATABASE_URL },
  strict: true,
  verbose: true,
});
