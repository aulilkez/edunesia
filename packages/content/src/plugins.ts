import katex from "katex";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const trustedMdxRemarkPlugins = [remarkFrontmatter, remarkGfm, remarkMath];
export const trustedMdxRehypePlugins: Array<
  [typeof rehypeKatex, { trust: false; strict: "error" }]
> = [[rehypeKatex, { trust: false, strict: "error" }]];

export function renderMathHtml(formula: string, displayMode: boolean): string {
  if (formula.length > 4_000) throw new Error("Math expressions are limited to 4,000 characters");
  return katex.renderToString(formula, {
    displayMode,
    output: "htmlAndMathml",
    strict: "error",
    throwOnError: true,
    trust: false,
    maxExpand: 1_000,
    maxSize: 20,
  });
}
