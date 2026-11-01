import { createProcessor } from "@mdx-js/mdx";
import matter from "gray-matter";
import { createElement, type ComponentType, type ReactNode } from "react";
import { z } from "zod";

import { contentComponents, type ContentComponentName } from "../components";
import { validateMermaidChart } from "../components/mermaid-diagram";
import { trustedMdxRemarkPlugins } from "../plugins";
import { renderMathHtml } from "../plugins";
import {
  courseSchema,
  lessonSchema,
  moduleSchema,
  type Course,
  type Lesson,
  type Module,
} from "../schemas";

const processor = createProcessor({
  format: "mdx",
  remarkPlugins: trustedMdxRemarkPlugins,
});
const communityComponents = new Set<ContentComponentName>([
  "Callout",
  "CodeBlock",
  "Image",
  "Video",
  "Quiz",
  "Exercise",
  "Tabs",
  "TabsList",
  "TabsTrigger",
  "TabsContent",
  "Note",
  "Table",
  "MathBlock",
  "MermaidDiagram",
  "Details",
]);
const componentProps: Record<ContentComponentName, Set<string>> = {
  Callout: new Set(["type"]),
  CodeBlock: new Set(["language", "highlightLines"]),
  Image: new Set(["src", "alt", "title"]),
  Video: new Set(["src", "title", "captionsSrc"]),
  Quiz: new Set(["id"]),
  Exercise: new Set(["id"]),
  Tabs: new Set(["defaultValue"]),
  TabsList: new Set(["variant"]),
  TabsTrigger: new Set(["value"]),
  TabsContent: new Set(["value"]),
  Note: new Set(),
  Table: new Set(),
  MathBlock: new Set(["formula", "displayMode"]),
  MermaidDiagram: new Set(["chart", "title"]),
  Details: new Set(["title"]),
};
const markdownNodeTypes = new Set([
  "root",
  "paragraph",
  "heading",
  "text",
  "emphasis",
  "strong",
  "delete",
  "inlineCode",
  "code",
  "math",
  "inlineMath",
  "blockquote",
  "list",
  "listItem",
  "thematicBreak",
  "table",
  "tableHead",
  "tableBody",
  "tableRow",
  "tableCell",
  "tableHeader",
  "link",
  "image",
  "break",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
]);

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

export type TrustedLesson = { metadata: Lesson; body: string };

function parseYamlMetadata<T>(source: string, schema: z.ZodType<T>): T {
  const data = matter(`---\n${source}\n---`).data;
  const result = schema.safeParse(data);
  if (!result.success) throw new ContentValidationError(z.prettifyError(result.error));
  return result.data;
}

export const parseCourseMetadata = (source: string): Course =>
  parseYamlMetadata(source, courseSchema);
export const parseModuleMetadata = (source: string): Module =>
  parseYamlMetadata(source, moduleSchema);

export function parseLessonFrontmatter(source: string): TrustedLesson {
  const parsed = matter(source);
  const result = lessonSchema.safeParse(parsed.data);
  if (!result.success) {
    throw new ContentValidationError(z.prettifyError(result.error));
  }
  return { metadata: result.data, body: parsed.content.trim() };
}

export async function compileTrustedLesson(source: string): Promise<TrustedLesson> {
  const lesson = parseLessonFrontmatter(source);
  try {
    await processor.process(lesson.body);
  } catch (error) {
    throw new ContentValidationError(
      error instanceof Error ? error.message : "Invalid trusted MDX document",
    );
  }
  return lesson;
}

interface MdxNode {
  type: string;
  value?: unknown;
  url?: unknown;
  alt?: unknown;
  checked?: unknown;
  ordered?: unknown;
  depth?: unknown;
  lang?: unknown;
  name?: unknown;
  attributes?: unknown;
  children?: unknown;
}

export type CommunityDocument = MdxNode;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function childrenOf(node: MdxNode): MdxNode[] {
  return Array.isArray(node.children) ? (node.children as MdxNode[]) : [];
}

