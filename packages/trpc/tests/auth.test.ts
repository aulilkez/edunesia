import { expect, test } from "vite-plus/test";

import { createTRPC, type TRPCContext } from "../src/server.js";

const unauthenticated = (user: TRPCContext["user"], session: TRPCContext["session"]) =>
  ({ user, session }) as TRPCContext;

test("protected procedures reject missing and unverified sessions", async () => {
  const trpc = createTRPC();
  const router = trpc.router({ private: trpc.protectedProcedure.query(() => "private") });

  await expect(router.createCaller(unauthenticated(null, null)).private()).rejects.toMatchObject({
    code: "UNAUTHORIZED",
  });
  await expect(
    router
      .createCaller(
        unauthenticated(
          {
            id: "member",
            name: "Learner",
            email: "learner@example.com",
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as TRPCContext["user"],
          {
            id: "session",
            userId: "member",
            token: "redacted",
            expiresAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ipAddress: null,
            userAgent: null,
          } as TRPCContext["session"],
        ),
      )
      .private(),
  ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
});
