import { passwordResetEmail, verificationEmail } from "./templates";
import type { EmailProvider } from "./types";

export function createAuthEmailCallbacks(emailProvider: EmailProvider) {
  return {
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await emailProvider.send(verificationEmail(user.email, url));
    },
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      await emailProvider.send(passwordResetEmail(user.email, url));
    },
  };
}
