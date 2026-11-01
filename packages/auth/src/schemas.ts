import { z } from "zod";

/** Set to true only after the actual policy documents are published and approved. */
export const LEGAL_DOCUMENTS_AVAILABLE = false;

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email())
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1),
  rememberMe: z.boolean(),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z
    .string()
    .trim()
    .pipe(z.email())
    .transform((email) => email.toLowerCase()),
  workspaceName: z.string().trim().min(2).max(100),
  password: z
    .string()
    .min(12, "Use at least 12 characters.")
    .max(128, "Use no more than 128 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  acceptTerms: z
    .boolean()
    .refine(Boolean, "You must agree to the Terms of Service and Privacy Policy."),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signUpAuthSchema = signUpSchema.pick({
  name: true,
  email: true,
  password: true,
  acceptTerms: true,
});
