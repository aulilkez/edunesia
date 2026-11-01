# @edunesia/env

Validated server configuration and an explicit browser-safe environment allowlist. Import secrets
only through `@edunesia/env/server`; browser code should use `@edunesia/env/client`.

Production requires `DATABASE_URL`, `BETTER_AUTH_SECRET` (at least 32 characters), and
`BETTER_AUTH_URL`. Set `VITE_APP_URL` when the browser auth client is served from a different origin.
