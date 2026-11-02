import { useLingui } from "@lingui/react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "@edunesia/auth/client";
import {
  LEGAL_DOCUMENTS_AVAILABLE,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpFormSchema,
} from "@edunesia/auth/schemas";
import { Button } from "@edunesia/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader } from "@edunesia/ui/components/card";
import { Input } from "@edunesia/ui/components/input";
import { Label } from "@edunesia/ui/components/label";

type AuthMode = "sign-in" | "sign-up" | "forgot" | "reset" | "verify" | "verified";

const copy: Record<AuthMode, { title: string; description: string }> = {
  "sign-in": { title: "Welcome back", description: "Sign in to continue learning." },
  "sign-up": { title: "Create your account", description: "Join a global community of learners." },
  forgot: {
    title: "Reset your password",
    description: "We’ll send a reset link if an account matches.",
  },
  reset: { title: "Choose a new password", description: "Use at least 12 characters." },
  verify: {
    title: "Check your email",
    description: "We’ll send a fresh verification link if your account needs one.",
  },
  verified: { title: "Email verified", description: "Your account is ready for learning." },
};

function AuthFrame({ mode, children }: { mode: AuthMode; children: React.ReactNode }) {
  const { i18n } = useLingui();
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center text-lg font-semibold tracking-tight">
          Edunesia
        </Link>
        <Card className="shadow-sm">
          <CardHeader>
            <h1 className="text-xl font-semibold tracking-tight">{copy[mode].title}</h1>
            <CardDescription>{copy[mode].description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          {i18n._({
            id: "auth.securityNote",
            message: "Your account is protected with secure, encrypted sessions.",
          })}
        </p>
      </div>
    </main>
  );
}

