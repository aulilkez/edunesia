import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { createAPIClient, createQueryClient } from "@edunesia/query";
import type { AppRouter } from "@edunesia/trpc";

import { loadOfficialLesson } from "./lib/official-content";
import { getTRPCHeaders, getTRPCUrl, TRPCProvider } from "./lib/trpc";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = createQueryClient();
  const trpcClient = createAPIClient<AppRouter>({ url: getTRPCUrl(), headers: getTRPCHeaders });
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient, loadOfficialLesson },
    Wrap: ({ children }) => (
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    ),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
