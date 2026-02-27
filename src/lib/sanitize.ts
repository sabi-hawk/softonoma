// Server-safe HTML sanitizer (no jsdom/DOMPurify - works on Vercel)
const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "p", "strong", "em", "u", "b", "i",
  "a", "ul", "ol", "li", "pre", "code", "blockquote", "br",
  "span", "div", "hr", "mark",
]);

const SAFE_URL_PATTERN = /^(https?:\/\/|mailto:|tel:|#|\/)/i;

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Sanitize HTML for safe rendering (e.g. blog content).
 * Uses regex/string operations only (server-safe, no jsdom).
 * Allows: common HTML tags for rich content, safe links.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  let out = html;

  // 1. Remove dangerous tags and their content
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "");
  out = out.replace(/<embed\b[^>]*>/gi, "");
  out = out.replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, "");

  // 2. Sanitize <a> tags: only allow safe href
  out = out.replace(/<a\s+([^>]+)>/gi, (_, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    if (!hrefMatch) return "";
    const href = hrefMatch[1].trim();
    if (!SAFE_URL_PATTERN.test(href)) return "";
    return `<a href="${escapeHtmlAttr(href)}" target="_blank" rel="noopener noreferrer">`;
  });

  // 3. Strip any tags not in allowed list
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi;
  out = out.replace(tagPattern, (match, tagName) => {
    const tag = tagName.toLowerCase();
    if (ALLOWED_TAGS.has(tag)) {
      // Keep opening/closing tags for allowed elements, but strip attributes (except for <a>)
      if (tag === "a" && match.includes("href=")) return match; // Already sanitized above
      if (tag === "br") return "<br>";
      return match.startsWith("</") ? `</${tag}>` : `<${tag}>`;
    }
    return ""; // Strip disallowed tags
  });

  return out;
}