function componentAttributes(
  node: MdxNode,
  name: ContentComponentName,
): Record<string, string | boolean> {
  if (!Array.isArray(node.attributes)) {
    return {};
  }
  const props: Record<string, string | boolean> = {};
  for (const attribute of node.attributes) {
    if (
      !isRecord(attribute) ||
      attribute.type !== "mdxJsxAttribute" ||
      typeof attribute.name !== "string"
    ) {
      throw new ContentValidationError(
        "Spread and expression component attributes are not allowed",
      );
    }
    if (!componentProps[name].has(attribute.name)) {
      throw new ContentValidationError(`Unsupported ${name} attribute: ${attribute.name}`);
    }
    const value = attribute.value;
    if (value === null) {
      props[attribute.name] = true;
    } else if (typeof value === "string") {
      props[attribute.name] = value;
    } else {
      throw new ContentValidationError(
        "Only literal string or boolean component attributes are allowed",
      );
    }
  }
  if ((name === "Quiz" || name === "Exercise") && typeof props.id !== "string") {
    throw new ContentValidationError(`${name} requires a resource id`);
  }
  if (
    (name === "Image" || name === "Video") &&
    typeof props.src === "string" &&
    !isSafeUrl(props.src)
  ) {
    throw new ContentValidationError(`${name} source URL is not allowed`);
  }
  if (name === "Video" && typeof props.captionsSrc === "string" && !isSafeUrl(props.captionsSrc)) {
    throw new ContentValidationError("Video captions URL is not allowed");
  }
  if (name === "MathBlock") {
    if (typeof props.formula !== "string") {
      throw new ContentValidationError("MathBlock requires a literal formula");
    }
    try {
      renderMathHtml(props.formula, props.displayMode !== false);
    } catch (error) {
      throw new ContentValidationError(
        error instanceof Error ? error.message : "Invalid math formula",
      );
    }
  }
  if (name === "MermaidDiagram") {
    if (typeof props.chart !== "string") {
      throw new ContentValidationError("MermaidDiagram requires literal chart source");
    }
    try {
      validateMermaidChart(props.chart);
    } catch (error) {
      throw new ContentValidationError(error instanceof Error ? error.message : "Invalid diagram");
    }
  }
  if (
    (name === "Tabs" || name === "TabsTrigger" || name === "TabsContent" || name === "Details") &&
    typeof props.defaultValue !== "string" &&
    typeof props.value !== "string" &&
    typeof props.title !== "string"
  ) {
    throw new ContentValidationError(`${name} requires its identifying attribute`);
  }
  return props;
}

function isSafeUrl(url: string): boolean {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    return ["https:", "http:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function validateTree(node: MdxNode): void {
  if (!markdownNodeTypes.has(node.type)) {
    throw new ContentValidationError(`Unsupported content syntax: ${node.type}`);
  }
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    if (
      typeof node.name !== "string" ||
      !communityComponents.has(node.name as ContentComponentName)
    ) {
      throw new ContentValidationError(
        `Unknown content component: ${typeof node.name === "string" ? node.name : "<fragment>"}`,
      );
    }
    componentAttributes(node, node.name as ContentComponentName);
  }
  if (node.type === "math" || node.type === "inlineMath") {
    if (typeof node.value !== "string") {
      throw new ContentValidationError("Math source must be text");
    }
    try {
      renderMathHtml(node.value, node.type === "math");
    } catch (error) {
      throw new ContentValidationError(
        error instanceof Error ? error.message : "Invalid math formula",
      );
    }
  }
  if (node.type === "code" && node.lang === "mermaid" && typeof node.value === "string") {
    try {
      validateMermaidChart(node.value);
    } catch (error) {
      throw new ContentValidationError(error instanceof Error ? error.message : "Invalid diagram");
    }
  }
  if (node.type === "image" && (typeof node.url !== "string" || !isSafeUrl(node.url))) {
    throw new ContentValidationError("Image URL is not allowed");
  }
  for (const child of childrenOf(node)) validateTree(child);
}

const markdownElements: Record<string, string> = {
  root: "div",
  paragraph: "p",
  heading: "h2",
  emphasis: "em",
  strong: "strong",
  delete: "del",
  inlineCode: "code",
  code: "pre",
  blockquote: "blockquote",
  listItem: "li",
  thematicBreak: "hr",
  table: "table",
  tableHead: "thead",
  tableBody: "tbody",
  tableRow: "tr",
  tableCell: "td",
  tableHeader: "th",
};

