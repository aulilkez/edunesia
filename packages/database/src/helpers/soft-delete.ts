import { isNull, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export function whereNotDeleted<TCol extends AnyPgColumn>(deletedAtColumn: TCol): SQL {
  return isNull(deletedAtColumn);
}

export function markAsDeleted(): { deletedAt: Date } {
  return { deletedAt: new Date() };
}

export function restoreDeleted(): { deletedAt: null } {
  return { deletedAt: null };
}
