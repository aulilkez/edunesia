# Curated learning content

Content Collections is the source of truth for Git-managed courses and lessons.
PostgreSQL remains the source of truth for future community courses, user
submissions, reviews, discussions, and progress; do not mirror the same content
in both stores.

## Structure and metadata

```text
content/
  courses/
    javascript-basics/
      course.mdx
      lessons/
        variables.mdx
```

Course and lesson frontmatter is validated with the shared Zod schemas in
`src/content/schemas.ts`. Slugs are stable route identifiers, course and lesson
folders must match their metadata, published lessons must reference a course,
and related lesson references must resolve within the same course. Draft
content is validated and generated but excluded from public routes.

Run `bun run content:validate` after editing files. The `dev` and `build`
scripts run this validation automatically; the Content Collections Vite plugin
also validates frontmatter and compiles MDX during development and production
builds.

## Markdown and MDX

Curated MDX supports GitHub Flavored Markdown tables, task lists and
strikethrough; fenced code with Shiki highlighting; KaTeX math; and the
allowlisted components below. The route renderer is shared so SSR and client
navigation use the same generated document. Heading IDs are generated during
the build and can be linked from the lesson table of contents.

```mdx
<Callout type="warning" title="Check your work">
  Use the browser console to inspect the result.
</Callout>

| Keyword | Reassignable |
| ------- | ------------ |
| `const` | No           |

<Math formula="\frac{1}{2}" />

<Chart
  type="bar"
  title="Example values"
  data='[{"label":"A","value":12},{"label":"B","value":18}]'
/>
```

Available components are `Callout`, `Info`, `Warning`, `Note`, `Tip`,
`CodeBlock`, `Math`, `Mermaid`, `Chart`, `Image`, `Tabs`, `TabsList`,
`TabsTrigger`, `TabsContent`, and `Table`. Mermaid and chart code are loaded
only when their components are rendered. Tables scroll horizontally on narrow
screens. Images accept only HTTP(S) or root-relative URLs.

The MDX compiler rejects imports, exports, JavaScript expressions, arbitrary
HTML, unregistered components, spread attributes, expression-valued props, and
unsafe links/images. This pipeline is only for reviewed, Git-managed content.

## Community content security

Never pass database/community input to Content Collections or the trusted MDX
compiler. `CommunityMarkdown` uses TanStack Markdown, parses Markdown only,
escapes raw HTML, removes executable URL protocols, and enforces a source-size
limit. Do not add runtime MDX compilation or evaluate user-supplied JSX,
imports, scripts, or grading logic.

## Routes and navigation

`/courses/` lists published courses. Lessons use
`/courses/{courseSlug}/{lessonSlug}` and provide metadata, canonical URLs,
headings, and previous/next/related navigation. Use the typed helpers in
`src/content/queries.ts` rather than reading generated collection arrays in
individual routes.
