import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { datasets, users, workspaces } from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users, {
  email: z.email(),
  name: z.string().trim().min(1).max(255),
});
export const updateUserSchema = createUpdateSchema(users, {
  email: z.email().optional(),
  name: z.string().trim().min(1).max(255).optional(),
});

export type Workspace = InferSelectModel<typeof workspaces>;
export type NewWorkspace = InferInsertModel<typeof workspaces>;
export const selectWorkspaceSchema = createSelectSchema(workspaces);
export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  name: z.string().trim().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
});
export const updateWorkspaceSchema = createUpdateSchema(workspaces, {
  name: z.string().trim().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export type Dataset = InferSelectModel<typeof datasets>;
export type NewDataset = InferInsertModel<typeof datasets>;
export const selectDatasetSchema = createSelectSchema(datasets);
export const insertDatasetSchema = createInsertSchema(datasets, {
  name: z.string().trim().min(1).max(255),
  description: z.string().max(1000).optional(),
});
export const updateDatasetSchema = createUpdateSchema(datasets, {
  name: z.string().trim().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
});
