# @edunesia/logger

Structured logging helpers built on the application's shared Evlog configuration. TanStack Start loads `apps/web/evlog.config.ts`; workspace packages must not initialize Evlog again.

## Domain loggers

Use the domain factory for an operation and emit once when it completes:

```ts
import { createDatabaseLogger } from "@edunesia/logger";

const logger = createDatabaseLogger("transaction", { operation: "workspace_update" });
try {
  // Perform the database operation.
  logger.set({ outcome: "success" });
} catch (error) {
  logger.set({ outcome: "error", errorType: error instanceof Error ? error.name : "unknown" });
  logger.error(new Error("Database transaction failed"));
  throw error;
} finally {
  logger.emit();
}
```

Available factories cover auth, database, web, security, and audit events. Add only safe contextual metadata, such as an operation name, status, or request ID. Do not log credentials, cookies, request bodies, personal data, or query contents. The shared configuration redacts sensitive key names and built-in secret patterns.

TanStack Start already emits API request events with status, duration, and request context. Avoid adding another event for the same request in tRPC or route handlers. Use explicit domain events for meaningful operations and failures that need their own event.
