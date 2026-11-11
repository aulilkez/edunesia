import { afterAll, describe, expect, it } from "vite-plus/test";

import { database } from "../db/connection";
import { createTRPCContext } from "./context";

afterAll(async () => {
  await database.client.end();
});

describe("createTRPCContext", () => {
  it("reuses the database and preserves a valid request ID", () => {
    const request = new Request("http://localhost/api/trpc", {
      headers: { "x-request-id": "request-123" },
    });

    const context = createTRPCContext({ req: request });

    expect(context.req).toBe(request);
    expect(context.db).toBe(database.db);
    expect(context.requestId).toBe("request-123");
  });

  it("replaces malformed request IDs", () => {
    const context = createTRPCContext({
      req: new Request("http://localhost/api/trpc", {
        headers: { "x-request-id": "bad id" },
      }),
    });

    expect(context.requestId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
