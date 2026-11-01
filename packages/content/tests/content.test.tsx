import { readFile } from "node:fs/promises";

import { isValidElement } from "react";
import { expect, test } from "vite-plus/test";

import { validateMermaidChart } from "../src/components/mermaid-diagram.tsx";
import {
  compileTrustedLesson,
  contentComponents,
  ContentValidationError,
  renderMathHtml,
  parseCommunityContent,
  parseCourseMetadata,
  parseLessonFrontmatter,
  parseModuleMetadata,
  renderCommunityContent,
  renderCommunityTree,
  validateCommunityContent,
} from "../src/index.ts";

const lesson = `---
title: Variables
description: Store values in named bindings.
slug: variables
difficulty: beginner
estimatedTime: 10
order: 1
learningObjectives:
  - Declare a variable.
prerequisites: []
---

# Variables

Use const for a binding that should not be reassigned.
`;

test("parses lesson frontmatter and applies defaults", () => {
  const parsed = parseLessonFrontmatter(lesson);
  expect(parsed.metadata.slug).toBe("variables");
  expect(parsed.metadata.contentSource).toBe("git");
  expect(parsed.metadata.version).toBe(1);
  expect(parsed.body).toContain("# Variables");
});

test("validates course, module, and lesson metadata", () => {
  expect(
    parseCourseMetadata(
      "title: JavaScript\ndescription: Basics\nslug: javascript\ndifficulty: beginner",
    ).slug,
  ).toBe("javascript");
  expect(
    parseModuleMetadata("title: Basics\ndescription: Intro\nslug: basics\norder: 0").order,
  ).toBe(0);
  expect(() =>
    parseLessonFrontmatter(lesson.replace("estimatedTime: 10", "estimatedTime: -1")),
  ).toThrow(ContentValidationError);
});

test("compiles trusted MDX syntax without evaluating it", async () => {
  const compiled = await compileTrustedLesson(
    lesson + '<Callout type="info">Read this.</Callout>\n',
  );
  expect(compiled.metadata.title).toBe("Variables");
  await expect(compileTrustedLesson(lesson + "<Callout>broken\n")).rejects.toThrow(
    ContentValidationError,
  );
});

test("example course lessons have valid metadata and MDX", async () => {
  const lessonPaths = [
    "../../../content/courses/javascript-foundations/modules/getting-started/lessons/01-first-program.mdx",
    "../../../content/courses/javascript-foundations/modules/getting-started/lessons/02-variables.mdx",
    "../../../content/courses/mathematics-foundations/modules/calculus/lessons/01-mathematical-models.mdx",
  ];
  for (const path of lessonPaths) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    await expect(compileTrustedLesson(source)).resolves.toMatchObject({
      metadata: { contentSource: "git", version: 1 },
    });
  }
});

test("renders inline math, integrals, and matrices with KaTeX", () => {
  const inline = renderMathHtml("E = mc^2", false);
  const integral = renderMathHtml("\\int_0^1 x^2\\,dx = \\frac{1}{3}", true);
  const matrix = renderMathHtml("\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}", true);
  expect(isValidElement(renderCommunityContent("Energy is $E = mc^2$."))).toBe(true);
  expect(isValidElement(renderCommunityContent("$$\\int_0^1 x^2\\,dx$$"))).toBe(true);
  expect(inline).toContain("katex-mathml");
  expect(integral).toContain("katex-display");
  expect(integral).toContain("∫");
  expect(matrix).toContain("<mtable");
  expect(() => renderMathHtml("\\notACommand", false)).toThrow("notACommand");
});

test("renders Markdown tables and sanitizes unsafe diagrams", async () => {
  const table = renderCommunityContent("| Variable | Value |\n| --- | --- |\n| x | 2 |");
  expect(isValidElement(table)).toBe(true);
  expect(isValidElement(table.props.children)).toBe(true);
  expect(table.props.children.type).toBe(contentComponents.Table);
  expect(() => validateMermaidChart("flowchart LR\nA --> B")).not.toThrow();
  expect(() =>
    validateMermaidChart("%%{init: {'securityLevel': 'loose'}}%%\nflowchart LR"),
  ).toThrow("syntax is not allowed");
  expect(() =>
    validateMermaidChart("flowchart LR\nA --> B\nclick B 'javascript:alert(1)'"),
  ).toThrow("syntax is not allowed");
});

test("rejects unknown components and executable community syntax", () => {
  expect(() => renderCommunityContent("<Mystery />")).toThrow("Unknown content component");
  expect(() => renderCommunityContent("{globalThis.process.exit()}")).toThrow(
    "Unsupported content syntax",
  );
  expect(() => renderCommunityContent("import X from 'x'\n\n<X />")).toThrow(
    "Unsupported content syntax",
  );
});

test("community renderer only accepts approved components with literal props", () => {
  const document = parseCommunityContent('<Callout type="info">Safe text</Callout>');
  expect(() => validateCommunityContent(document)).not.toThrow();
  const rendered = renderCommunityTree(document);
  expect(isValidElement(rendered)).toBe(true);
  expect(() => renderCommunityContent('<Quiz id={"secret"} />')).toThrow("literal string");
  expect(() => renderCommunityContent('<Callout style="color:red">Text</Callout>')).toThrow(
    "Unsupported Callout attribute",
  );
  expect(() => renderCommunityContent('<Image src="javascript:alert(1)" alt="bad" />')).toThrow(
    "source URL",
  );
});

test("component registry exposes only registered components", () => {
  expect(Object.keys(contentComponents).sort()).toEqual([
    "Callout",
    "CodeBlock",
    "Details",
    "Exercise",
    "Image",
    "MathBlock",
    "MermaidDiagram",
    "Note",
    "Quiz",
    "Table",
    "Tabs",
    "TabsContent",
    "TabsList",
    "TabsTrigger",
    "Video",
  ]);
});
