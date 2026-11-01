# @edunesia/logger

Shared structured logging helpers for Edunesia workspace packages.

## Package usage

Create one logger per operation and always emit it when the operation ends:

```ts
import { createPackageLogger } from "@edunesia/logger";

const logger = createPackageLogger("database", { action: "connection_check" });
try {
  // Perform the package operation.
  logger.set({ outcome: "success" });
} catch (error) {
  logger.set({ outcome: "error", errorType: error instanceof Error ? error.name : "unknown" });
  logger.error(new Error("Database operation failed"));
  throw error;
} finally {
  logger.emit();
}
```

The host application owns evlog initialization, environment settings, drains, and redaction. This package does not initialize global logging or send logs to an external service. Log metadata must not include secrets, credentials, personal data, or dataset contents.
