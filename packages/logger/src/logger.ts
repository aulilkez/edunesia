import { createLogger, log, type AuditableLogger } from "evlog";

export type LoggerContext = Record<string, unknown>;
export type DomainLogger = AuditableLogger<LoggerContext>;

export { log as logger };

export function createDomainLogger(domain: string, context: LoggerContext = {}): DomainLogger {
  return createLogger<LoggerContext>({ ...context, domain });
}

/** @deprecated Use a domain-specific logger such as createDatabaseLogger. */
export function createPackageLogger(
  packageName: string,
  context: LoggerContext = {},
): DomainLogger {
  return createLogger<LoggerContext>({ ...context, scope: "package", package: packageName });
}
