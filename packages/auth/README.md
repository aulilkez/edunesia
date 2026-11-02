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

Email OTP sign-in uses Better Auth's `emailOTP` plugin with 6-digit codes, 5-minute expiry, hashed
storage, three verification attempts, and plugin rate limits. The same SMTP provider delivers the
codes. Better Auth validates and consumes codes; Edunesia does not store OTPs separately.

Google and GitHub OAuth are enabled when their complete credential pairs are configured. In the
Google Cloud OAuth client, add the app origin (`BETTER_AUTH_URL`) to Authorized JavaScript origins
and `${BETTER_AUTH_URL}/api/auth/callback/google` to Authorized redirect URIs. For a GitHub OAuth
App, use `BETTER_AUTH_URL` as the Homepage URL and
`${BETTER_AUTH_URL}/api/auth/callback/github` as the Authorization callback URL. Keep provider
secrets in server environment variables only. The app does not trust either provider for implicit
account linking; linking requires a verified email on both the provider identity and existing local
account. GitHub identities without an email cannot create a new account; the provider error flow
returns the user to sign-in with a recoverable message.

Registration is intentionally unavailable until the real Terms of Service and Privacy Policy are
published. `LEGAL_DOCUMENTS_AVAILABLE` in `src/schemas.ts` is a deliberate safety gate; do not turn
it on before those public documents exist. Once published, update the registration links and gate
together. The email sign-up submit action and OAuth account creation remain disabled while this gate
is off; existing users can still sign in with configured providers.

The web app exposes Better Auth at `/api/auth/*`. Authenticated learner pages verify the session on
the server, and protected tRPC procedures also require a verified email. Existing Better Auth
tables are reused. The `rate_limits` table backs Better Auth's database rate-limit store; apply the
generated migrations with `vp run @edunesia/database#db:migrate` before deploying.
