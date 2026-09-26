"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Code2,
  Eye,
  PlusCircle,
  Pilcrow
} from "lucide-react";

export default function WysiwygEditor({
  value = "",
  onChange,
  placeholder = "Write comprehensive product details, commercial applications, and specifications...",
  disabled = false
}) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(value || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHtml(html);
      if (onChange) {
        onChange(html);
      }
    },
  });

  // Keep editor content in sync if value changes externally (e.g. editing a different product)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || "");
      setRawHtml(value || "");
    }
  }, [value, editor]);

  const handleRawHtmlChange = (e) => {
    const newHtml = e.target.value;
    setRawHtml(newHtml);
    if (onChange) {
      onChange(newHtml);
    }
    if (editor) {
      editor.commands.setContent(newHtml, false);
    }
  };

  const insertTemplate = (type) => {
    if (!editor) return;
    let templateHtml = "";
    if (type === "applications") {
      templateHtml = `
        <h2>Commercial Applications</h2>
        <p>This ingredient is engineered for high-performance commercial and industrial applications:</p>
        <ul>
          <li>Dry seasoning blends, rubs, and artisan spice mixes</li>
          <li>Extruded snacks, chips, and savory coatings</li>
          <li>Prepared sauces, marinades, gravies, and soups</li>
          <li>Processed meat, sausage, and plant-based protein formulations</li>
        </ul>
      `;
    } else if (type === "why_choose") {
      templateHtml = `
        <h2>Why Choose Seven Spice?</h2>
        <ul>
          <li><strong>100% Botanical Purity:</strong> Free from artificial starches, dyes, or fillers.</li>
          <li><strong>Sortex Optical Cleaning:</strong> Precision electronic sorting removes all foreign debris.</li>
          <li><strong>Controlled Moisture:</strong> Stably dehydrated to under 6.0% moisture to prevent clumping.</li>
          <li><strong>Export Documentation:</strong> Delivered with full Certificate of Analysis (COA) and Halal compliance.</li>
        </ul>
      `;
    } else if (type === "packaging") {
      templateHtml = `
        <h2>Bulk Packaging & Export Sourcing</h2>
        <p>Supplied in heavy-duty export cartons with vacuum-sealed moisture barrier inner liners (20 kg / 25 kg). Palletization, custom container load planning, and private-label retail packaging are available upon commercial request.</p>
      `;
    }

    editor.chain().focus().insertContent(templateHtml).run();
  };

  if (!editor) {
    return (
      <div className="border border-on-surface/15 rounded-lg p-4 bg-surface-container-low min-h-[220px] flex items-center justify-center text-xs text-on-surface-variant font-mono">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border border-on-surface/15 rounded-lg overflow-hidden bg-surface-container-low focus-within:border-primary transition-colors flex flex-col">
      {/* Top Toolbar (WordPress-style) */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-surface-container-high border-b border-on-surface/10 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {/* Paragraph */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("paragraph")
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Normal Paragraph"
            disabled={disabled || isHtmlMode}
          >
            <Pilcrow size={14} />
          </button>

          {/* Heading 2 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Heading 2 (Section Title)"
            disabled={disabled || isHtmlMode}
          >
            <Heading2 size={14} />
          </button>

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Heading 3 (Sub-heading)"
            disabled={disabled || isHtmlMode}
          >
            <Heading3 size={14} />
          </button>

          <span className="w-[1px] h-4 bg-on-surface/15 mx-1" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("bold")
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Bold"
            disabled={disabled || isHtmlMode}
          >
            <Bold size={14} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("italic")
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Italic"
            disabled={disabled || isHtmlMode}
          >
            <Italic size={14} />
          </button>

          <span className="w-[1px] h-4 bg-on-surface/15 mx-1" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("bulletList")
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Bullet List"
            disabled={disabled || isHtmlMode}
          >
            <List size={14} />
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("orderedList")
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Numbered List"
            disabled={disabled || isHtmlMode}
          >
            <ListOrdered size={14} />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded transition-colors ${
              editor.isActive("blockquote")
                ? "bg-primary text-on-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface"
            }`}
            title="Blockquote"
            disabled={disabled || isHtmlMode}
          >
            <Quote size={14} />
          </button>

          {/* Horizontal Rule */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface transition-colors"
            title="Horizontal Divider"
            disabled={disabled || isHtmlMode}
          >
            <Minus size={14} />
          </button>

          <span className="w-[1px] h-4 bg-on-surface/15 mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || disabled || isHtmlMode}
            className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface disabled:opacity-40 transition-colors"
            title="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || disabled || isHtmlMode}
            className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface disabled:opacity-40 transition-colors"
            title="Redo"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* View Toggle: Visual vs HTML */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
              isHtmlMode
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface text-on-surface-variant border-on-surface/10 hover:border-primary/40 hover:text-primary"
            }`}
            title={isHtmlMode ? "Switch to Visual WYSIWYG Editor" : "Switch to Raw HTML Code"}
          >
            {isHtmlMode ? <Eye size={12} /> : <Code2 size={12} />}
            <span>{isHtmlMode ? "Visual Editor" : "HTML Code"}</span>
          </button>
        </div>
      </div>

      {/* Quick B2B Section Inserters */}
      {!isHtmlMode && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-surface-container border-b border-on-surface/10 text-[11px]">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1">
            <PlusCircle size={11} className="text-secondary" /> Add Block:
          </span>
          <button
            type="button"
            onClick={() => insertTemplate("applications")}
            className="px-2 py-0.5 rounded bg-surface hover:bg-surface-container-high border border-on-surface/10 text-primary font-medium transition-colors text-[10px]"
          >
            + Applications
          </button>
          <button
            type="button"
            onClick={() => insertTemplate("why_choose")}
            className="px-2 py-0.5 rounded bg-surface hover:bg-surface-container-high border border-on-surface/10 text-primary font-medium transition-colors text-[10px]"
          >
            + Why Choose
          </button>
          <button
            type="button"
            onClick={() => insertTemplate("packaging")}
            className="px-2 py-0.5 rounded bg-surface hover:bg-surface-container-high border border-on-surface/10 text-primary font-medium transition-colors text-[10px]"
          >
            + Packaging
          </button>
        </div>
      )}

      {/* Editing Canvas */}
      <div className="relative min-h-[260px] max-h-[480px] overflow-y-auto bg-surface-container-lowest">
        {isHtmlMode ? (
          <textarea
            value={rawHtml}
            onChange={handleRawHtmlChange}
            disabled={disabled}
            placeholder="Edit HTML markup directly..."
            className="w-full h-full min-h-[260px] p-4 font-mono text-xs text-on-surface bg-transparent focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="p-4 wp-content focus:outline-none">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-surface-container-high border-t border-on-surface/10 flex items-center justify-between text-[11px] text-on-surface-variant">
        <span>Press <strong>Enter</strong> for new paragraph, <strong>Shift + Enter</strong> for line break.</span>
        <span className="font-mono text-[10px] opacity-75">WordPress WYSIWYG Mode</span>
      </div>
    </div>
  );
}
