import { Link } from "@tanstack/react-router";

import type { PublishedCourse } from "@/features/content";

export function CoursesPage({ courses }: { courses: PublishedCourse[] }) {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Learning library
        </p>
        <h1 className="text-4xl font-bold">Courses</h1>
        <p className="max-w-2xl text-muted-foreground">
          Curated, version-controlled lessons from the Edunesia team.
        </p>
      </header>
      {courses.length === 0 ? (
        <p role="status">No published courses are available yet.</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <li
              key={course.id}
              lang={course.language}
              className="rounded-xl border border-border p-6"
            >
              <p className="text-sm text-muted-foreground">
                {course.subject} · {course.level}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{course.title}</h2>
              <p className="mt-2 text-muted-foreground">{course.description}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {course.estimatedMinutes} minutes · {course.author}
              </p>
              {course.firstLesson && (
                <Link
                  className="mt-5 inline-flex font-medium text-primary underline underline-offset-4"
                  params={{ courseSlug: course.slug, lessonSlug: course.firstLesson.slug }}
                  to="/courses/$courseSlug/$lessonSlug"
                >
                  Start course
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
