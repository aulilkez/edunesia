import * as React from "react";
import { MDXContent } from "@content-collections/mdx/react";
import katex from "katex";
import { z } from "zod";

import {
  CodeBlock as UiCodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockContent,
} from "@/components/ui/code-block";
import { Table as UiTable } from "@/components/ui/table";
import { Tabs as UiTabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isSafeContentUrl } from "@/features/content/schemas";
import { websiteLogger } from "@/lib/logger";

import type { ChartRendererProps } from "./chart-renderer";

const chartPointSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.number().finite(),
});
const chartDataSchema = z.array(chartPointSchema).min(1).max(100);
const mermaidHeader =
  /^(flowchart|graph|sequenceDiagram|classDiagram|erDiagram|stateDiagram(?:-v2)?|gantt)\b/;

function textContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textContent).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textContent(node.props.children);
  }
  return "";
}

function Callout({
  children,
  title,
  type = "info",
}: {
  children?: React.ReactNode;
  title?: string;
  type?: "info" | "warning" | "tip";
}) {
  return (
    <aside
      className="my-6 rounded-lg border border-border bg-muted/50 p-4 text-foreground"
      data-callout={type}
      role={type === "warning" ? "alert" : "note"}
    >
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      {children}
    </aside>
  );
}

function Info({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Callout title={title} type="info">
      {children}
    </Callout>
  );
}

function Warning({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Callout title={title} type="warning">
      {children}
    </Callout>
  );
}

function Note({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Callout title={title} type="info">
      {children}
    </Callout>
  );
}

function Tip({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Callout title={title} type="tip">
      {children}
    </Callout>
  );
}

function ContentPre({ children }: { children?: React.ReactNode }) {
  if (
    !React.isValidElement<{
      children?: React.ReactNode;
      className?: string;
      title?: string;
      "data-language"?: string;
    }>(children)
  ) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4">
        {children}
      </pre>
    );
  }

  const codeElement = children;
  const language =
    codeElement.props.className?.match(/language-([\w+#-]+)/)?.[1] ??
    codeElement.props["data-language"];
  if (language?.toLowerCase() === "mermaid") {
    return <Mermaid chart={textContent(codeElement.props.children)} />;
  }

  return (
    <CodeBlock language={language} title={codeElement.props.title}>
      {codeElement.props.children}
    </CodeBlock>
  );
}

function CodeBlock({
  children,
  language,
  title,
}: {
  children?: React.ReactNode;
  language?: string;
  title?: string;
}) {
  const code = textContent(children);
  if (language?.toLowerCase() === "mermaid") {
    return <Mermaid chart={code} title={title} />;
  }

  return (
    <UiCodeBlock className="my-6">
      <CodeBlockHeader>
        <CodeBlockTitle>{title ?? language ?? "Code"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent tabIndex={0}>{children}</CodeBlockContent>
    </UiCodeBlock>
  );
}

function ContentImage({ alt, src, title }: { alt: string; src: string; title?: string }) {
  if (!isSafeContentUrl(src)) {
    throw new Error("Content image URL is not allowed");
  }
  return (
    <img
      alt={alt}
      className="my-6 h-auto max-w-full rounded-lg border border-border"
      loading="lazy"
      referrerPolicy="no-referrer"
      src={src}
      title={title}
    />
  );
}

function Math({
  displayMode = "block",
  formula,
}: {
  displayMode?: "block" | "inline";
  formula: string;
}) {
  if (formula.length > 4_000) {
    throw new Error("Math expressions are limited to 4,000 characters");
  }

  const markup = katex.renderToString(formula, {
    displayMode: displayMode === "block",
    output: "htmlAndMathml",
    strict: "error",
    throwOnError: true,
    trust: false,
    maxExpand: 1_000,
    maxSize: 20,
  });
  const renderedMath = { __html: markup };

  return displayMode === "block" ? (
    <div
      className="my-6 max-w-full overflow-x-auto py-2"
      dangerouslySetInnerHTML={renderedMath}
      role="math"
    />
  ) : (
    <span dangerouslySetInnerHTML={renderedMath} role="math" />
  );
}

function Mermaid({ chart, title = "Educational diagram" }: { chart: string; title?: string }) {
  const diagramId = `edunesia-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      const source = chart.trim();
      if (
        source.length === 0 ||
        source.length > 20_000 ||
        !mermaidHeader.test(source) ||
        /%%\s*\{|\bclick\s+[\w-]+\b/i.test(source)
      ) {
        setError("This diagram uses unsupported syntax.");
        return;
      }

      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          maxTextSize: 20_000,
          maxEdges: 500,
          htmlLabels: false,
          theme: "neutral",
        });
        await mermaid.parse(source);
        const rendered = await mermaid.render(diagramId, source);
        if (!cancelled) {
          setSvg(rendered.svg);
        }
      } catch (error) {
        if (!cancelled) {
          websiteLogger.error({
            action: "content.mermaid.render_failure",
            error: error instanceof Error ? error.message : "Unknown Mermaid rendering error",
          });
          setError("This diagram could not be rendered. Check its source syntax.");
        }
      }
    }

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart, diagramId]);

  return (
    <figure className="my-6 min-w-0 rounded-lg border border-border bg-card p-4">
      <div className="min-w-0 overflow-x-auto" aria-label={title} role="img">
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            Rendering diagram…
          </p>
        )}
      </div>
      <details className="mt-3 border-t border-border pt-3 text-sm">
        <summary className="w-fit cursor-pointer text-muted-foreground">{title} source</summary>
        <pre className="mt-3 overflow-x-auto text-xs">
          <code>{chart}</code>
        </pre>
      </details>
    </figure>
  );
}

function Chart({
  data,
  title = "Chart",
  type,
}: {
  data: string;
  title?: string;
  type: ChartRendererProps["type"];
}) {
  const parsedData: unknown = JSON.parse(data);
  const validatedData = chartDataSchema.parse(parsedData);
  const [Renderer, setRenderer] = React.useState<React.ComponentType<ChartRendererProps> | null>(
    null,
  );
  const [loadError, setLoadError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    import("./chart-renderer")
      .then(({ ChartRenderer }) => {
        if (!cancelled) {
          setRenderer(() => ChartRenderer);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          websiteLogger.error({
            action: "content.chart.load_failure",
            error: error instanceof Error ? error.message : "Unknown chart loading error",
          });
          setLoadError("Could not load this chart.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) {
    return <p role="alert">{loadError}</p>;
  }
  if (!Renderer) {
    return <p role="status">Loading chart…</p>;
  }
  return <Renderer data={validatedData} title={title} type={type} />;
}

const contentComponents = {
  Callout,
  Info,
  Warning,
  Note,
  Tip,
  CodeBlock,
  Image: ContentImage,
  Math,
  Mermaid,
  Chart,
  Tabs: UiTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table: UiTable,
  pre: ContentPre,
  table: ({ children, ...props }: React.ComponentProps<"table">) => (
    <UiTable className="my-6" {...props}>
      {children}
    </UiTable>
  ),
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="my-8 scroll-m-20 text-3xl font-bold" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="my-6 scroll-m-20 text-2xl font-semibold" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="my-5 scroll-m-20 text-xl font-semibold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-4 leading-7 text-foreground/90" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-primary underline underline-offset-4" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-4 list-disc space-y-2 ps-6" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-4 list-decimal space-y-2 ps-6" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-s-2 border-border ps-4 text-muted-foreground" {...props} />
  ),
};

export function TrustedMdx({ code }: { code: string }) {
  return (
    <article className="min-w-0">
      <MDXContent code={code} components={contentComponents} />
    </article>
  );
}

export { contentComponents };
