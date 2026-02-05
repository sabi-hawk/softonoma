import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "p", "strong", "em", "u", "b", "i",
  "a", "ul", "ol", "li", "pre", "code", "blockquote", "br",
  "span", "div", "hr", "mark",
];
const ALLOWED_ATTR = ["href", "target", "rel", "class", "style"];

/**
 * Sanitize HTML for safe rendering (e.g. blog content).
 * Only allows a strict set of tags and attributes.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target", "rel"],
  });
}
