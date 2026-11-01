import { expect, test } from "vite-plus/test";
import { createQueryClient } from "../src";

test("shared query client retries queries and avoids mutation retries", () => {
  const queryClient = createQueryClient();
  const queryOptions = queryClient.getDefaultOptions().queries;
  const mutationOptions = queryClient.getDefaultOptions().mutations;

  expect(queryOptions?.staleTime).toBe(30_000);
  expect(queryOptions?.gcTime).toBe(300_000);
  const retry = queryOptions?.retry;
  expect(typeof retry).toBe("function");
  if (typeof retry === "function") {
    expect(retry(0, new Error("server error"))).toBe(true);
    expect(retry(2, new Error("server error"))).toBe(false);
  }
  expect(mutationOptions?.retry).toBe(false);
  queryClient.clear();
});
