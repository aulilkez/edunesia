import { createLogger } from "evlog";

export type PackageLoggerContext = Record<string, unknown>;

/** Create one manually emitted evlog event scoped to a shared workspace package. */
export function createPackageLogger(packageName: string, context: PackageLoggerContext = {}) {
  return createLogger({ ...context, scope: "package", package: packageName });
}
