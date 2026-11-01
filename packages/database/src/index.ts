import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export * from "./schema";
export * from "./types";

export interface DatabaseOptions {
  url: string;
  environment?: "development" | "test" | "staging" | "production";
}

export function createDatabase({ url, environment = "development" }: DatabaseOptions) {
  const client = postgres(url, { max: environment === "production" ? 10 : 1 });
  const db = drizzle({ client, schema });
  return { client, db };
}

declare global {
  var __edunesiaDatabase: ReturnType<typeof createDatabase> | undefined;
}

export function getDatabase(options: DatabaseOptions): ReturnType<typeof createDatabase> {
  globalThis.__edunesiaDatabase ??= createDatabase(options);
  return globalThis.__edunesiaDatabase;
}

export type Database = ReturnType<typeof createDatabase>["db"];
