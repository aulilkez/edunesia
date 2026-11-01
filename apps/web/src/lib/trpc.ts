import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { AppRouter } from "@edunesia/trpc";
import { createAPIContext } from "@edunesia/query";

export const { TRPCProvider, useTRPC, useTRPCClient } = createAPIContext<AppRouter>();

export const getTRPCUrl = createIsomorphicFn()
  .client(() => new URL("/api/trpc", window.location.origin).href)
  .server(() => new URL("/api/trpc", getRequest().url).href);

export const getTRPCHeaders = createIsomorphicFn()
  .client(() => ({}))
  .server(() => {
    const requestHeaders = getRequest().headers;
    const headers: Record<string, string> = {};
    const cookie = requestHeaders.get("cookie");
    const authorization = requestHeaders.get("authorization");
    if (cookie) headers.cookie = cookie;
    if (authorization) headers.authorization = authorization;
    return headers;
  });
