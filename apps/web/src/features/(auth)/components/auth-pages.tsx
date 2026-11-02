import { useLingui } from "@lingui/react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { authClient } from "@edunesia/auth/client";
import {
  LEGAL_DOCUMENTS_AVAILABLE,
  emailOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpFormSchema,
} from "@edunesia/auth/schemas";
import { Button } from "@edunesia/ui/components/button";
import { Input } from "@edunesia/ui/components/input";
import { Label } from "@edunesia/ui/components/label";

import type { OAuthProviderStatus } from "../api/oauth-provider-status";
import { AuthField, AuthFrame, AuthStatus } from "./auth-layout";
import { OAuthButtons } from "./oauth-buttons";
import { PasswordStrength } from "./password-strength";

function useInternalCallback() {
  const search = useSearch({ strict: false }) as { redirect?: string };
  const candidate = search.redirect ?? "/learn/my-learning";
  return candidate.startsWith("/") && !candidate.startsWith("//") && !candidate.startsWith("/\\")
    ? candidate
    : "/learn/my-learning";
}

export function SignInPage({ providers }: { providers: OAuthProviderStatus }) {
  const navigate = useNavigate();
  const callbackURL = useInternalCallback();
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const search = useSearch({ strict: false }) as { error?: string; reset?: string };
  const oauthError = search.error
    ? "Sign-in was not completed. You can try again or use email and password."
    : "";
  const form = useForm({
    defaultValues: { email: "", password: "", rememberMe: true },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        const parsed = signInSchema.parse(value);
        const result = await authClient.signIn.email({ ...parsed, callbackURL });
        if (result.error) {
          const unverified = result.error.code === "EMAIL_NOT_VERIFIED";
          setNeedsVerification(unverified);
          setError(
            unverified ? "Verify your email before signing in." : "Email or password is incorrect.",
          );
          return;
        }
        await navigate({ to: callbackURL });
      } catch {
        setError("We couldn’t sign you in right now. Check your connection and try again.");
      }
    },
  });
  return (
    <AuthFrame mode="sign-in">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <OAuthButtons providers={providers} />
        {search.reset === "success" ? (
          <AuthStatus value="Your password has been updated. Sign in with your new password." />
        ) : null}
        <form.Field name="email" validators={{ onBlur: signInSchema.shape.email }}>
          {(field) => (
            <AuthField
              id="sign-in-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <form.Field name="password" validators={{ onBlur: signInSchema.shape.password }}>
          {(field) => (
            <AuthField
              id="sign-in-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <form.Field name="rememberMe">
          {(field) => (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              />
              Remember me
            </label>
          )}
        </form.Field>
        <AuthStatus value={oauthError || error} error />
        {needsVerification ? (
          <a
            className="text-sm text-primary underline-offset-4 hover:underline"
            href={`/verify?email=${encodeURIComponent(form.getFieldValue("email"))}`}
          >
            Resend verification email
          </a>
        ) : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(busy) => (
            <Button disabled={busy} type="submit">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          )}
        </form.Subscribe>
        <Link
          to="/forgot-password"
          className="text-center text-sm text-primary underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
        <Link to="/otp" className="text-center text-sm text-muted-foreground hover:text-foreground">
          Sign in with an email code
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          New to Edunesia?{" "}
          <Link to="/sign-up" className="font-medium text-primary">
            Create an account
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function SignUpPage({ providers }: { providers: OAuthProviderStatus }) {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validators: { onSubmit: signUpFormSchema },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        const parsed = signUpFormSchema.parse(value);
        const result = await authClient.signUp.email({
          name: parsed.name,
          email: parsed.email,
          password: parsed.password,
          callbackURL: "/email-verified",
          acceptTerms: parsed.acceptTerms,
        });
        if (result.error) {
          setError("We couldn’t create your account. Check your details and try again.");
          return;
        }
        setNotice("Account created. Follow the verification link sent to your email.");
      } catch {
        setError("We couldn’t create your account. Check your details and try again.");
      }
    },
  });
  return (
    <AuthFrame mode="sign-up">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <OAuthButtons providers={providers} disabled={!LEGAL_DOCUMENTS_AVAILABLE} />
        {!LEGAL_DOCUMENTS_AVAILABLE ? (
          <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
            Registration is paused until the Terms of Service and Privacy Policy are published.
          </div>
        ) : null}
        <form.Field name="name" validators={{ onBlur: signUpFormSchema.shape.name }}>
          {(field) => (
            <AuthField
              id="signup-name"
              label="Full name"
              autoComplete="name"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <form.Field name="email" validators={{ onBlur: signUpFormSchema.shape.email }}>
          {(field) => (
            <AuthField
              id="signup-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <form.Field name="password" validators={{ onBlur: signUpFormSchema.shape.password }}>
          {(field) => (
            <>
              <AuthField
                id="signup-password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={field.state.meta.errors.map(String).join(" ")}
              />
              <PasswordStrength value={field.state.value} />
            </>
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <AuthField
              id="signup-confirm-password"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <form.Field name="acceptTerms">
          {(field) => (
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                className="mt-1"
                type="checkbox"
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              />
              I agree to the Terms of Service and Privacy Policy.
            </label>
          )}
        </form.Field>
        <AuthStatus value={error} error />
        <AuthStatus value={notice} />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(busy) => (
            <Button disabled={busy || !LEGAL_DOCUMENTS_AVAILABLE} type="submit">
              {busy ? "Creating account…" : "Create account"}
            </Button>
          )}
        </form.Subscribe>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/sign-in" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordPage() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        const parsed = forgotPasswordSchema.parse(value);
        const result = await authClient.requestPasswordReset({
          email: parsed.email,
          redirectTo: "/reset-password",
        });
        if (result.error) {
          setError("We couldn’t process that request right now. Please try again shortly.");
          return;
        }
        setNotice("If an account matches that email, a password reset link is on its way.");
      } catch {
        setError("We couldn’t process that request right now. Please try again shortly.");
      }
    },
  });
  return (
    <AuthFrame mode="forgot">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email" validators={{ onBlur: forgotPasswordSchema.shape.email }}>
          {(field) => (
            <AuthField
              id="forgot-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <AuthStatus value={error} error />
        <AuthStatus value={notice} />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(busy) => (
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </Button>
          )}
        </form.Subscribe>
        <Link to="/sign-in" className="text-center text-sm text-primary">
          Back to sign in
        </Link>
      </form>
    </AuthFrame>
  );
}

export function OtpPage() {
  const search = useSearch({ strict: false }) as { email?: string; redirect?: string };
  const callbackURL = useInternalCallback();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: { email: search.email ?? "", otp: "" },
    validators: { onSubmit: emailOtpSchema },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        const parsed = emailOtpSchema.parse(value);
        const result = await authClient.signIn.emailOtp({ ...parsed, callbackURL });
        if (result.error) {
          setError("That code is invalid or expired. Request another code and try again.");
          return;
        }
        await navigate({ to: callbackURL });
      } catch {
        setError("That code is invalid or expired. Request another code and try again.");
      }
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((remaining) => remaining - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    if (sending || cooldown > 0) return;
    const parsed = forgotPasswordSchema.pick({ email: true }).safeParse({
      email: form.getFieldValue("email"),
    });
    if (!parsed.success) {
      setError("Enter a valid email address first.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: parsed.data.email,
        type: "sign-in",
      });
      if (result.error) {
        setError("We could not send a code right now. Wait a moment and try again.");
      } else {
        setSent(true);
        setNotice("If this email can sign in, a one-time code is on its way.");
        setCooldown(30);
      }
    } catch {
      setError("We could not send a code right now. Wait a moment and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthFrame mode="otp">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email" validators={{ onBlur: forgotPasswordSchema.shape.email }}>
          {(field) => (
            <AuthField
              id="otp-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <Button
          type="button"
          variant="outline"
          disabled={sending || cooldown > 0}
          onClick={() => void sendCode()}
        >
          {sending
            ? "Sending code…"
            : cooldown > 0
              ? `Send another code in ${cooldown}s`
              : sent
                ? "Send a new code"
                : "Email me a sign-in code"}
        </Button>
        {sent ? (
          <form.Field name="otp" validators={{ onBlur: emailOtpSchema.shape.otp }}>
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="otp-code">6-digit code</Label>
                <Input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length ? "otp-code-error" : undefined}
                  className="h-12 text-center text-lg tracking-[0.35em]"
                />
                {field.state.meta.errors.length ? (
                  <p id="otp-code-error" className="text-sm text-destructive" role="alert">
                    {field.state.meta.errors.map(String).join(" ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        ) : null}
        <AuthStatus value={notice} />
        <AuthStatus value={error} error />
        {sent ? (
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(busy) => (
              <Button type="submit" disabled={busy}>
                {busy ? "Verifying…" : "Verify and sign in"}
              </Button>
            )}
          </form.Subscribe>
        ) : null}
        <Link to="/sign-in" className="text-center text-sm text-primary">
          Back to sign in
        </Link>
      </form>
    </AuthFrame>
  );
}

export function ResetPasswordPage() {
  const search = useSearch({ strict: false }) as { token?: string; error?: string };
  const params = useParams({ strict: false }) as { token?: string };
  const token = search.token ?? params.token;
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      if (!token) {
        setError("This reset link is missing or invalid. Request a new one.");
        return;
      }
      setError("");
      try {
        const result = await authClient.resetPassword({ newPassword: value.password, token });
        if (result.error) {
          setError("This reset link is invalid or expired. Request a new one.");
          return;
        }
        window.location.assign("/sign-in?reset=success");
      } catch {
        setError("We couldn’t update your password right now. Please try again.");
      }
    },
  });
  return (
    <AuthFrame mode="reset">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="password" validators={{ onBlur: resetPasswordSchema.shape.password }}>
          {(field) => (
            <AuthField
              id="reset-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <form.Field
          name="confirmPassword"
          validators={{ onBlur: resetPasswordSchema.shape.confirmPassword }}
        >
          {(field) => (
            <AuthField
              id="reset-confirm"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <AuthStatus
          value={
            search.error === "INVALID_TOKEN"
              ? "This reset link is invalid or expired. Request a new one."
              : error
          }
          error
        />
        {search.error === "INVALID_TOKEN" ? (
          <Link to="/forgot-password" className="text-center text-sm text-primary">
            Request a new reset link
          </Link>
        ) : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(busy) => (
            <Button type="submit" disabled={busy || !token}>
              {busy ? "Updating…" : "Update password"}
            </Button>
          )}
        </form.Subscribe>
        <Link to="/sign-in" className="text-center text-sm text-primary">
          Back to sign in
        </Link>
      </form>
    </AuthFrame>
  );
}

export function VerifyEmailPage() {
  const search = useSearch({ strict: false }) as { email?: string };
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const form = useForm({
    defaultValues: { email: search.email ?? "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      if (cooldown > 0) return;
      setError("");
      try {
        const parsed = forgotPasswordSchema.parse(value);
        const result = await authClient.sendVerificationEmail({
          email: parsed.email,
          callbackURL: "/email-verified",
        });
        setCooldown(60);
        if (result.error) setError("Please wait before requesting another verification email.");
        else setNotice("If verification is still needed, a new link has been sent.");
      } catch {
        setError("We could not send a verification email right now. Please try again shortly.");
      }
    },
  });
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  return (
    <AuthFrame mode="verify">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email" validators={{ onBlur: forgotPasswordSchema.shape.email }}>
          {(field) => (
            <AuthField
              id="verify-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.map(String).join(" ")}
            />
          )}
        </form.Field>
        <AuthStatus value={notice} />
        <AuthStatus value={error} error />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(busy) => (
            <Button type="submit" disabled={busy || cooldown > 0}>
              {busy
                ? "Sending…"
                : cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : "Resend verification email"}
            </Button>
          )}
        </form.Subscribe>
        <p className="text-xs text-muted-foreground">
          Use the email address you registered with. Links expire after one hour.
        </p>
        <Link to="/sign-in" className="text-center text-sm text-primary">
          Back to sign in
        </Link>
      </form>
    </AuthFrame>
  );
}

export function EmailVerifiedPage({ status }: { status: "anonymous" | "unverified" | "verified" }) {
  const { i18n } = useLingui();
  const verified = status === "verified";
  return (
    <AuthFrame mode={verified ? "verified" : "verify"}>
      <div className="grid gap-4">
        {verified ? (
          <>
            <p className="text-sm text-muted-foreground">
              {i18n._({
                id: "auth.verified.body",
                message: "Your email address has been verified.",
              })}
            </p>
            <Button asChild>
              <Link to="/learn/my-learning">Continue to learning</Link>
            </Button>
          </>
        ) : (
          <>
            <AuthStatus
              value="This link could not verify your email. It may have expired or already been used."
              error
            />
            <Button asChild variant="outline">
              <Link to="/verify">Request another verification email</Link>
            </Button>
            <Link to="/sign-in" className="text-center text-sm text-primary">
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthFrame>
  );
}
