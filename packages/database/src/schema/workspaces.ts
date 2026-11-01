import { index, jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { baseColumns } from "./base";
import { users } from "./users";

export const workspaces = pgTable(
  "workspaces",
  {
    ...baseColumns,
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
  },
  (table) => [
    uniqueIndex("workspaces_slug_idx").on(table.slug),
    index("workspaces_owner_id_idx").on(table.ownerId),
    index("workspaces_deleted_at_idx").on(table.deletedAt),
  ],
);
