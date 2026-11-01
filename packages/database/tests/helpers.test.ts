import { expect, test } from "vite-plus/test";

import { markAsDeleted, paginate, restoreDeleted } from "../src/helpers";

test("pagination clamps invalid limits and reports navigation metadata", async () => {
  const result = await paginate(Promise.resolve(["row"]), Promise.resolve([{ count: 205 }]), {
    page: 0,
    pageSize: 500,
  });

  expect(result.pagination).toEqual({
    page: 1,
    pageSize: 100,
    totalItems: 205,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: false,
  });
});

test("soft-delete helpers create and restore timestamps", () => {
  expect(markAsDeleted().deletedAt).toBeInstanceOf(Date);
  expect(restoreDeleted()).toEqual({ deletedAt: null });
});
