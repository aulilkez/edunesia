# TypeScript guidelines

All application and package projects extend `packages/config/tsconfig.base.json`. It enables strict mode, unused local/parameter checks, explicit return paths, and switch fallthrough checks. Each project selects module resolution appropriate to its runtime or bundler.

Give exported package APIs explicit, useful types. Prefer inference for local values, `unknown` at untrusted boundaries, and narrowing over assertions. Avoid `any`; where an upstream boundary makes it unavoidable, isolate and explain it. Do not weaken framework-generated types to silence unrelated application errors.
