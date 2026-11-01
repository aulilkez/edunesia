import type { Database } from "../index";

export interface TransactionOptions {
  backoffMs?: number;
  maxRetries?: number;
}

function isRetryable(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) return false;
  return error.code === "40001" || error.code === "40P01";
}

export async function withTransaction<T>(
  db: Database,
  callback: (transaction: Parameters<Parameters<Database["transaction"]>[0]>[0]) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  const maxRetries = Math.max(0, Math.floor(options.maxRetries ?? 3));
  const backoffMs = Math.max(0, options.backoffMs ?? 100);
  let retries = 0;

  while (true) {
    try {
      return await db.transaction((transaction) => callback(transaction));
    } catch (error: unknown) {
      if (!isRetryable(error) || retries >= maxRetries) throw error;
      const delayMs = backoffMs * 2 ** retries;
      retries += 1;
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
