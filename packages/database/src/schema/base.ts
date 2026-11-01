import { text, timestamp } from "drizzle-orm/pg-core";

export const primaryKeyId = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
};

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const softDelete = {
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
};

export const baseColumns = { ...primaryKeyId, ...timestamps, ...softDelete };
