import { serverEnv } from "@/lib/env/server";
import { getDatabase } from "@/db";

export const database = getDatabase({
  url: serverEnv.DATABASE_URL,
  environment: serverEnv.APP_ENV,
});
