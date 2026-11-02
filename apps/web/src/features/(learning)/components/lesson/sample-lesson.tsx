import { Link } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";

import { mdxComponents } from "@edunesia/content/components";

import LessonContent from "../../../../../../../content/courses/mathematics-foundations/modules/calculus/lessons/01-mathematical-models.mdx";
import { ThemeSwitch } from "../../../../components/shared/theme-switch";

export function SampleLessonPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <a
        href="#lesson-content"
        className="sr-only rounded-md bg-background px-3 py-2 text-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus-visible:outline-2 focus-visible:outline-ring"
      >
        Skip to lesson content
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Edunesia
                </Link>
              </li>
              <li aria-hidden="true" className="text-muted-foreground">
                /
              </li>
              <li aria-current="page" className="text-muted-foreground">
                Mathematics Foundations
              </li>
            </ol>
          </nav>
          <ThemeSwitch />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <article>
          <header className="mb-10 border-b border-border pb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Mathematics Foundations <span aria-hidden="true">·</span> Calculus and Models
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              Mathematical Models: From Change to Structure
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Read integrals, derivatives, matrices, and aligned equations.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <dt>Level</dt>
                <dd className="font-medium text-foreground">Beginner</dd>
              </div>
              <div className="flex gap-2">
                <dt>Reading time</dt>
                <dd className="font-medium text-foreground">15 minutes</dd>
              </div>
            </dl>
          </header>

          <div
            id="lesson-content"
            className="min-w-0 max-w-3xl text-[1.025rem] leading-8 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_hr]:my-8 [&_hr]:border-border"
          >
            <LessonContent components={mdxComponents as MDXComponents} />
          </div>
        </article>
      </div>
    </main>
  );
}
