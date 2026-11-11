import { createFileRoute } from "@tanstack/react-router";

import { handleTRPCRequest } from "@/lib/server/trpc";

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleTRPCRequest(request),
      POST: ({ request }) => handleTRPCRequest(request),
    },
  },
});
