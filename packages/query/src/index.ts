import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, type HTTPBatchLinkOptions } from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";

function readHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  if ("data" in error && typeof error.data === "object" && error.data !== null) {
    if ("httpStatus" in error.data && typeof error.data.httpStatus === "number") {
      return error.data.httpStatus;
    }
  }
  if ("status" in error && typeof error.status === "number") return error.status;
  return undefined;
}

export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config.defaultOptions,
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          const status = readHttpStatus(error);
          return failureCount < 2 && (status === undefined || status >= 500);
        },
        ...config.defaultOptions?.queries,
      },
      mutations: { retry: false, ...config.defaultOptions?.mutations },
    },
  });
}

export function createAPIClient<TRouter extends AnyTRPCRouter>(
  options: HTTPBatchLinkOptions<TRouter["_def"]["_config"]["$types"]>,
) {
  return createTRPCClient<TRouter>({ links: [httpBatchLink(options)] });
}

export function createAPIContext<TRouter extends AnyTRPCRouter>() {
  return createTRPCContext<TRouter>();
}
