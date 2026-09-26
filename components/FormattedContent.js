import React from "react";

/**
 * Converts plain text / markdown / legacy text into clean WordPress-style HTML.
 * Preserves exact double newlines as paragraphs and single newlines as breaks (<br />).
 */
export function formatToWordPressHtml(text) {
  if (!text) return "";

  const trimmed = String(text).trim();
  if (!trimmed) return "";

  // If content already contains rich HTML block tags, treat as HTML
  const hasHtml = /<\/?(p|h[1-6]|ul|ol|li|blockquote|div|table|strong|em|br)[^>]*>/i.test(trimmed);
  if (hasHtml) {
    return trimmed;
  }

  // If text already contains newlines or headings, keep it intact; only restore headings for flat single-line legacy text
  let processed = trimmed
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const isFlatText = !processed.includes("\n");
  if (isFlatText) {
    processed = processed.replace(
      /\s+(Commercial Applications|Applications|Packaging(?:\s+Options)?|Specifications|Why Choose Seven Spice|Storage(?:\s+Instructions)?|Commercial Sourcing[^\n]*)\s+(?=[A-Z])/g,
      "\n\n## $1\n"
    );
  }

  // Split into paragraph chunks by 2 or more newlines
  const rawBlocks = processed.split(/\n{2,}/);
  const htmlBlocks = [];

  for (const block of rawBlocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const renderLines = (contentLines) => {
      if (!contentLines || !contentLines.length) return;

      const isBulletList = contentLines.every(l => /^[-*•]\s+/.test(l));
      const isNumberedList = contentLines.every(l => /^\d+[.)]\s+/.test(l));

      if (isBulletList) {
        const items = contentLines.map(l => `<li>${formatInline(l.replace(/^[-*•]\s+/, ""))}</li>`).join("");
        htmlBlocks.push(`<ul>${items}</ul>`);
        return;
      }

      if (isNumberedList) {
        const items = contentLines.map(l => `<li>${formatInline(l.replace(/^\d+[.)]\s+/, ""))}</li>`).join("");
        htmlBlocks.push(`<ol>${items}</ol>`);
        return;
      }

      // Mix of paragraphs and bullets
      let currentType = null;
      let currentGroup = [];

      const flushGroup = () => {
        if (!currentGroup.length) return;
        if (currentType === "list") {
          const items = currentGroup.map(l => `<li>${formatInline(l.replace(/^[-*•]\s+/, ""))}</li>`).join("");
          htmlBlocks.push(`<ul>${items}</ul>`);
        } else {
          htmlBlocks.push(`<p>${currentGroup.map(formatInline).join("<br />")}</p>`);
        }
        currentGroup = [];
      };

      for (const line of contentLines) {
        const isBullet = /^[-*•]\s+/.test(line);
        const lineType = isBullet ? "list" : "p";
        if (lineType !== currentType) {
          flushGroup();
          currentType = lineType;
        }
        currentGroup.push(line);
      }
      flushGroup();
    };

    // Check if block starts with a heading
    const firstLine = lines[0];
    const h2Match = firstLine.match(/^##\s+(.+)$/);
    const h3Match = firstLine.match(/^###\s+(.+)$/);

    if (h2Match) {
      htmlBlocks.push(`<h2>${formatInline(h2Match[1])}</h2>`);
      renderLines(lines.slice(1));
      continue;
    }

    if (h3Match) {
      htmlBlocks.push(`<h3>${formatInline(h3Match[1])}</h3>`);
      renderLines(lines.slice(1));
      continue;
    }

    renderLines(lines);
  }

  return htmlBlocks.join("\n");
}

function formatInline(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export default function FormattedContent({ content, className = "" }) {
  if (!content) return null;

  const html = formatToWordPressHtml(content);

  return (
    <div
      className={`wp-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
