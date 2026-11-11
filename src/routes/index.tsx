import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { useTRPC } from "@/lib/trpc";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(context.trpc.health.check.queryOptions()),
  component: Home,
});

function Home() {
  const trpc = useTRPC();
  const health = useSuspenseQuery(trpc.health.check.queryOptions());

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <p className="mt-4 text-sm" role="status">
        API status: {health.data.status} (database: {health.data.database})
      </p>
    </div>
  );
}
