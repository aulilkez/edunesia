import { index, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { baseColumns } from "./base";
import { dataFormats, datasetStatuses } from "./enums";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const datasets = pgTable(
  "datasets",
  {
    ...baseColumns,
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdById: text("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description"),
    format: text("format").$type<(typeof dataFormats)[number]>().default("csv").notNull(),
    status: text("status").$type<(typeof datasetStatuses)[number]>().default("draft").notNull(),
    rowCount: integer("row_count").default(0).notNull(),
    sizeBytes: integer("size_bytes").default(0).notNull(),
    schemaDefinition: jsonb("schema_definition").$type<Record<string, unknown>>().default({}),
  },
  (table) => [
    index("datasets_workspace_id_idx").on(table.workspaceId),
    index("datasets_created_by_id_idx").on(table.createdById),
    index("datasets_status_idx").on(table.status),
    index("datasets_deleted_at_idx").on(table.deletedAt),
  ],
);
