# @edunesia/auth

Better Auth server configuration and browser client. The server factory receives the database
instance and validated server environment; OAuth providers are enabled only when both credentials
for a provider are present.

Email/password sign-in requires a verified email. Better Auth owns credentials, verification and
reset tokens, sessions, CSRF/origin checks, and token expiry. Verification links expire after one
hour; reset links expire after 30 minutes and resetting a password revokes the user's other
sessions. Verification and reset callbacks send responsive HTML and plain-text messages through
the reusable Nodemailer SMTP provider. Configure the server-only `SMTP_*` values before enabling
email delivery. SMTP connectivity is verified before the first send; failed verification or delivery
is surfaced as an error and is never reported as sent.

Registration is intentionally unavailable until the real Terms of Service and Privacy Policy are
published. `LEGAL_DOCUMENTS_AVAILABLE` in `src/schemas.ts` is a deliberate safety gate; do not turn
it on before those public documents exist. Once published, update the registration links and gate
together. The sign-up route currently explains this state rather than creating an account.

The web app exposes Better Auth at `/api/auth/*`. Authenticated learner pages verify the session on
the server, and protected tRPC procedures also require a verified email. Existing Better Auth
tables are reused. The `rate_limits` table backs Better Auth's database rate-limit store; apply the
generated migrations with `vp run @edunesia/database#db:migrate` before deploying.
