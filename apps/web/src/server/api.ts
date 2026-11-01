import { createAuth } from "@edunesia/auth/server";
import { getDatabase } from "@edunesia/database";
import { serverEnv } from "@edunesia/env/server";
import { createTRPCServer } from "@edunesia/trpc";

const database = getDatabase({
  url: serverEnv.DATABASE_URL,
  environment: serverEnv.APP_ENV,
});

export const db = database.db;
export const auth = createAuth(db, serverEnv);
const api = createTRPCServer({
  auth,
  db,
  production: serverEnv.APP_ENV === "production",
});

export const appRouter = api.appRouter;

export const createTRPCContext = api.createContext;
