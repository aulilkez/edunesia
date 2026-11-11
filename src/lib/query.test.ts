import { describe, expect, it } from "vite-plus/test";

import { createQueryClient, shouldRetryQuery } from "./query";

describe("createQueryClient", () => {
  it("creates an isolated cache for each router instance", () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });

  it("uses a bounded freshness window", () => {
    expect(createQueryClient().getDefaultOptions().queries?.staleTime).toBe(30_000);
  });
});

describe("shouldRetryQuery", () => {
  it("does not retry client errors", () => {
    expect(shouldRetryQuery(0, { data: { httpStatus: 400 } })).toBe(false);
    expect(shouldRetryQuery(0, { data: { httpStatus: 401 } })).toBe(false);
  });

  it("retries server and network errors at most twice", () => {
    expect(shouldRetryQuery(0, { data: { httpStatus: 500 } })).toBe(true);
    expect(shouldRetryQuery(1, new Error("Network error"))).toBe(true);
    expect(shouldRetryQuery(2, new Error("Network error"))).toBe(false);
  });
});
