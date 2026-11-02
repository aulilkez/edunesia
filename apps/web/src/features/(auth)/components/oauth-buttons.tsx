import { useLingui } from "@lingui/react";
import { useState } from "react";

import { authClient } from "@edunesia/auth/client";
import { Button } from "@edunesia/ui/components/button";
import { Separator } from "@edunesia/ui/components/separator";

import type { OAuthProviderStatus } from "../api/oauth-provider-status";
import { AuthStatus } from "./auth-layout";

export function OAuthButtons({
  providers,
  disabled = false,
}: {
  providers: OAuthProviderStatus;
  disabled?: boolean;
}) {
  const { i18n } = useLingui();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const configuredCount = Number(providers.google) + Number(providers.github);
  if (!configuredCount && !providers.development) return null;

  async function signIn(provider: "google" | "github") {
    if (!providers[provider] || pending || disabled) return;
    setPending(true);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/learn/my-learning",
        errorCallbackURL: "/sign-in?error=oauth",
      });
      if (result.error) {
        setError(
          i18n._({
            id: "auth.oauthError",
            message: "We could not start sign-in with that provider. Please try again.",
          }),
        );
        setPending(false);
      }
    } catch {
      setError(
        i18n._({
          id: "auth.oauthError",
          message: "We could not start sign-in with that provider. Please try again.",
        }),
      );
      setPending(false);
    }
  }

  const googleLabel = i18n._({ id: "auth.continueGoogle", message: "Continue with Google" });
  const githubLabel = i18n._({ id: "auth.continueGitHub", message: "Continue with GitHub" });
  const setupNotice = i18n._({
    id: "auth.oauthSetupNotice",
    message:
      "Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET, to enable local OAuth sign-in.",
  });

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={pending || disabled || !providers.google}
          onClick={() => void signIn("google")}
        >
          <span aria-hidden="true" className="font-semibold">
            G
          </span>
          {pending ? i18n._({ id: "auth.redirecting", message: "Redirecting…" }) : googleLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={pending || disabled || !providers.github}
          onClick={() => void signIn("github")}
        >
          <GitHubMark />
          {pending ? i18n._({ id: "auth.redirecting", message: "Redirecting…" }) : githubLabel}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <Separator className="flex-1" />
      </div>
      {providers.development && configuredCount < 2 ? (
        <p className="text-xs leading-5 text-muted-foreground" role="status">
          {setupNotice}
        </p>
      ) : null}
      {disabled && configuredCount > 0 ? (
        <p className="text-xs leading-5 text-muted-foreground" role="status">
          Account creation through OAuth is paused until the Terms of Service and Privacy Policy are
          published.
        </p>
      ) : null}
      <AuthStatus value={error} error />
    </div>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.3-3.9-1.3-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.2 1.9-.4 2.9-.4s2 .2 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
