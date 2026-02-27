import React from "react";
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes formatted text to only allow safe HTML subset:
 * - <a> tags with href, target, rel attributes
 * - <span> tags with class attribute (only text-sm, text-base, text-lg)
 */
export function sanitizeFormattedText(html: string): string {
  if (!html) return "";

  // Configure DOMPurify to only allow specific tags and attributes
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["a", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOW_DATA_ATTR: false,
    // Prevent javascript: and data: URLs
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });

  // Additional validation using string/regex (server-safe, no document)
  const allowedSpanClasses = new Set(["text-sm", "text-base", "text-lg"]);
  let out = clean.replace(/<span\s+class="([^"]*)"\s*>/gi, (_, cls) => {
    const c = cls.trim();
    return allowedSpanClasses.has(c) ? `<span class="${c}">` : "<span>";
  });

  out = out.replace(/<a\s+([^>]+)>/gi, (match, attrs) => {
    const rel = 'rel="noopener noreferrer"';
    const hasRel = /rel\s*=\s*["'][^"']*["']/i.test(attrs);
    let newAttrs = hasRel ? attrs.replace(/rel\s*=\s*["'][^"']*["']/gi, rel) : `${attrs.trim()} ${rel}`;
    const hrefMatch = newAttrs.match(/href\s*=\s*["'](https?:[^"']*)["']/i);
    if (hrefMatch) {
      const hasTarget = /target\s*=\s*["'][^"']*["']/i.test(newAttrs);
      if (!hasTarget) newAttrs = `${newAttrs.trim()} target="_blank"`;
      else newAttrs = newAttrs.replace(/target\s*=\s*["'][^"']*["']/gi, 'target="_blank"');
    }
    return `<a ${newAttrs.trim()}>`;
  });

  return out;
}

/**
 * Renders formatted text safely as JSX
 */
export function renderFormattedText(html: string): React.ReactElement {
  const sanitized = sanitizeFormattedText(html || "");

  return (
    <span
      className="formatted-text"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

/**
 * Wraps selected text with formatting HTML tags
 */
export function wrapTextWithTag(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  tag: "link" | "size",
  options: { url?: string; linkText?: string; size?: "sm" | "base" | "lg" }
): { newText: string; newCursorPos: number } {
  const before = text.substring(0, selectionStart);
  const selected = text.substring(selectionStart, selectionEnd);
  const after = text.substring(selectionEnd);

  if (tag === "link") {
    const url = options.url || "";
    const linkText = options.linkText || selected || "Link";
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    const newText = before + linkHtml + after;
    return {
      newText,
      newCursorPos: before.length + linkHtml.length,
    };
  } else if (tag === "size") {
    const size = options.size || "base";
    if (size === "base") {
      // Remove size formatting (just return the text)
      return {
        newText: before + selected + after,
        newCursorPos: selectionEnd,
      };
    }
    const sizeHtml = `<span class="text-${size}">${selected || "Text"}</span>`;
    const newText = before + sizeHtml + after;
    return {
      newText,
      newCursorPos: before.length + sizeHtml.length,
    };
  }

  return { newText: text, newCursorPos: selectionEnd };
}

/**
 * Strips all HTML tags from formatted text (server-safe, no document).
 */
export function stripFormattedText(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}
