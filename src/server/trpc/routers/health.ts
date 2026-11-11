import { sql } from "drizzle-orm";

import { publicProcedure, router } from "../init";

export const healthRouter = router({
  check: publicProcedure.query(async ({ ctx }) => {
    try {
      await ctx.db.execute(sql`select 1`);
      return {
        status: "ok" as const,
        database: "ok" as const,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      ctx.logger.error(new Error("Database health check failed"), {
        action: "health.database.error",
        errorType: error instanceof Error ? error.name : "unknown",
      });
      ctx.logger.emit();

      return {
        status: "error" as const,
        database: "error" as const,
        checkedAt: new Date().toISOString(),
      };
    }
  }),
});
