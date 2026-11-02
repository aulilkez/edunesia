import { expect, test, vi } from "vite-plus/test";

import { createAuthEmailCallbacks } from "../src/email/callbacks";
import {
  createSmtpEmailProvider,
  type SmtpConfiguration,
  type SmtpTransport,
  type SmtpTransportFactory,
} from "../src/email/provider";
import { passwordResetEmail, verificationEmail } from "../src/email/templates";
import type { EmailMessage } from "../src/email/types";

const configuration: SmtpConfiguration = {
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  SMTP_USER: "edunesia",
  SMTP_PASS: "private-password",
  SMTP_FROM_EMAIL: "auth@example.test",
  SMTP_FROM_NAME: "Edunesia Learning",
};

function fakeTransport(overrides: Partial<SmtpTransport> = {}) {
  return {
    verify: vi.fn<SmtpTransport["verify"]>(async () => true),
    sendMail: vi.fn<SmtpTransport["sendMail"]>(async () => ({
      accepted: ["learner@example.test"],
      rejected: [],
    })),
    ...overrides,
  } satisfies SmtpTransport;
}

test("SMTP provider builds authenticated transport and confirms an accepted send", async () => {
  const transport = fakeTransport();
  const factory = vi.fn<SmtpTransportFactory>(() => transport);
  const provider = createSmtpEmailProvider(configuration, factory);

  await provider.send(
    verificationEmail("learner@example.test", "https://learn.example.test/verify?token=abc"),
  );

  expect(factory).toHaveBeenCalledWith({
    host: "smtp.example.test",
    port: 587,
    secure: false,
    auth: { user: "edunesia", pass: "private-password" },
  });
  expect(transport.verify).toHaveBeenCalledOnce();
  expect(transport.sendMail).toHaveBeenCalledWith(
    expect.objectContaining({
      from: { name: "Edunesia Learning", address: "auth@example.test" },
      to: "learner@example.test",
      subject: "Verify your Edunesia email",
      text: expect.stringContaining("https://learn.example.test/verify?token=abc"),
      html: expect.stringContaining("Edunesia"),
    }),
  );
});

test("SMTP configuration rejects half-configured credentials", () => {
  expect(() =>
    createSmtpEmailProvider({ ...configuration, SMTP_PASS: undefined }, () => fakeTransport()),
  ).toThrow("SMTP_USER and SMTP_PASS must either both be set or both be empty");
});

test("SMTP verification and delivery failures reject instead of claiming success", async () => {
  const verificationFailure = fakeTransport({
    verify: vi.fn<SmtpTransport["verify"]>(async () =>
      Promise.reject(new Error("private SMTP detail")),
    ),
  });
  const verifyProvider = createSmtpEmailProvider(configuration, () => verificationFailure);
  await expect(
    verifyProvider.send(passwordResetEmail("learner@example.test", "https://example.test/reset")),
  ).rejects.toThrow("SMTP server verification failed");
  expect(verificationFailure.sendMail).not.toHaveBeenCalled();

  const deliveryFailure = fakeTransport({
    sendMail: vi.fn<SmtpTransport["sendMail"]>(async () =>
      Promise.reject(new Error("private SMTP detail")),
    ),
  });
  const deliveryProvider = createSmtpEmailProvider(configuration, () => deliveryFailure);
  await expect(
    deliveryProvider.send(passwordResetEmail("learner@example.test", "https://example.test/reset")),
  ).rejects.toThrow("SMTP email delivery failed");

  const rejectedRecipient = fakeTransport({
    sendMail: vi.fn<SmtpTransport["sendMail"]>(async () => ({
      accepted: [],
      rejected: ["learner@example.test"],
    })),
  });
  const rejectedProvider = createSmtpEmailProvider(configuration, () => rejectedRecipient);
  await expect(
    rejectedProvider.send(passwordResetEmail("learner@example.test", "https://example.test/reset")),
  ).rejects.toThrow("SMTP server did not accept the recipient");
});

test("Better Auth email callbacks use shared templates and propagate provider failures", async () => {
  const send = vi.fn<(message: EmailMessage) => Promise<void>>(async () => undefined);
  const callbacks = createAuthEmailCallbacks({ send });

  await callbacks.sendVerificationEmail({
    user: { email: "learner@example.test" },
    url: "https://example.test/verify?token=verify-token",
  });
  await callbacks.sendResetPassword({
    user: { email: "learner@example.test" },
    url: "https://example.test/reset?token=reset-token",
  });

  expect(send).toHaveBeenCalledTimes(2);
  expect(send.mock.calls[0]?.[0]).toMatchObject({
    subject: "Verify your Edunesia email",
    text: expect.stringContaining("verify-token"),
    html: expect.stringContaining("Verify email address"),
  });
  expect(send.mock.calls[1]?.[0]).toMatchObject({
    subject: "Reset your Edunesia password",
    text: expect.stringContaining("reset-token"),
    html: expect.stringContaining("Reset password"),
  });

  const failure = createAuthEmailCallbacks({
    send: vi.fn<(message: EmailMessage) => Promise<void>>(async () =>
      Promise.reject(new Error("SMTP unavailable")),
    ),
  });
  await expect(
    failure.sendVerificationEmail({
      user: { email: "learner@example.test" },
      url: "https://example.test/verify",
    }),
  ).rejects.toThrow("SMTP unavailable");
});

test("HTML email templates escape untrusted link values and provide a text fallback", () => {
  const message = verificationEmail("learner@example.test", 'https://example.test/?x="<script>');
  expect(message.html).toContain("&quot;&lt;script&gt;");
  expect(message.text).toContain('x="<script>');
});
