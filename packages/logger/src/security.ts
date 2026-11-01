import { createDomainLogger, type LoggerContext } from "./logger";

export type SecurityLogAction = "rate_limit" | "unauthorized" | "suspicious_activity";

export function createSecurityLogger(action: SecurityLogAction, context: LoggerContext = {}) {
  return createDomainLogger("security", { ...context, action });
}