function renderNode(node: MdxNode, key: number): ReactNode {
  const children = childrenOf(node).map((child, index) => renderNode(child, index));
  if (node.type === "text") return typeof node.value === "string" ? node.value : null;
  if (node.type === "break") return createElement("br", { key });
  if (node.type === "inlineMath" || node.type === "math") {
    return createElement(contentComponents.MathBlock, {
      key,
      formula: typeof node.value === "string" ? node.value : "",
      displayMode: node.type === "math",
    });
  }
  if (node.type === "link") {
    const href = typeof node.url === "string" && isSafeUrl(node.url) ? node.url : "#";
    return createElement("a", { key, href, rel: "nofollow noopener noreferrer" }, ...children);
  }
  if (node.type === "image") {
    const src = typeof node.url === "string" && isSafeUrl(node.url) ? node.url : "";
    return createElement("img", {
      key,
      src,
      alt: typeof node.alt === "string" ? node.alt : "",
    });
  }
  if (node.type === "list") {
    return createElement(
      node.ordered === true ? "ol" : "ul",
      { key, className: "my-4 list-inside list-disc" },
      ...children,
    );
  }
  if (node.type === "listItem") {
    const taskMarker =
      typeof node.checked === "boolean"
        ? createElement("input", {
            type: "checkbox",
            checked: node.checked,
            disabled: true,
            "aria-label": node.checked ? "Completed task" : "Incomplete task",
            className: "me-2 align-middle",
          })
        : null;
    return createElement("li", { key, className: "my-1" }, taskMarker, ...children);
  }
  if (node.type === "table") {
    const [header, ...body] = childrenOf(node);
    const headerRow = header
      ? createElement(
          "thead",
          { key: "head" },
          createElement(
            "tr",
            { key: 0 },
            ...childrenOf(header).map((cell, index) =>
              createElement(
                "th",
                { key: index, scope: "col", className: "border-b px-3 py-2 text-left font-medium" },
                ...childrenOf(cell).map((child, childIndex) => renderNode(child, childIndex)),
              ),
            ),
          ),
        )
      : null;
    const bodyRows = createElement(
      "tbody",
      { key: "body" },
      ...body.map((row, rowIndex) =>
        createElement(
          "tr",
          { key: rowIndex, className: "border-b last:border-0" },
          ...childrenOf(row).map((cell, cellIndex) =>
            createElement(
              "td",
              { key: cellIndex, className: "px-3 py-2 align-top" },
              ...childrenOf(cell).map((child, childIndex) => renderNode(child, childIndex)),
            ),
          ),
        ),
      ),
    );
    return createElement(contentComponents.Table, { key }, headerRow, bodyRows);
  }
  if (node.type === "heading") {
    const depth =
      typeof node.depth === "number" && node.depth >= 1 && node.depth <= 6 ? node.depth : 2;
    return createElement(
      `h${depth}`,
      { key, className: "my-6 scroll-m-20 text-2xl font-semibold" },
      ...children,
    );
  }
  if (node.type === "code") {
    if (node.lang === "mermaid" && typeof node.value === "string") {
      return createElement(contentComponents.MermaidDiagram, { key, chart: node.value });
    }
    return createElement(contentComponents.CodeBlock, {
      key,
      language: typeof node.lang === "string" ? node.lang : undefined,
      children: typeof node.value === "string" ? node.value : "",
    });
  }
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    const name = node.name as ContentComponentName;
    const Component = contentComponents[name] as unknown as ComponentType<Record<string, unknown>>;
    return createElement(Component, { key, ...componentAttributes(node, name) }, ...children);
  }
  const element = markdownElements[node.type];
  if (element && node.type !== "table") {
    return createElement(
      element,
      { key, className: node.type === "blockquote" ? "border-s-2 border-border ps-4" : undefined },
      ...children,
    );
  }
  if (node.type === "mdxJsxAttribute" || node.type === "mdxJsxExpressionAttribute") return null;
  throw new ContentValidationError(`Unsupported Markdown node: ${node.type}`);
}

export function parseCommunityContent(source: string): CommunityDocument {
  let tree: unknown;
  try {
    tree = processor.parse(source);
  } catch (error) {
    throw new ContentValidationError(error instanceof Error ? error.message : "Invalid Markdown");
  }
  if (!isRecord(tree) || typeof tree.type !== "string") {
    throw new ContentValidationError("Could not parse community content");
  }
  return tree as unknown as CommunityDocument;
}

export function validateCommunityContent(document: CommunityDocument): void {
  validateTree(document);
}

export function renderCommunityTree(document: CommunityDocument): ReactNode {
  validateCommunityContent(document);
  return renderNode(document, 0);
}

export function renderCommunityContent(source: string): ReactNode {
  return renderCommunityTree(parseCommunityContent(source));
}
