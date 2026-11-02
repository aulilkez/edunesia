import { emailOtpEmail, passwordResetEmail, verificationEmail } from "./templates";
import type { EmailProvider } from "./types";

export function createAuthEmailCallbacks(emailProvider: EmailProvider) {
  return {
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await emailProvider.send(verificationEmail(user.email, url));
    },
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      await emailProvider.send(passwordResetEmail(user.email, url));
    },
    sendVerificationOTP: async ({
      email,
      otp,
      type,
    }: {
      email: string;
      otp: string;
      type: "sign-in" | "email-verification" | "forget-password" | "change-email";
    }) => {
      await emailProvider.send(emailOtpEmail(email, otp, type));
    },
  };
}
