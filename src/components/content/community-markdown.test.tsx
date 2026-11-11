// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { CommunityMarkdown } from "./community-markdown";

describe("community Markdown", () => {
  it("renders raw HTML as text and removes executable link protocols", () => {
    const { container } = render(
      <CommunityMarkdown source={'<script>alert("x")</script>\n\n[unsafe](javascript:alert(1))'} />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>");
    const href = container.querySelector("a")?.getAttribute("href");
    expect(href === null || href === undefined || !/^javascript:/i.test(href)).toBe(true);
  });

  it("rejects oversized community content", () => {
    expect(() => render(<CommunityMarkdown source={"x".repeat(50_001)} />)).toThrow(
      "Community Markdown is limited",
    );
  });
});
