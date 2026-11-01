import type { MDXContent } from "mdx/types";

type OfficialLessonModule = { default: MDXContent };

const officialLessonLoaders = import.meta.glob<OfficialLessonModule>(
  "../../../../content/courses/**/*.mdx",
);

export type OfficialLessonPath = keyof typeof officialLessonLoaders;

export function loadOfficialLesson(path: OfficialLessonPath) {
  const load = officialLessonLoaders[path];
  if (!load) throw new Error(`Unknown official lesson: ${path}`);
  return load();
}
