import { describe, expect, it } from "vite-plus/test";

import { validateMdx } from "./mdx-validation";

describe("curated MDX validation", () => {
  it("accepts allowlisted components with literal properties", () => {
    expect(() =>
      validateMdx()({
        type: "root",
        children: [
          {
            type: "mdxJsxFlowElement",
            name: "Callout",
            attributes: [{ type: "mdxJsxAttribute", name: "title", value: "Remember" }],
            children: [{ type: "paragraph", children: [{ type: "text", value: "Practice." }] }],
          },
        ],
      }),
    ).not.toThrow();
  });

  it("rejects expressions, unknown components, and executable URLs", () => {
    const validate = validateMdx();
    expect(() => validate({ type: "root", children: [{ type: "mdxFlowExpression" }] })).toThrow();
    expect(() =>
      validate({
        type: "root",
        children: [{ type: "mdxJsxFlowElement", name: "Unknown", attributes: [] }],
      }),
    ).toThrow();
    expect(() =>
      validate({
        type: "root",
        children: [{ type: "link", url: "javascript:alert(1)" }],
      }),
    ).toThrow();
  });
});
