import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createTRPCClient, httpBatchLink, localLink, type TRPCLink } from "@trpc/client";
import { createTRPCContext, createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { QueryClient } from "@tanstack/react-query";

import { createTRPCContext as createServerTRPCContext } from "@/lib/server/trpc/context";

import { appRouter, type AppRouter } from "./server/trpc";

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

const getLinks = createIsomorphicFn()
  .server((): TRPCLink<AppRouter>[] => [
    localLink({
      router: appRouter,
      createContext: async () => createServerTRPCContext({ req: getRequest() }),
    }),
  ])
  .client((): TRPCLink<AppRouter>[] => [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ]);

export function makeTRPCClient() {
  return createTRPCClient<AppRouter>({ links: getLinks() });
}

export function createTRPCOptions(
  client: ReturnType<typeof makeTRPCClient>,
  queryClient: QueryClient,
) {
  return createTRPCOptionsProxy<AppRouter>({ client, queryClient });
}

export type { AppRouter };
