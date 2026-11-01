import { createWebLogger } from "@edunesia/logger";

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
