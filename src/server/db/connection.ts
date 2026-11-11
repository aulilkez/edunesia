import "@tanstack/react-start/server-only";

import { serverEnv } from "@/lib/env/server";
import { getDatabase } from "@/server/db";

export const database = getDatabase({
  url: serverEnv.DATABASE_URL,
  environment: serverEnv.APP_ENV,
});
