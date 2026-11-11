import { allLessons } from "content-collections";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { TrustedMdx } from "@/components/content/mdx-components";

describe("trusted content SSR", () => {
  it("renders GFM, math, and deferred visualization fallbacks", () => {
    const lesson = allLessons.find((item) => item.slug === "variables");
    if (!lesson) {
      throw new Error("The sample variables lesson was not generated");
    }

    const html = renderToStaticMarkup(<TrustedMdx code={lesson.mdx} />);

    expect(html).toContain("<table");
    expect(html).toContain("katex");
    expect(html).toContain("Rendering diagram");
    expect(html).toContain("Loading chart");
  });
});
