import type { EmailMessage } from "./types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function actionEmail(input: {
  to: string;
  subject: string;
  preheader: string;
  heading: string;
  description: string;
  actionUrl: string;
  actionLabel: string;
}): EmailMessage {
  const actionUrl = escapeHtml(input.actionUrl);
  const actionLabel = escapeHtml(input.actionLabel);
  const heading = escapeHtml(input.heading);
  const description = escapeHtml(input.description);
  const preheader = escapeHtml(input.preheader);

  return {
    to: input.to,
    subject: input.subject,
    text: `${input.heading}\n\n${input.description}\n\n${input.actionLabel}: ${input.actionUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${heading}</title>
  </head>
  <body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;">
          <tr><td style="padding:28px 32px 18px;border-bottom:1px solid #e4e4e7;">
            <div style="font-size:18px;font-weight:700;letter-spacing:-.03em;color:#18181b;">Edunesia</div>
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;letter-spacing:-.03em;color:#18181b;">${heading}</h1>
            <p style="margin:0 0 26px;font-size:15px;line-height:1.65;color:#52525b;">${description}</p>
            <a href="${actionUrl}" style="display:inline-block;border-radius:6px;background:#2563eb;padding:12px 18px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">${actionLabel}</a>
            <p style="margin:26px 0 0;font-size:12px;line-height:1.6;color:#71717a;">If the button does not work, copy this link into your browser:<br><a href="${actionUrl}" style="color:#2563eb;word-break:break-all;">${actionUrl}</a></p>
            <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#71717a;">If you did not request this, you can ignore this email.</p>
          </td></tr>
          <tr><td style="padding:18px 32px;border-top:1px solid #e4e4e7;color:#a1a1aa;font-size:11px;">Edunesia · Open knowledge for everyone</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  };
}

export function verificationEmail(to: string, url: string): EmailMessage {
  return actionEmail({
    to,
    subject: "Verify your Edunesia email",
    preheader: "Confirm your email address to finish setting up Edunesia.",
    heading: "Verify your email",
    description: "Confirm your email address to finish setting up your Edunesia account.",
    actionUrl: url,
    actionLabel: "Verify email address",
  });
}

export function passwordResetEmail(to: string, url: string): EmailMessage {
  return actionEmail({
    to,
    subject: "Reset your Edunesia password",
    preheader: "Use this secure link to choose a new password.",
    heading: "Reset your password",
    description: "We received a request to change the password for your Edunesia account.",
    actionUrl: url,
    actionLabel: "Reset password",
  });
}

export function emailOtpEmail(
  to: string,
  otp: string,
  type: "sign-in" | "email-verification" | "forget-password" | "change-email",
): EmailMessage {
  const purpose =
    type === "sign-in"
      ? "sign in"
      : type === "email-verification"
        ? "verify your email"
        : "continue your account request";
  return {
    to,
    subject: "Your Edunesia verification code",
    text: `Use ${otp} to ${purpose}. This code expires in 5 minutes. If you did not request it, you can ignore this email.`,
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>Your Edunesia verification code</title></head>
  <body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 12px;"><tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #e4e4e7;font-size:18px;font-weight:700;color:#18181b;">Edunesia</td></tr>
        <tr><td style="padding:32px;"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#18181b;">Your verification code</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#52525b;">Use this code to ${escapeHtml(purpose)}.</p>
          <p style="margin:0;padding:16px;border:1px solid #e4e4e7;border-radius:6px;text-align:center;font-size:28px;font-weight:700;letter-spacing:.3em;color:#18181b;">${escapeHtml(otp)}</p>
          <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#71717a;">This code expires in 5 minutes. If you did not request it, you can ignore this email.</p>
        </td></tr>
        <tr><td style="padding:18px 32px;border-top:1px solid #e4e4e7;color:#a1a1aa;font-size:11px;">Edunesia · Open knowledge for everyone</td></tr>
      </table>
    </td></tr></table>
  </body>
</html>`,
  };
}
