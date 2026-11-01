import { createDomainLogger, type LoggerContext } from "./logger";

export function createWebLogger(context: LoggerContext = {}) {
  return createDomainLogger("web", context);
}
