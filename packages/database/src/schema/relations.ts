import { relations } from "drizzle-orm";

import { datasets } from "./datasets";
import { accounts, sessions, users, verifications } from "./users";
import { workspaces } from "./workspaces";

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  workspaces: many(workspaces),
  datasets: many(datasets),
}));
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, { fields: [workspaces.ownerId], references: [users.id] }),
  datasets: many(datasets),
}));
export const datasetsRelations = relations(datasets, ({ one }) => ({
  workspace: one(workspaces, { fields: [datasets.workspaceId], references: [workspaces.id] }),
  createdBy: one(users, { fields: [datasets.createdById], references: [users.id] }),
}));
export const verificationsRelations = relations(verifications, () => ({}));
