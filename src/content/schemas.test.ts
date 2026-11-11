import { describe, expect, it } from "vite-plus/test";

import { courseSchema, lessonSchema } from "./schemas";

describe("curated content schemas", () => {
  it("accepts valid course and lesson metadata", () => {
    const course = courseSchema.parse({
      title: "JavaScript Basics",
      slug: "javascript-basics",
      description: "Learn the fundamentals of JavaScript.",
      subject: "Programming",
      level: "beginner",
      language: "en",
      author: "Edunesia Team",
      tags: ["JavaScript"],
      publishedAt: "2026-01-15",
      status: "published",
      estimatedMinutes: 45,
    });
    const lesson = lessonSchema.parse({
      title: "Variables",
      slug: "variables",
      description: "Store and reuse values.",
      course: course.slug,
      order: 1,
      language: "en",
      difficulty: "beginner",
      estimatedMinutes: 10,
      tags: ["JavaScript"],
      status: "published",
    });

    expect(lesson.relatedLessons).toEqual([]);
  });

  it("rejects unsafe images and invalid publication dates", () => {
    expect(() =>
      courseSchema.parse({
        title: "Unsafe",
        slug: "unsafe",
        description: "Invalid cover image.",
        subject: "Programming",
        level: "beginner",
        language: "en",
        author: "Edunesia Team",
        tags: [],
        coverImage: "javascript:alert(1)",
        publishedAt: "2026-02-31",
        status: "published",
        estimatedMinutes: 10,
      }),
    ).toThrow();
  });
});
