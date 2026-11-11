import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  const status =
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "httpStatus" in error.data &&
    typeof error.data.httpStatus === "number"
      ? error.data.httpStatus
      : undefined;

  return failureCount < 2 && (status === undefined || status >= 500);
}

export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config.defaultOptions,
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: shouldRetryQuery,
        ...config.defaultOptions?.queries,
      },
      mutations: { retry: false, ...config.defaultOptions?.mutations },
    },
  });
}
