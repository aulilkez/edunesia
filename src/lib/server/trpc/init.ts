import "@tanstack/react-start/server-only";

import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import { serverEnv } from "@/lib/env/server";

import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      message:
        serverEnv.APP_ENV === "production" && error.code === "INTERNAL_SERVER_ERROR"
          ? "Internal server error"
          : shape.message,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const loggingMiddleware = t.middleware(async ({ ctx, path, type, next }) => {
  const result = await next();

  if (!result.ok && result.error.code === "INTERNAL_SERVER_ERROR") {
    ctx.logger.error(new Error("tRPC procedure failed"), {
      action: "trpc.procedure.error",
      path,
      type,
      errorType: result.error.cause instanceof Error ? result.error.cause.name : "unknown",
    });
    ctx.logger.emit();
  }

  return result;
});

export const router = t.router;
export const publicProcedure = t.procedure.use(loggingMiddleware);
export type { TRPCContext };
