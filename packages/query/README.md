# @edunesia/query

Shared TanStack Query defaults and typed tRPC client helpers for Edunesia apps.

Create one `QueryClient` per router instance so SSR state is not shared between requests. Use
`createAPIContext<AppRouter>()` in the app to bind its API type.
