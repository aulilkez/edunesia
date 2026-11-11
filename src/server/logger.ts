import "@tanstack/react-start/server-only";

import { createLogger, type AuditableLogger } from "evlog";

export type LoggerContext = Record<string, unknown>;
export type DomainLogger = AuditableLogger<LoggerContext>;

export function createDomainLogger(domain: string, context: LoggerContext = {}): DomainLogger {
  return createLogger<LoggerContext>({ ...context, domain });
}

export function createWebLogger(context: LoggerContext = {}): DomainLogger {
  return createDomainLogger("web", context);
}

export function logWebsiteRequestFailure(input: {
  action: string;
  route: string;
  method: string;
  error: unknown;
  requestId?: string;
}): void {
  const logger = createWebLogger({
    action: input.action,
    route: input.route,
    method: input.method,
    ...(input.requestId ? { requestId: input.requestId } : {}),
    errorType: input.error instanceof Error ? input.error.name : "unknown",
  });
  logger.error(new Error("Web request failed"));
  logger.emit();
}
