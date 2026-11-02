import { useLingui } from "@lingui/react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader } from "@edunesia/ui/components/card";
import { Input } from "@edunesia/ui/components/input";
import { Label } from "@edunesia/ui/components/label";

export type AuthMode = "sign-in" | "sign-up" | "forgot" | "reset" | "verify" | "verified";

const modeCopy: Record<AuthMode, { title: string; description: string }> = {
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

export function AuthFrame({ mode, children }: { mode: AuthMode; children: React.ReactNode }) {
  const { i18n } = useLingui();
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center text-lg font-semibold tracking-tight">
          Edunesia
        </Link>
        <Card className="shadow-sm">
          <CardHeader>
            <h1 className="text-xl font-semibold tracking-tight">{modeCopy[mode].title}</h1>
            <CardDescription>{modeCopy[mode].description}</CardDescription>
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

export function AuthStatus({ value, error = false }: { value: string; error?: boolean }) {
  return value ? (
    <p
      className={`text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
      role={error ? "alert" : "status"}
    >
      {value}
    </p>
  ) : null;
}

export function AuthField({
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
