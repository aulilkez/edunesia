import { createDomainLogger, type LoggerContext } from "./logger";

export type DatabaseLogAction = "transaction" | "connection_error" | "migration_error";

export function createDatabaseLogger(action: DatabaseLogAction, context: LoggerContext = {}) {
  return createDomainLogger("database", { ...context, action });
}
