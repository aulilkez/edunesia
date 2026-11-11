import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX, type Options as MdxOptions } from "@content-collections/mdx";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { z } from "zod";

import { validateMdx } from "./src/content/mdx-validation";
import { courseSchema, lessonSchema } from "./src/content/schemas";

const mdxOptions: MdxOptions = {
  remarkPlugins: [remarkGfm, remarkMath, validateMdx],
  rehypePlugins: [
    [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" } }] as const,
    [rehypeKatex, { trust: false, strict: "error" }] as const,
    rehypeSlug,
  ],
};

const courses = defineCollection({
  name: "courses",
  directory: "./content/courses",
  include: "*/course.mdx",
  schema: courseSchema.extend({ content: z.string() }),
  transform: async (course, context) => ({
    ...course,
    id: course.slug,
    mdx: await compileMDX(context, course, mdxOptions),
  }),
});

const lessons = defineCollection({
  name: "lessons",
  directory: "./content/courses",
  include: "*/lessons/*.mdx",
  schema: lessonSchema.extend({ content: z.string() }),
  transform: async (lesson, context) => ({
    ...lesson,
    id: `${lesson.course}/${lesson.slug}`,
    mdx: await compileMDX(context, lesson, mdxOptions),
  }),
});

export default defineConfig({ content: [courses, lessons] });
