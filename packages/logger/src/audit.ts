import { createDomainLogger, type LoggerContext } from "./logger";

export function createAuditLogger(action: string, context: LoggerContext = {}) {
  return createDomainLogger("audit", { ...context, action });
}
