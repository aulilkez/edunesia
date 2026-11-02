import { Circle, Play } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@edunesia/ui/components/accordion";

import type { Course } from "../../services/course-catalog";
import { lessonHref } from "../../services/course-catalog";

export function CourseCurriculum({ course, current }: { course: Course; current?: string }) {
  return (
    <Accordion
      type="multiple"
      defaultValue={course.modules.map((_, i) => `module-${i}`)}
      className="divide-y"
    >
      {course.modules.map((module, i) => (
        <AccordionItem key={module.name} value={`module-${i}`} className="border-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <span className="text-left">
              <span className="block font-medium">{module.name}</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {module.lessons.length} lessons
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-1">
              {module.lessons.map((lesson) => (
                <a
                  key={lesson.slug}
                  href={lessonHref(course, lesson.slug)}
                  aria-current={lesson.slug === current ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm ${lesson.slug === current ? "bg-blue-50 font-medium text-blue-800 dark:bg-blue-950/50 dark:text-blue-200" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <span className="flex size-5 items-center justify-center">
                    {lesson.slug === current ? (
                      <Play className="size-3.5 fill-current" />
                    ) : (
                      <Circle className="size-3.5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 leading-5">{lesson.title}</span>
                  <span className="shrink-0 text-xs">{lesson.minutes}m</span>
                </a>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
