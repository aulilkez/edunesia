import { initTRPC, TRPCError, type AnyTRPCRouter } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { Auth } from "@edunesia/auth/server";
import type { Database } from "@edunesia/database";
import { AppException } from "./exceptions";
import { createPackageLogger } from "@edunesia/logger";

export function createTRPCContext(input: { auth: Auth; db: Database }) {
  return async (options: FetchCreateContextFnOptions) => {
    const request = options.req;
    const sessionData = request.headers.has("cookie")
      ? await input.auth.api.getSession({ headers: request.headers })
      : null;

    return {
      req: request,
      headers: request.headers,
      db: input.db,
      session: sessionData?.session ?? null,
      user: sessionData?.user ?? null,
    };
  };
}

export type TRPCContext = Awaited<ReturnType<ReturnType<typeof createTRPCContext>>>;

export function createTRPC(isProduction = false) {
  const t = initTRPC.context<TRPCContext>().create({
    errorFormatter: ({ shape, error }) => {
      const cause = error.cause;
      if (cause instanceof AppException) {
        return {
          ...shape,
          message: cause.message,
          data: {
            ...shape.data,
            code: cause.code,
            ...(cause.messageKey ? { messageKey: cause.messageKey } : {}),
            ...(cause.params ? { params: cause.params } : {}),
          },
        };
      }

      if (error.code === "INTERNAL_SERVER_ERROR" && isProduction) {
        return { ...shape, message: "Internal server error" };
      }
      return shape;
    },
  });

  const publicProcedure = t.procedure;
  const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    if (!ctx.user || !ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({ ctx: { ...ctx, user: ctx.user, session: ctx.session } });
  });

  return { router: t.router, publicProcedure, protectedProcedure };
}

export async function handleTRPCRequest<TRouter extends AnyTRPCRouter>(
  request: Request,
  router: TRouter,
  createContext: (options: FetchCreateContextFnOptions) => Promise<unknown>,
): Promise<Response> {
  const logger = createPackageLogger("trpc", { method: request.method, route: "/api/trpc" });
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router,
      createContext,
    });
    logger.set({
      status: response.status,
      outcome: response.status >= 500 ? "error" : "completed",
    });
    if (response.status >= 500) logger.error(new Error("tRPC request failed"));
    return response;
  } catch (error) {
    logger.set({ outcome: "error", errorType: error instanceof Error ? error.name : "unknown" });
    logger.error(new Error("tRPC request failed"));
    throw error;
  } finally {
    logger.emit();
  }
}
