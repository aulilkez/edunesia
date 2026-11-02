# @edunesia/env

Validated server configuration and an explicit browser-safe environment allowlist. Import secrets
only through `@edunesia/env/server`; browser code should use `@edunesia/env/client`.

Production requires `DATABASE_URL`, `BETTER_AUTH_SECRET` (at least 32 characters), and
`BETTER_AUTH_URL`. Set `VITE_APP_URL` when the browser auth client is served from a different origin.
Authentication email delivery uses Nodemailer over SMTP. Configure `SMTP_HOST`, `SMTP_PORT`,
`SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, and `SMTP_FROM_NAME`; credentials are
server-only and `SMTP_USER`/`SMTP_PASS` must be supplied together. Production requires these values.
The development defaults target a local Mailpit SMTP listener on `127.0.0.1:1025`; alternatively,
use Mailtrap or Ethereal by setting their SMTP host and credentials.

Google and GitHub OAuth credentials are optional in development. Enable each provider by setting
both values from `.env.example`: `GOOGLE_CLIENT_ID` with `GOOGLE_CLIENT_SECRET`, or
`GITHUB_CLIENT_ID` with `GITHUB_CLIENT_SECRET`. The environment parser rejects half-configured
pairs. OAuth client secrets are server-only. Register `BETTER_AUTH_URL/api/auth/callback/google`
as Google's authorized redirect URI and `BETTER_AUTH_URL/api/auth/callback/github` as GitHub's
Authorization callback URL. Add `BETTER_AUTH_URL` as the app origin in Google Cloud. Detailed setup
and account-linking behavior is in `packages/auth/README.md`.
