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
