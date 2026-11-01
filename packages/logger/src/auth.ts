import { createDomainLogger, type LoggerContext } from "./logger";

export type AuthLogAction = "login" | "logout" | "register" | "session";

export function createAuthLogger(action: AuthLogAction, context: LoggerContext = {}) {
  return createDomainLogger("auth", { ...context, action });
}
