"use client";

import { useEffect, useId, useState } from "react";

const supportedDiagram =
  /^(flowchart|graph|sequenceDiagram|classDiagram|erDiagram|stateDiagram(?:-v2)?|gantt)\b/;
let mermaidInitialized = false;

export function validateMermaidChart(chart: string): void {
  const source = chart.trim();
  if (source.length === 0 || source.length > 20_000) {
    throw new Error("Diagram source must contain 1 to 20,000 characters");
  }
  if (!supportedDiagram.test(source) || /%%\s*\{|\bclick\s+[\w-]+\b/i.test(source)) {
    throw new Error("This Mermaid diagram syntax is not allowed");
  }
}

export function MermaidDiagram({
  chart,
  title = "Educational diagram",
}: {
  chart: string;
  title?: string;
}) {
  const id = `edunesia-diagram-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        validateMermaidChart(chart);
        const { default: mermaid } = await import("mermaid");
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            suppressErrorRendering: true,
            maxTextSize: 20_000,
            maxEdges: 500,
            secure: [
              "secure",
              "securityLevel",
              "startOnLoad",
              "maxTextSize",
              "suppressErrorRendering",
              "maxEdges",
            ],
            htmlLabels: false,
            theme: "neutral",
          });
          mermaidInitialized = true;
        }
        await mermaid.parse(chart);
        const result = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result.svg);
      } catch {
        if (!cancelled) setError("This diagram could not be rendered. Check its source syntax.");
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <figure className="my-6 min-w-0 rounded-lg border border-border bg-card p-4 text-foreground">
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
        <summary className="w-fit cursor-pointer text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">
          View diagram source
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs">
          <code>{chart}</code>
        </pre>
      </details>
    </figure>
  );
}
