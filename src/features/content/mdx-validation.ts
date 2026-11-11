import { z } from "zod";

import { isSafeContentUrl } from "./schemas";

interface MdxNode {
  type: string;
  name?: string;
  lang?: string;
  url?: string;
  value?: string;
  attributes?: unknown[];
  children?: unknown[];
}

const supportedNodes = new Set([
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
  "definition",
  "footnoteDefinition",
  "footnoteReference",
]);

const componentAttributes: Record<string, Set<string>> = {
  Callout: new Set(["type", "title"]),
  Info: new Set(["title"]),
  Warning: new Set(["title"]),
  Note: new Set(["title"]),
  Tip: new Set(["title"]),
  Table: new Set(),
  CodeBlock: new Set(["language", "title"]),
  Math: new Set(["formula", "displayMode"]),
  Mermaid: new Set(["chart", "title"]),
  Chart: new Set(["type", "data", "title"]),
  Image: new Set(["src", "alt", "title"]),
  Tabs: new Set(["defaultValue"]),
  TabsList: new Set(["variant"]),
  TabsTrigger: new Set(["value"]),
  TabsContent: new Set(["value"]),
};

const chartPointSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.number().finite(),
});
const chartDataSchema = z.array(chartPointSchema).min(1).max(100);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMdxNode(value: unknown): value is MdxNode {
  return isRecord(value) && typeof value.type === "string";
}

function checkComponent(node: MdxNode) {
  const { name, attributes = [] } = node;
  const allowedAttributes = name ? componentAttributes[name] : undefined;

  if (!name || !allowedAttributes) {
    throw new Error(`Unsupported MDX component: ${name ?? "<fragment>"}`);
  }

  const props: Record<string, string | boolean> = {};

  for (const attribute of attributes) {
    if (
      !isRecord(attribute) ||
      attribute.type !== "mdxJsxAttribute" ||
      typeof attribute.name !== "string"
    ) {
      throw new Error("MDX component expressions and spread attributes are not allowed");
    }

    if (!allowedAttributes.has(attribute.name)) {
      throw new Error(`Unsupported ${name} attribute: ${attribute.name}`);
    }

    if (attribute.value === null) {
      props[attribute.name] = true;
    } else if (typeof attribute.value === "string") {
      props[attribute.name] = attribute.value;
    } else {
      throw new Error("MDX component attributes must be literal strings or booleans");
    }
  }

  const requiredProps: Record<string, string[]> = {
    CodeBlock: ["language"],
    Math: ["formula"],
    Mermaid: ["chart"],
    Chart: ["type", "data"],
    Image: ["src", "alt"],
    Tabs: ["defaultValue"],
    TabsTrigger: ["value"],
    TabsContent: ["value"],
  };

  for (const prop of requiredProps[name] ?? []) {
    if (typeof props[prop] !== "string") {
      throw new Error(`${name} requires a literal ${prop} attribute`);
    }
  }

  if (name === "Image" && typeof props.src === "string" && !isSafeContentUrl(props.src)) {
    throw new Error("Image source URL is not allowed");
  }

  if (
    name === "Callout" &&
    typeof props.type === "string" &&
    !["info", "warning", "tip"].includes(props.type)
  ) {
    throw new Error("Unsupported Callout type");
  }

  if (
    name === "Chart" &&
    typeof props.type === "string" &&
    !["area", "bar", "line", "pie"].includes(props.type)
  ) {
    throw new Error("Unsupported chart type");
  }

  if (
    name === "Math" &&
    typeof props.displayMode === "string" &&
    !["block", "inline"].includes(props.displayMode)
  ) {
    throw new Error("Math displayMode must be block or inline");
  }

  if (name === "Mermaid" && typeof props.chart === "string") {
    validateMermaidSource(props.chart);
  }

  if (name === "Math" && typeof props.formula === "string" && props.formula.length > 4_000) {
    throw new Error("Math expressions are limited to 4,000 characters");
  }

  if (name === "Chart" && typeof props.data === "string") {
    const data: unknown = JSON.parse(props.data);
    chartDataSchema.parse(data);
  }
}

function validateMermaidSource(source: string) {
  const trimmed = source.trim();
  const validDiagram =
    /^(flowchart|graph|sequenceDiagram|classDiagram|erDiagram|stateDiagram(?:-v2)?|gantt)\b/.test(
      trimmed,
    );

  if (
    !trimmed ||
    trimmed.length > 20_000 ||
    !validDiagram ||
    /%%\s*\{|\bclick\s+[\w-]+\b/i.test(trimmed)
  ) {
    throw new Error("Unsupported or unsafe Mermaid diagram");
  }
}

function validateNode(value: unknown): asserts value is MdxNode {
  if (!isMdxNode(value)) {
    throw new Error("Invalid MDX syntax tree");
  }

  if (!supportedNodes.has(value.type)) {
    if (value.type === "mdxJsxFlowElement" || value.type === "mdxJsxTextElement") {
      checkComponent(value);
    } else {
      throw new Error(`Unsupported content syntax: ${value.type}`);
    }
  }

  if ((value.type === "link" || value.type === "image") && typeof value.url === "string") {
    if (!isSafeContentUrl(value.url)) {
      throw new Error(`Unsafe ${value.type} URL`);
    }
  }

  if (value.type === "code" && value.value && value.lang?.toLowerCase() === "mermaid") {
    validateMermaidSource(value.value);
  }

  for (const child of value.children ?? []) {
    validateNode(child);
  }
}

export function validateMdx() {
  return (tree: unknown) => validateNode(tree);
}
