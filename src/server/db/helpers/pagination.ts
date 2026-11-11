import { gt, lt, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function paginate<T>(
  query: Promise<T[]>,
  totalCountQuery: Promise<{ count: number | string }[]>,
  params: PaginationParams = {},
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(params.pageSize ?? 20)));
  const [data, countResult] = await Promise.all([query, totalCountQuery]);
  const totalItems = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function getOffset(params: PaginationParams = {}): number {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(params.pageSize ?? 20)));

  return (page - 1) * pageSize;
}

export interface CursorPaginationParams<TOrder = string | number | Date> {
  cursor?: TOrder;
  direction?: "forward" | "backward";
  limit?: number;
}

export function buildCursorClause<TCol extends AnyPgColumn>(
  column: TCol,
  cursor?: unknown,
  direction: "forward" | "backward" = "forward",
): SQL | undefined {
  if (cursor === undefined || cursor === null) return undefined;
  return direction === "forward" ? gt(column, cursor) : lt(column, cursor);
}
