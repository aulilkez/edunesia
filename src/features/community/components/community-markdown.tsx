import { parseMarkdown } from "@tanstack/markdown";
import { Markdown } from "@tanstack/markdown/react";

const MAX_COMMUNITY_MARKDOWN_LENGTH = 50_000;

export function CommunityMarkdown({ source }: { source: string }) {
  if (source.length > MAX_COMMUNITY_MARKDOWN_LENGTH) {
    throw new Error(`Community Markdown is limited to ${MAX_COMMUNITY_MARKDOWN_LENGTH} characters`);
  }

  const document = parseMarkdown(source);

  return (
    <article className="min-w-0">
      <Markdown
        components={{
          img: (props) => <img {...props} loading="lazy" referrerPolicy="no-referrer" />,
        }}
      >
        {document}
      </Markdown>
    </article>
  );
}
