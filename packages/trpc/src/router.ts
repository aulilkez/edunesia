import { and, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";

import type { Auth } from "@edunesia/auth/server";
import type { Database } from "@edunesia/database";
import { workspaces } from "@edunesia/database/schema";
import { catalogs } from "@edunesia/i18n";

import { createTRPC, createTRPCContext } from "./server";

/** Creates the app-bound context and procedure helpers; app routers remain app-owned. */
export function createTRPCServer(input: { auth: Auth; db: Database; production?: boolean }) {
  const trpc = createTRPC(input.production ?? false);
  const createContext = createTRPCContext({ auth: input.auth, db: input.db });
  const health = trpc.publicProcedure.query(async ({ ctx }) => {
    const startedAt = performance.now();
    let databaseStatus: "ok" | "error" = "ok";

    try {
      await ctx.db.execute(sql`select 1 as ready`);
    } catch {
      databaseStatus = "error";
    }

    const i18nStatus = Object.keys(catalogs).length > 0 ? "ok" : "error";
    return {
      status: databaseStatus === "ok" && i18nStatus === "ok" ? ("ok" as const) : ("error" as const),
      database: { status: databaseStatus },
      i18n: { status: i18nStatus },
      durationMs: Math.round(performance.now() - startedAt),
      checkedAt: new Date().toISOString(),
    };
  });

  const users = trpc.router({
    me: trpc.protectedProcedure.query(({ ctx }) => ({
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      emailVerified: ctx.user.emailVerified,
      image: ctx.user.image,
    })),
  });

  const createWorkspace = trpc.protectedProcedure
    .input(z.object({ name: z.string().trim().min(2).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const slugBase =
        input.name
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 48) || "workspace";

      return ctx.db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${ctx.user.id}, 0))`);
        const [existing] = await tx
          .select({ id: workspaces.id, name: workspaces.name, slug: workspaces.slug })
          .from(workspaces)
          .where(and(eq(workspaces.ownerId, ctx.user.id), isNull(workspaces.deletedAt)))
          .limit(1);
        if (existing) return existing;

        for (let suffix = 0; suffix < 100; suffix += 1) {
          const slug = suffix === 0 ? slugBase : `${slugBase}-${suffix + 1}`;
          const [created] = await tx
            .insert(workspaces)
            .values({ name: input.name, slug, ownerId: ctx.user.id })
            .onConflictDoNothing({ target: workspaces.slug })
            .returning({ id: workspaces.id, name: workspaces.name, slug: workspaces.slug });
          if (created) return created;
        }
        throw new Error("Could not allocate a workspace slug.");
      });
    });

  const workspacesRouter = trpc.router({ createForCurrentUser: createWorkspace });
  const appRouter = trpc.router({ health, users, workspaces: workspacesRouter });
  return { ...trpc, appRouter, createContext };
}

export type AppRouter = ReturnType<typeof createTRPCServer>["appRouter"];
