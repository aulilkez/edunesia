import { z } from "zod";

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export const contentSourceSchema = z.enum(["git", "database"]);

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const courseSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(500),
  slug: slugSchema,
  difficulty: difficultySchema,
  language: z.string().min(2).default("en"),
  metadata: z.record(z.string(), z.unknown()).default({}),
  version: z.number().int().positive().default(1),
});

export const moduleSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(500),
  slug: slugSchema,
  order: z.number().int().nonnegative(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  version: z.number().int().positive().default(1),
});

export const lessonSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(500),
  slug: slugSchema,
  difficulty: difficultySchema,
  estimatedTime: z.number().int().positive().max(600),
  order: z.number().int().nonnegative(),
  learningObjectives: z.array(z.string().trim().min(1).max(240)).default([]),
  prerequisites: z.array(slugSchema).default([]),
  contentSource: contentSourceSchema.default("git"),
  metadata: z.record(z.string(), z.unknown()).default({}),
  version: z.number().int().positive().default(1),
});

export type Course = z.infer<typeof courseSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type ContentSource = z.infer<typeof contentSourceSchema>;