function Status({ value, error = false }: { value: string; error?: boolean }) {
  return value ? (
    <p
      className={`text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
      role={error ? "alert" : "status"}
    >
      {value}
    </p>
  ) : null;
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={password && visible ? "text" : type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          required
          className={password ? "pr-10" : undefined}
        />
        {password ? (
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
          >
            <Eye className={visible ? "hidden" : "size-4"} />
            <EyeOff className={visible ? "size-4" : "hidden"} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function useInternalCallback() {
  const search = useSearch({ strict: false }) as { redirect?: string };
  const candidate = search.redirect ?? "/learn/my-learning";
  return candidate.startsWith("/") && !candidate.startsWith("//")
    ? candidate
    : "/learn/my-learning";
}

export function SignInPage() {
  const navigate = useNavigate();
  const callbackURL = useInternalCallback();
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const form = useForm({
    defaultValues: { email: "", password: "", rememberMe: true },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      setError("");
      const result = await authClient.signIn.email({ ...value, callbackURL });
      if (result.error) {
        const unverified = result.error.code === "EMAIL_NOT_VERIFIED";
        setNeedsVerification(unverified);
        setError(
          unverified ? "Verify your email before signing in." : "Email or password is incorrect.",
        );
        return;
      }
      await navigate({ to: callbackURL });
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
        <form.Field name="email">
          {(field) => (
            <Field
              id="sign-in-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <Field
              id="sign-in-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={field.state.value}
              onChange={field.handleChange}
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
        <Status value={error} error />
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
          to="/reset-password"
          className="text-center text-sm text-primary underline-offset-4 hover:underline"
        >
          Forgot password?
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

export function SignUpPage() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      workspaceName: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validators: { onSubmit: signUpFormSchema },
    onSubmit: async ({ value }) => {
      setError("");
      const result = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        callbackURL: "/email-verified",
        acceptTerms: value.acceptTerms,
      });
      if (result.error) {
        setError("We couldn’t create your account. Check your details and try again.");
        return;
      }
      setNotice("Account created. Follow the verification link sent to your email.");
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
        {!LEGAL_DOCUMENTS_AVAILABLE ? (
          <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
            Registration is paused until the Terms of Service and Privacy Policy are published.
          </div>
        ) : null}
        <form.Field name="name">
          {(field) => (
            <Field
              id="signup-name"
              label="Full name"
              autoComplete="name"
              value={field.state.value}
              onChange={(value) => {
                field.handleChange(value);
                form.setFieldValue("workspaceName", value);
              }}
            />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <Field
              id="signup-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <>
              <Field
                id="signup-password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onChange={field.handleChange}
              />
              <PasswordStrength value={field.state.value} />
            </>
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <Field
              id="signup-confirm-password"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={field.handleChange}
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
        <Status value={error} error />
        <Status value={notice} />
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

function PasswordStrength({ value }: { value: string }) {
  const checks = [
    value.length >= 12,
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];
  const strength = checks.filter(Boolean).length;
  return (
    <div
      aria-label={`Password strength: ${strength} of 4`}
      className="grid grid-cols-4 gap-1"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={4}
      aria-valuenow={strength}
    >
      {checks.map((_, index) => (
        <span
          key={index}
          className={`h-1 rounded-full ${index < strength ? "bg-primary" : "bg-muted"}`}
        />
      ))}
      <span className="sr-only">{strength < 2 ? "Weak" : strength < 4 ? "Good" : "Strong"}</span>
    </div>
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
      const result = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/reset-password",
      });
      if (result.error) {
        setError("We couldn’t process that request right now. Please try again shortly.");
        return;
      }
      setNotice("If an account matches that email, a password reset link is on its way.");
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
        <form.Field name="email">
          {(field) => (
            <Field
              id="forgot-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <Status value={error} error />
        <Status value={notice} />
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

export function ResetPasswordPage() {
  const search = useSearch({ strict: false }) as { token?: string; error?: string };
  const params = useParams({ strict: false }) as { token?: string };
  const token = search.token ?? params.token;
  const [notice, setNotice] = useState("");
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
      const result = await authClient.resetPassword({ newPassword: value.password, token });
      if (result.error) {
        setError("This reset link is invalid or expired. Request a new one.");
        return;
      }
      setNotice("Your password has been updated. You can now sign in.");
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
        <form.Field name="password">
          {(field) => (
            <Field
              id="reset-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <Field
              id="reset-confirm"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <Status
          value={
            search.error === "INVALID_TOKEN"
              ? "This reset link is invalid or expired. Request a new one."
              : error
          }
          error
        />
        {search.error === "INVALID_TOKEN" ? (
          <Link to="/reset-password" search={{}} className="text-center text-sm text-primary">
            Request a new reset link
          </Link>
        ) : null}
        <Status value={notice} />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(busy) => (
            <Button type="submit" disabled={busy || !token || !!notice}>
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

export function PasswordRecoveryPage() {
  const search = useSearch({ strict: false }) as { token?: string; error?: string };
  return search.token || search.error ? <ResetPasswordPage /> : <ForgotPasswordPage />;
}

export function VerifyEmailPage() {
  const search = useSearch({ strict: false }) as { email?: string };
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  async function resend() {
    if (!search.email || busy || cooldown > 0) return;
    setBusy(true);
    setError("");
    const result = await authClient.sendVerificationEmail({
      email: search.email,
      callbackURL: "/email-verified",
    });
    setBusy(false);
    setCooldown(60);
    if (result.error) setError("Please wait before requesting another verification email.");
    else setNotice("If verification is still needed, a new link has been sent.");
  }
  return (
    <AuthFrame mode="verify">
      <div className="grid gap-4">
        <Status value={notice} />
        <Status value={error} error />
        <Button onClick={() => void resend()} disabled={!search.email || busy || cooldown > 0}>
          {busy
            ? "Sending…"
            : cooldown > 0
              ? `Resend available in ${cooldown}s`
              : "Resend verification email"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Use the email address you registered with. Links expire after one hour.
        </p>
        <Link to="/sign-in" className="text-center text-sm text-primary">
          Back to sign in
        </Link>
      </div>
    </AuthFrame>
  );
}

export function EmailVerifiedPage() {
  const { i18n } = useLingui();
  return (
    <AuthFrame mode="verified">
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          {i18n._({ id: "auth.verified.body", message: "Your email address has been verified." })}
        </p>
        <Button asChild>
          <Link to="/learn/my-learning">Continue to learning</Link>
        </Button>
      </div>
    </AuthFrame>
  );
}
