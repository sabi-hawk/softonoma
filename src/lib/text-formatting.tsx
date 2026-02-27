import React from "react";

// Safe URL schemes for links (no jsdom/DOMPurify - server-safe on Vercel)
const SAFE_URL_PATTERN = /^(https?:\/\/|mailto:|tel:|#|\/)/i;
const ALLOWED_SPAN_CLASSES = new Set(["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"]);

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Sanitizes formatted text using only string/regex (no jsdom/DOMPurify).
 * Allows: <a> with safe href, <span> with class text-sm|text-base|text-lg.
 * Safe for server (Vercel/Node) and client.
 */
export function sanitizeFormattedText(html: string): string {
  if (!html) return "";

  let out = html;

  // 1. Remove dangerous tags and their content
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "");
  out = out.replace(/<embed\b[^>]*>/gi, "");

  // 2. Sanitize <a> tags: only allow safe href
  out = out.replace(/<a\s+([^>]+)>/gi, (_, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    if (!hrefMatch) return "";
    const href = hrefMatch[1].trim();
    if (!SAFE_URL_PATTERN.test(href)) return "";
    return `<a href="${escapeHtmlAttr(href)}" target="_blank" rel="noopener noreferrer">`;
  });

  // 3. Sanitize <span> tags: only allow class="text-sm|text-base|text-lg"
  // Match <span ...> tags and extract class attribute if present
  out = out.replace(/<span(\s[^>]*)?>/gi, (match, attrs) => {
    if (!attrs) {
      // <span> with no attributes
      if (typeof window !== "undefined") {
        console.log(`[sanitize] span no attrs: "${match}" -> "<span>"`);
      }
      return "<span>";
    }
    
    // Extract class attribute value
    const classMatch = attrs.match(/class\s*=\s*["']([^"']*)["']/i);
    if (!classMatch) {
      // <span> with attributes but no class
      if (typeof window !== "undefined") {
        console.log(`[sanitize] span no class: "${match}" -> "<span>"`);
      }
      return "<span>";
    }
    
    const className = classMatch[1].trim();
    const isAllowed = ALLOWED_SPAN_CLASSES.has(className);
    const result = isAllowed ? `<span class="${className}">` : "<span>";
    
    if (typeof window !== "undefined") {
      console.log(`[sanitize] span with class: "${match}" -> class="${className}" -> keep=${isAllowed} -> "${result}"`);
    }
    
    return result;
  });

  // 4. Strip any other tags (leave only </a>, </span>, </div>, </br>, </strong>, </b> and our sanitized tags)
  // Keep: a, span, div, br, strong, b (strong and b for bold)
  out = out.replace(/<\/(?!a\b|span\b|div\b|strong\b|b\b)[^>]+>/gi, "");
  out = out.replace(/<(?!a\b|span\b|div\b|br\b|strong\b|b\b|\/)[a-zA-Z][^>]*>/gi, "");
  
  // 5. Normalize strong/b tags (strip any attributes)
  out = out.replace(/<(strong|b)\s[^>]*>/gi, "<$1>");

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
  } else if (tag === "bold") {
    const boldHtml = `<strong>${selected || "Text"}</strong>`;
    const newText = before + boldHtml + after;
    return {
      newText,
      newCursorPos: before.length + boldHtml.length,
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
