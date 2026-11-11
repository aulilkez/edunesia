import "@tanstack/react-start/server-only";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "./context";
import { appRouter } from "./routers/_app";

export { appRouter };
export type { AppRouter } from "./routers/_app";

export function handleTRPCRequest(request: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ req: request }),
  });
}
