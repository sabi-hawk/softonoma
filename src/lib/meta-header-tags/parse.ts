interface ParsedTag {
  type: "script" | "meta" | "link" | "style" | "noscript";
  props: Record<string, string>;
  content?: string;
}

export function parseMetaHeaderTags(html: string): ParsedTag[] {
  if (!html || typeof html !== "string" || !html.trim()) {
    return [];
  }

  const tags: ParsedTag[] = [];
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  const metaRegex = /<meta([^>]*)\/?>/gi;
  const linkRegex = /<link([^>]*)\/?>/gi;
  const styleRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
  const noscriptRegex = /<noscript([^>]*)>([\s\S]*?)<\/noscript>/gi;

  function parseAttributes(attrString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/gi;
    let match;
    while ((match = attrRegex.exec(attrString)) !== null) {
      attrs[match[1]] = match[2];
    }
    return attrs;
  }

  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    tags.push({
      type: "script",
      props: parseAttributes(match[1]),
      content: match[2],
    });
  }

  while ((match = metaRegex.exec(html)) !== null) {
    tags.push({
      type: "meta",
      props: parseAttributes(match[1]),
    });
  }

  while ((match = linkRegex.exec(html)) !== null) {
    tags.push({
      type: "link",
      props: parseAttributes(match[1]),
    });
  }

  while ((match = styleRegex.exec(html)) !== null) {
    tags.push({
      type: "style",
      props: parseAttributes(match[1]),
      content: match[2],
    });
  }

  while ((match = noscriptRegex.exec(html)) !== null) {
    tags.push({
      type: "noscript",
      props: parseAttributes(match[1]),
      content: match[2],
    });
  }

  return tags;
}

