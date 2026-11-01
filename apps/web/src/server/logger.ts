import { log } from "evlog";

export function logWebsiteRequestFailure(input: {
  action: string;
  route: string;
  method: string;
  error: unknown;
}): void {
  log.error({
    scope: "website",
    action: input.action,
    route: input.route,
    method: input.method,
    errorType: input.error instanceof Error ? input.error.name : "unknown",
  });
}
