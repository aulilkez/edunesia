import nodemailer from "nodemailer";

import type { ServerEnv } from "@edunesia/env/server";

import type { EmailMessage, EmailProvider } from "./types";

export type SmtpConfiguration = Pick<
  ServerEnv,
  | "SMTP_HOST"
  | "SMTP_PORT"
  | "SMTP_SECURE"
  | "SMTP_USER"
  | "SMTP_PASS"
  | "SMTP_FROM_EMAIL"
  | "SMTP_FROM_NAME"
>;

export interface SmtpTransport {
  verify(): Promise<unknown>;
  sendMail(message: {
    from: { name: string; address: string };
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<{
    accepted: Array<string | { address: string }>;
    rejected: Array<string | { address: string }>;
  }>;
}

export type SmtpTransportFactory = (configuration: {
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
}) => SmtpTransport;

function createTransport(configuration: Parameters<SmtpTransportFactory>[0]): SmtpTransport {
  return nodemailer.createTransport(configuration);
}

export function createSmtpEmailProvider(
  configuration: SmtpConfiguration,
  transportFactory: SmtpTransportFactory = createTransport,
): EmailProvider {
  if (Boolean(configuration.SMTP_USER) !== Boolean(configuration.SMTP_PASS)) {
    throw new Error("SMTP_USER and SMTP_PASS must either both be set or both be empty.");
  }

  const transport = transportFactory({
    host: configuration.SMTP_HOST,
    port: configuration.SMTP_PORT,
    secure: configuration.SMTP_SECURE,
    ...(configuration.SMTP_USER && configuration.SMTP_PASS
      ? { auth: { user: configuration.SMTP_USER, pass: configuration.SMTP_PASS } }
      : {}),
  });
  const from = { name: configuration.SMTP_FROM_NAME, address: configuration.SMTP_FROM_EMAIL };
  let verification: Promise<void> | undefined;

  async function verifyTransport() {
    verification ??= transport
      .verify()
      .then(() => undefined)
      .catch(() => {
        verification = undefined;
        throw new Error(
          "SMTP server verification failed. Check the host, port, TLS, and credentials.",
        );
      });
    await verification;
  }

  return {
    async send(message: EmailMessage) {
      await verifyTransport();
      let result: Awaited<ReturnType<SmtpTransport["sendMail"]>>;
      try {
        result = await transport.sendMail({ from, ...message });
      } catch {
        throw new Error("SMTP email delivery failed. The message was not confirmed as sent.");
      }
      const accepted = result.accepted.some((address) =>
        typeof address === "string"
          ? address.toLowerCase() === message.to.toLowerCase()
          : address.address.toLowerCase() === message.to.toLowerCase(),
      );
      if (!accepted || result.rejected.length > 0) {
        throw new Error(
          "SMTP server did not accept the recipient. The message was not confirmed as sent.",
        );
      }
    },
  };
}

export function createEmailProvider(env: ServerEnv): EmailProvider {
  switch (env.EMAIL_PROVIDER) {
    case "smtp":
      return createSmtpEmailProvider(env);
  }
}
