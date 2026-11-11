import "@tanstack/react-start/server-only";

import type { Database } from "@/server/db";
import { database } from "@/server/db/connection";
import { createWebLogger, type DomainLogger } from "@/server/logger";

export interface TRPCContext {
  req: Request;
  db: Database;
  requestId: string;
  logger: DomainLogger;
}

export function createTRPCContext(input: { req: Request }): TRPCContext {
  const incomingRequestId = input.req.headers.get("x-request-id");
  const requestId =
    incomingRequestId && /^[a-zA-Z0-9._:-]{1,128}$/.test(incomingRequestId)
      ? incomingRequestId
      : crypto.randomUUID();

  return {
    req: input.req,
    db: database.db,
    requestId,
    logger: createWebLogger({ requestId }),
  };
}
