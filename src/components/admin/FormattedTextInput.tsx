"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { sanitizeFormattedText } from "@/lib/text-formatting";

interface FormattedTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  className?: string;
}

const ROW_HEIGHT_PX = 24;
const SYNC_DEBOUNCE_MS = 400;

export default function FormattedTextInput({
  value,
  onChange,
  placeholder = "Enter text...",
  rows = 4,
  label,
  className = "",
}: FormattedTextInputProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isEmpty, setIsEmpty] = useState(!value || value.trim() === "");
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(value);
  const isInternalChangeRef = useRef(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Saved selection so it survives when toolbar/modal takes focus (Word-style) */
  const savedRangeRef = useRef<Range | null>(null);

  // Initial content and sync when value prop changes from parent
  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    if (value !== lastValueRef.current && editorRef.current) {
      const sanitized = sanitizeFormattedText(value || "");
      lastValueRef.current = sanitized;
      editorRef.current.innerHTML = sanitized || "";
      setIsEmpty(!sanitized || sanitized.replace(/<[^>]+>/g, "").trim() === "");
    }
  }, [value]);

  // Set initial content on mount
  useEffect(() => {
    if (!editorRef.current) return;
    const sanitized = sanitizeFormattedText(value || "");
    lastValueRef.current = sanitized;
    editorRef.current.innerHTML = sanitized || "";
    setIsEmpty(!sanitized || sanitized.replace(/<[^>]+>/g, "").trim() === "");
  }, []);

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  const syncContentToParent = useCallback(() => {
    if (!editorRef.current) return;
    const raw = editorRef.current.innerHTML;
    const sanitized = sanitizeFormattedText(raw);
    lastValueRef.current = sanitized;
    isInternalChangeRef.current = true;
    onChange(sanitized);
    setIsEmpty(!sanitized || sanitized.replace(/<[^>]+>/g, "").trim() === "");
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncTimeoutRef.current = null;
      syncContentToParent();
    }, SYNC_DEBOUNCE_MS);
  }, [syncContentToParent]);

  const handleBlur = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
      syncContentToParent();
    }
  }, [syncContentToParent]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      setTimeout(syncContentToParent, 0);
    },
    [syncContentToParent]
  );

  const getSelectionRange = useCallback((): Range | null => {
    const sel = globalThis.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return null;
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return null;
    return range;
  }, []);

  /** Capture selection on mousedown so it’s still there when we apply (Word-style). */
  const captureSelection = useCallback(() => {
    const range = getSelectionRange();
    savedRangeRef.current = range ? range.cloneRange() : null;
  }, [getSelectionRange]);

  const handleAddLinkMouseDown = () => {
    captureSelection();
  };

  const handleAddLink = () => {
    const text = savedRangeRef.current ? savedRangeRef.current.toString() : "";
    setLinkText(text);
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const handleInsertLink = () => {
    if (!editorRef.current || !linkUrl) return;

    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || "Link"}</a>`;
    const range = savedRangeRef.current;

    if (range && editorRef.current.contains(range.commonAncestorContainer)) {
      range.deleteContents();
      const frag = document.createRange().createContextualFragment(linkHtml);
      range.insertNode(frag);
      const sel = globalThis.getSelection();
      if (sel) {
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(editorRef.current.lastChild || editorRef.current);
        newRange.collapse(true);
        sel.addRange(newRange);
      }
    } else {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, linkHtml);
    }

    savedRangeRef.current = null;
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    setTimeout(syncContentToParent, 0);
  };

  const handleRemoveLinkMouseDown = () => {
    captureSelection();
  };

  const handleRemoveLink = () => {
    const range = savedRangeRef.current ?? getSelectionRange();
    savedRangeRef.current = null;
    if (!editorRef.current || !range) return;
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    const node = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : (range.startContainer as Element);
    const anchor = node?.closest?.("a");
    if (!anchor || !editorRef.current.contains(anchor)) {
      return;
    }

    const parent = anchor.parentNode;
    if (!parent) return;
    while (anchor.firstChild) {
      parent.insertBefore(anchor.firstChild, anchor);
    }
    anchor.remove();
    editorRef.current.focus();
    setTimeout(syncContentToParent, 0);
  };

  const handleFontSizeMouseDown = () => {
    captureSelection();
  };

  const handleApplySize = (size: "sm" | "base" | "lg") => {
    const range = savedRangeRef.current ?? getSelectionRange();
    savedRangeRef.current = null;

    if (!range || range.collapsed) {
      alert("Please select some text first, then choose a font size.");
      return;
    }

    try {
      if (size === "base") {
        const node = range.commonAncestorContainer;
        const startEl = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
        const span = startEl?.closest?.("span.text-sm, span.text-base, span.text-lg");
        if (span && editorRef.current?.contains(span)) {
          const parent = span.parentNode;
          if (parent) {
            while (span.firstChild) parent.insertBefore(span.firstChild, span);
            span.remove();
          }
        }
      } else {
        const span = document.createElement("span");
        span.className = `text-${size}`;
        range.surroundContents(span);
      }
    } catch {
      const content = range.toString();
      if (!content) return;
      const wrapper = size === "base" ? content : `<span class="text-${size}">${content}</span>`;
      range.deleteContents();
      range.insertNode(document.createRange().createContextualFragment(wrapper));
    }

    setTimeout(syncContentToParent, 0);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith("/") || url.startsWith("#");
    }
  };

  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Editor block: card + toolbar + document area */}
      <div className="rounded-xl border border-gray-600 bg-gray-800 shadow-lg overflow-hidden">
        {/* Toolbar strip */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/80 border-b border-gray-600">
          <button
            type="button"
            onMouseDown={handleAddLinkMouseDown}
            onClick={handleAddLink}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors border border-gray-500"
            title="Select text, then click to add a link"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Add Link</span>
          </button>
          <button
            type="button"
            onMouseDown={handleRemoveLinkMouseDown}
            onClick={handleRemoveLink}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors border border-gray-500"
            title="Place cursor in a link or select it, then click to remove the link"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l2-2m2-2l2 2M9 9l2 2m0 0l2 2" />
            </svg>
            <span>Remove Link</span>
          </button>
          <div className="h-6 w-px bg-gray-500" aria-hidden />
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">Font size</span>
            <div className="flex items-center gap-1 rounded-lg border border-gray-500 p-0.5 bg-gray-600/50">
              <button
                type="button"
                onMouseDown={handleFontSizeMouseDown}
                onClick={() => handleApplySize("sm")}
                className="px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-500 hover:text-white rounded-md transition-colors"
                title="Select text, then click for Small"
              >
                Small
              </button>
              <button
                type="button"
                onMouseDown={handleFontSizeMouseDown}
                onClick={() => handleApplySize("base")}
                className="px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-500 hover:text-white rounded-md transition-colors"
                title="Select text, then click for Normal"
              >
                Normal
              </button>
              <button
                type="button"
                onMouseDown={handleFontSizeMouseDown}
                onClick={() => handleApplySize("lg")}
                className="px-3 py-1.5 text-base text-gray-200 hover:bg-gray-500 hover:text-white rounded-md transition-colors leading-tight"
                title="Select text, then click for Large"
              >
                Large
              </button>
            </div>
          </div>
        </div>

        {/* Document area - height follows content, no focus ring */}
        <div className="relative bg-gray-700/50">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onPaste={handlePaste}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (document.activeElement !== editorRef.current) return;
              const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
              const mod = isMac ? e.metaKey : e.ctrlKey;
              if (e.key === "z" && mod && !e.shiftKey) {
                e.preventDefault();
                document.execCommand("undo");
                setTimeout(syncContentToParent, 0);
              } else if ((e.key === "y" && mod) || (e.key === "z" && mod && e.shiftKey)) {
                e.preventDefault();
                document.execCommand("redo");
                setTimeout(syncContentToParent, 0);
              }
            }}
            data-placeholder={placeholder}
            className="formatted-text-editor formatted-text w-full box-border text-gray-100 leading-relaxed outline-none overflow-visible min-h-20 pt-5 pr-6 pb-5 pl-6 [&_a]:text-blue-400 [&_a]:underline [&_a]:cursor-pointer [&_a]:hover:text-blue-300 [&_div]:border-0 [&_div]:outline-none [&_div]:box-border [&_p]:border-0 [&_p]:outline-none [&_p]:my-0 [&_br]:border-0"
          />
          {isEmpty && (
            <div
              className="pointer-events-none absolute inset-0 flex items-start text-gray-500 italic pt-5 pr-6 pb-5 pl-6 min-h-20"
              aria-hidden
            >
              {placeholder}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-gray-700/50 border-t border-gray-600 text-xs text-gray-400 text-right">
          {charCount} characters
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Insert Link</h3>
            <p className="text-sm text-gray-400 mb-4">The selected text will become the link. Enter the URL below.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL *</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /page"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                {linkUrl && !isValidUrl(linkUrl) && <p className="text-xs text-red-400 mt-1">Please enter a valid URL</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Link text (optional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Uses selected text if empty"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl || !isValidUrl(linkUrl)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Insert Link
              </button>
              <button
                type="button"
                onClick={() => { setShowLinkModal(false); setLinkUrl(""); setLinkText(""); }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
