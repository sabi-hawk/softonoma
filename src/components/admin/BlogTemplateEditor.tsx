"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaListUl,
  FaListOl,
  FaCode,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaParagraph,
  FaHeading,
  FaQuoteRight,
  FaHighlighter,
  FaMinus,
  FaEraser,
  FaPalette,
} from "react-icons/fa";

interface BlogTemplateEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

const btnBase =
  "p-2 rounded-md border transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
const btnActive = "bg-blue-100 border-blue-300 text-blue-700";

function ToolbarButton({
  onClick,
  active,
  title,
  children,
  className = "",
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`${btnBase} border-gray-200 bg-white min-w-[36px] ${active ? btnActive : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-7 bg-gray-200 mx-0.5" aria-hidden />;
}

export default function BlogTemplateEditor({
  initialContent,
  onSave,
}: BlogTemplateEditorProps) {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [colorPanelOpen, setColorPanelOpen] = useState(false);
  const [, setSelectionUpdate] = useState(0);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer", class: "text-blue-600 underline hover:text-blue-800" },
      }),
      Placeholder.configure({ placeholder: "Start writing… Use the toolbar for headings, lists, quotes, highlights, and more." }),
      TextAlign.configure({ types: ["heading", "paragraph", "blockquote"] }),
      Highlight.configure({ multicolor: false }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: "blog-editor-content min-h-[360px] px-5 py-4 focus:outline-none text-gray-800",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || "", { emitUpdate: false });
    }
  }, [initialContent, editor]);

  // Re-render toolbar when selection changes so active states (bold, italic, etc.) stay in sync
  useEffect(() => {
    if (!editor) return;
    const handler = () => setSelectionUpdate((n) => n + 1);
    editor.on("selectionUpdate", handler);
    editor.on("transaction", handler);
    return () => {
      editor.off("selectionUpdate", handler);
      editor.off("transaction", handler);
    };
  }, [editor]);

  useEffect(() => {
    if (linkPanelOpen && linkInputRef.current) {
      const href = editor?.getAttributes("link").href ?? "";
      setLinkUrl(href);
      linkInputRef.current.focus();
    }
  }, [linkPanelOpen, editor]);

  useEffect(() => {
    if (!linkPanelOpen && !colorPanelOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      const inLink = linkInputRef.current?.closest(".relative")?.contains(target);
      const inColor = (e.target as Element)?.closest?.("[data-color-panel]") != null;
      if (!inLink && !inColor) {
        setLinkPanelOpen(false);
        setColorPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [linkPanelOpen, colorPanelOpen]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      const html = editor.getHTML();
      await onSave(html);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [editor, onSave]);

  const applyLink = () => {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkPanelOpen(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
    setLinkPanelOpen(false);
    setLinkUrl("");
  };

  const clearFormat = () => {
    editor?.chain().focus().unsetAllMarks().clearNodes().run();
    setColorPanelOpen(false);
  };

  const TEXT_COLORS = [
    { name: "Default", value: "" },
    { name: "Black", value: "#1f2937" },
    { name: "Red", value: "#dc2626" },
    { name: "Blue", value: "#2563eb" },
    { name: "Green", value: "#16a34a" },
    { name: "Orange", value: "#ea580c" },
    { name: "Purple", value: "#7c3aed" },
    { name: "Slate", value: "#475569" },
  ] as const;

  const currentColor = editor?.getAttributes("textStyle")?.color ?? "";

  if (!editor) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Toolbar - Word/Notion style */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/80">
        {/* Text formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <FaBold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <FaItalic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <FaUnderline className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <FaHighlighter className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <ToolbarDivider />

        {/* Clear format */}
        <ToolbarButton
          onClick={clearFormat}
          title="Clear formatting"
        >
          <FaEraser className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Block: Paragraph, Headings, Blockquote */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            title="Paragraph"
          >
            <FaParagraph className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <span className="flex items-center gap-1 text-xs font-bold">
              <FaHeading className="w-3.5 h-3.5" /> 1
            </span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <span className="flex items-center gap-1 text-xs font-bold">
              <FaHeading className="w-3.5 h-3.5" /> 2
            </span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <span className="flex items-center gap-1 text-xs font-bold">
              <FaHeading className="w-3.5 h-3.5" /> 3
            </span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            active={editor.isActive("heading", { level: 4 })}
            title="Heading 4"
          >
            <span className="flex items-center gap-1 text-xs font-bold">
              <FaHeading className="w-3.5 h-3.5" /> 4
            </span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Quote"
          >
            <FaQuoteRight className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <ToolbarDivider />

        {/* Lists */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <FaListUl className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            <FaListOl className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <ToolbarDivider />

        {/* Inline code & Code block */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <span className="text-xs font-mono font-semibold">&lt;/&gt;</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <FaCode className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal line"
        >
          <FaMinus className="w-4 h-4" />
        </ToolbarButton>

        {/* Text color */}
        <div className="relative flex items-center" data-color-panel>
          <ToolbarButton
            onClick={() => setColorPanelOpen((v) => !v)}
            active={!!currentColor}
            title="Text color"
          >
            <FaPalette className="w-4 h-4" />
          </ToolbarButton>
          {colorPanelOpen && (
            <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[140px]">
              <p className="text-xs font-medium text-gray-500 px-1 pb-1.5">Text color</p>
              <div className="flex flex-wrap gap-1">
                {TEXT_COLORS.map(({ name, value }) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      if (value) editor.chain().focus().setColor(value).run();
                      else editor.chain().focus().unsetColor().run();
                      setColorPanelOpen(false);
                    }}
                    className={`w-7 h-7 rounded-md border-2 transition-transform hover:scale-110 ${
                      (value && currentColor?.toLowerCase() === value.toLowerCase()) || (!value && !currentColor)
                        ? "border-blue-500 ring-1 ring-blue-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={value ? { backgroundColor: value } : { background: "linear-gradient(135deg, #f3f4f6 50%, #e5e7eb 50%)" }}
                  >
                    {!value && <span className="text-[10px] font-bold text-gray-500">A</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <ToolbarDivider />

        {/* Link with popover */}
        <div className="relative flex items-center">
          <ToolbarButton
            onClick={() => setLinkPanelOpen((v) => !v)}
            active={editor.isActive("link")}
            title="Insert link"
          >
            <FaLink className="w-4 h-4" />
          </ToolbarButton>
          {linkPanelOpen && (
            <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[280px]">
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === "Escape") setLinkPanelOpen(false);
                }}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={applyLink}
                  className="flex-1 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
                {editor.isActive("link") && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLinkPanelOpen(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <ToolbarDivider />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align left"
          >
            <FaAlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align center"
          >
            <FaAlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align right"
          >
            <FaAlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <FaAlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="ml-auto flex items-center gap-2 pl-2">
          {saveStatus === "saved" && (
            <span className="text-sm text-green-600 font-medium">Saved</span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-600 font-medium">Save failed</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save content"}
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div className="blog-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
