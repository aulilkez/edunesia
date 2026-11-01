import { serverEnv } from "@edunesia/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: serverEnv.DATABASE_URL },
  strict: true,
  verbose: true,
});
