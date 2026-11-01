"use client";

import { isValidElement, type ComponentProps, type ReactNode } from "react";

import {
  CodeBlock as UiCodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@edunesia/ui/components/code-block";
import { Table as UiTable } from "@edunesia/ui/components/table";
import { Tabs as UiTabs, TabsContent, TabsList, TabsTrigger } from "@edunesia/ui/components/tabs";
import { useHighlightedCode } from "@edunesia/ui/hooks/use-highlighted-code";

import { renderMathHtml } from "../plugins";
import { MermaidDiagram } from "./mermaid-diagram";

type CalloutProps = { type?: "info" | "warning" | "success"; children?: ReactNode };

export function Callout({ type = "info", children }: CalloutProps) {
  return (
    <aside
      className="my-6 rounded-lg border border-border bg-muted/50 p-4 text-sm text-foreground"
      data-callout={type}
      role={type === "warning" ? "note" : undefined}
    >
      {children}
    </aside>
  );
}

function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return toText(node.props.children);
  return "";
}

function highlightedLines(value = ""): Set<number> {
  const lines = new Set<number>();
  for (const range of value.split(",")) {
    const [startText, endText = startText] = range.trim().split("-");
    const start = Number(startText);
    const end = Number(endText);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) continue;
    for (let line = start; line <= Math.min(end, 500); line += 1) lines.add(line);
  }
  return lines;
}

function HighlightedCode({
  code,
  language,
  highlightLines,
}: {
  code: string;
  language?: string;
  highlightLines?: string;
}) {
  const lines = useHighlightedCode(code, language ?? "text");
  const selectedLines = highlightedLines(highlightLines);

  return (
    <UiCodeBlock className="my-6">
      <CodeBlockHeader>
        <CodeBlockTitle>{language ?? "Code"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={selectedLines.has(index + 1) ? "highlighted" : "default"}
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </UiCodeBlock>
  );
}

export function CodeBlock({
  language,
  highlightLines,
  children,
}: {
  language?: string;
  highlightLines?: string;
  children?: ReactNode;
}) {
  const code = toText(children);
  if (language?.toLowerCase() === "mermaid") {
    return <MermaidDiagram chart={code} />;
  }
  return <HighlightedCode code={code} language={language} highlightLines={highlightLines} />;
}

export function MdxPre({ children }: { children?: ReactNode }) {
  if (!isValidElement<{ children?: ReactNode; className?: string }>(children)) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4">
        {children}
      </pre>
    );
  }
  const codeElement = children;
  const language = codeElement.props.className?.match(/language-([\w+#-]+)/)?.[1];
  return <CodeBlock language={language}>{codeElement.props.children}</CodeBlock>;
}

export function MathBlock({
  formula,
  displayMode = true,
}: {
  formula: string;
  displayMode?: boolean;
}) {
  const markup = renderMathHtml(formula, displayMode);
  const html = { __html: markup };
  return displayMode ? (
    <div
      className="my-6 max-w-full overflow-x-auto py-2 text-foreground"
      dangerouslySetInnerHTML={html}
      role="math"
    />
  ) : (
    <span className="text-foreground" dangerouslySetInnerHTML={html} role="math" />
  );
}

export function Image(props: ComponentProps<"img">) {
  return <img {...props} className="my-6 h-auto max-w-full rounded-lg border border-border" />;
}

export function Video({
  src,
  title,
  captionsSrc,
}: {
  src: string;
  title: string;
  captionsSrc?: string;
}) {
  return (
    <figure className="my-6">
      <video
        aria-label={title}
        className="w-full rounded-lg border border-border"
        controls
        preload="metadata"
        src={src}
      >
        {captionsSrc && (
          <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
        )}
      </video>
      <figcaption className="mt-2 text-sm text-muted-foreground">{title}</figcaption>
    </figure>
  );
}

export function Quiz({ id }: { id: string }) {
  return (
    <div className="my-6 rounded-lg border border-border p-4" data-quiz-id={id}>
      Quiz: {id}
    </div>
  );
}

export function Exercise({ id }: { id: string }) {
  return (
    <div className="my-6 rounded-lg border border-border p-4" data-exercise-id={id}>
      Exercise: {id}
    </div>
  );
}

export function Tabs({ defaultValue, children }: { defaultValue: string; children?: ReactNode }) {
  return <UiTabs defaultValue={defaultValue}>{children}</UiTabs>;
}

export { TabsContent, TabsList, TabsTrigger };

export function Note({ children }: { children?: ReactNode }) {
  return (
    <aside className="my-4 border-s-2 border-primary ps-4 text-muted-foreground">{children}</aside>
  );
}

export function Details({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <details className="my-6 rounded-lg border border-border px-4 py-3 open:pb-4">
      <summary className="cursor-pointer font-medium focus-visible:outline-2 focus-visible:outline-ring">
        {title}
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

export function Table({ children }: { children?: ReactNode }) {
  return <UiTable className="my-6 border-collapse text-sm">{children}</UiTable>;
}

export const contentComponents = {
  Callout,
  CodeBlock,
  Image,
  Video,
  Quiz,
  Exercise,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Note,
  Table,
  MathBlock,
  MermaidDiagram,
  Details,
} as const;

export const mdxComponents = { ...contentComponents, pre: MdxPre };

export type ContentComponentName = keyof typeof contentComponents;
