import { Link } from "@tanstack/react-router";

import { TrustedMdx, type PublishedLesson, type TableOfContentsHeading } from "@/features/content";

export function LessonPage({
  content,
  headings,
}: {
  content: PublishedLesson;
  headings: TableOfContentsHeading[];
}) {
  const { course, lesson, previousLesson, nextLesson, relatedLessons } = content;

  return (
    <main
      lang={lesson.language}
      className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_16rem]"
    >
      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link to="/courses">Courses</Link>
          <span aria-hidden="true"> / </span>
          <span>{course.title}</span>
        </nav>
        <header className="mb-8 space-y-3">
          <p className="text-sm text-muted-foreground">
            Lesson {lesson.order} · {lesson.estimatedMinutes} minutes
          </p>
          <h1 className="text-4xl font-bold">{lesson.title}</h1>
          <p className="text-lg text-muted-foreground">{lesson.description}</p>
        </header>
        <TrustedMdx code={lesson.mdx} />
        <nav
          aria-label="Lesson navigation"
          className="mt-12 flex flex-wrap justify-between gap-4 border-t border-border pt-6"
        >
          {previousLesson ? (
            <Link
              params={{ courseSlug: course.slug, lessonSlug: previousLesson.slug }}
              to="/courses/$courseSlug/$lessonSlug"
            >
              Previous: {previousLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {nextLesson && (
            <Link
              params={{ courseSlug: course.slug, lessonSlug: nextLesson.slug }}
              to="/courses/$courseSlug/$lessonSlug"
            >
              Next: {nextLesson.title}
            </Link>
          )}
        </nav>
        {relatedLessons.length > 0 && (
          <aside className="mt-8 border-t border-border pt-6">
            <h2 className="font-semibold">Related lessons</h2>
            <ul className="mt-3 list-disc space-y-2 ps-5">
              {relatedLessons.map((related) => (
                <li key={related.id}>
                  <Link
                    params={{ courseSlug: course.slug, lessonSlug: related.slug }}
                    to="/courses/$courseSlug/$lessonSlug"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
      {headings.length > 0 && (
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-8">
            <h2 className="font-semibold">On this page</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              {headings.map((heading) => (
                <li key={heading.id} className={heading.depth > 2 ? "ps-3" : undefined}>
                  <a className="hover:text-foreground" href={`#${heading.id}`}>
                    {heading.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      )}
    </main>
  );
}
