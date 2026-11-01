import { expect, test } from "vite-plus/test";

import { loadHighlighter } from "../src/lib/highlighter.tsx";

test("Shiki loads the languages used by educational code blocks", async () => {
  for (const language of [
    "typescript",
    "javascript",
    "python",
    "c",
    "cpp",
    "rust",
    "java",
    "sql",
    "bash",
    "json",
    "html",
    "css",
  ]) {
    const highlighter = await loadHighlighter(language);
    expect(highlighter).not.toBeNull();
    expect(highlighter?.highlight("const value = 1;").lines[0].length).toBeGreaterThan(0);
  }
});
