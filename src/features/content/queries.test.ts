import { describe, expect, it } from "vite-plus/test";

import { getTableOfContents } from "./queries";

describe("lesson table of contents", () => {
  it("uses duplicate-safe heading ids and ignores fenced code", () => {
    const headings = getTableOfContents(
      ["## First section", "```md", "## Not a heading", "```", "## First section"].join("\n"),
    );

    expect(headings).toEqual([
      { depth: 2, id: "first-section", title: "First section" },
      { depth: 2, id: "first-section-1", title: "First section" },
    ]);
  });
});
