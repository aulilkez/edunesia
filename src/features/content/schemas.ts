import { z } from "zod";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export function isSafeContentUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

const imageUrlSchema = z.string().refine(isSafeContentUrl, "Expected a safe HTTP(S) or local URL");
const languageSchema = z.enum(["en", "id"]);
const statusSchema = z.enum(["draft", "published"]);
const tagSchema = z.string().trim().min(1).max(32);

export const courseSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    slug: slugSchema,
    description: z.string().trim().min(1).max(500),
    subject: z.string().trim().min(1).max(80),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    language: languageSchema,
    author: z.string().trim().min(1).max(120),
    tags: z.array(tagSchema).max(12),
    coverImage: imageUrlSchema.optional(),
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date().optional(),
    status: statusSchema,
    estimatedMinutes: z.number().int().min(1).max(10_000),
  })
  .strict();

export const lessonSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    slug: slugSchema,
    description: z.string().trim().min(1).max(500),
    course: slugSchema,
    order: z.number().int().min(1),
    language: languageSchema,
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    estimatedMinutes: z.number().int().min(1).max(600),
    tags: z.array(tagSchema).max(12),
    status: statusSchema,
    relatedLessons: z.array(slugSchema).max(8).default([]),
  })
  .strict();

export type CourseMetadata = z.infer<typeof courseSchema>;
export type LessonMetadata = z.infer<typeof lessonSchema>;
