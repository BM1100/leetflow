'use client';

import React from 'react';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

// Clean up raw LaTeX artifacts like \mathcal{O}, \cdot, $$, $ before parsing
function preprocessLaTeX(rawText: string): string {
  if (!rawText) return '';

  return rawText
    // Clean block math $$...$$
    .replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, '`$1`')
    // Clean inline math $\mathcal{O}(...)$ or $...$
    .replace(/\$\s*\\mathcal\{O\}\((.*?)\)\s*\$/g, 'O($1)')
    .replace(/\$\\mathcal\{O\}\((.*?)\)\$/g, 'O($1)')
    .replace(/\\mathcal\{O\}/g, 'O')
    .replace(/\\cdot/g, '·')
    .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1/$2)')
    .replace(/\\binom\{(.*?)\}\{(.*?)\}/g, 'C($1, $2)')
    .replace(/\$(.*?)\$/g, '`$1`');
}

export function FormattedMarkdown({ content, className = '' }: FormattedMarkdownProps) {
  if (!content) return null;

  const cleanedContent = preprocessLaTeX(content);

  // Split into lines to process block elements (headings, list items, blockquotes, code blocks)
  const lines = cleanedContent.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = '';

  lines.forEach((line, index) => {
    // Handle code blocks (```)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <div key={`codeblock-${index}`} className="my-2.5 rounded-lg bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto font-mono text-xs text-zinc-100 shadow-inner">
            {codeBlockLang && (
              <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-800 pb-1">
                {codeBlockLang}
              </div>
            )}
            <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
          </div>
        );
        codeBlockLines = [];
        codeBlockLang = '';
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Headings
    if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={`h4-${index}`} className="text-sm font-bold text-rose-500 dark:text-rose-400 mt-2.5 mb-1 tracking-tight">
          {renderInlineMarkdown(line.slice(5))}
        </h5>
      );
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${index}`} className="text-base font-bold text-foreground mt-3 mb-1 tracking-tight">
          {renderInlineMarkdown(line.slice(4))}
        </h4>
      );
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${index}`} className="text-lg font-bold text-foreground mt-4 mb-1.5 tracking-tight border-b pb-1">
          {renderInlineMarkdown(line.slice(3))}
        </h3>
      );
      return;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${index}`} className="text-xl font-extrabold text-foreground mt-4 mb-2 tracking-tight">
          {renderInlineMarkdown(line.slice(2))}
        </h2>
      );
      return;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${index}`} className="my-2.5 border-border" />);
      return;
    }

    // List item (* or - or numbered like 1.)
    const listMatch = line.match(/^(\s*)([*|-]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1].length;
      const contentText = listMatch[3];
      elements.push(
        <div key={`li-${index}`} className="flex items-start gap-2 my-0.5" style={{ paddingLeft: `${Math.min(indent * 12, 36)}px` }}>
          <span className="text-rose-500 font-bold select-none mt-0.5">•</span>
          <div className="flex-1 leading-relaxed text-sm">{renderInlineMarkdown(contentText)}</div>
        </div>
      );
      return;
    }

    // Blockquote (>)
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${index}`} className="border-l-2 border-rose-500/60 pl-3 py-1 my-2 bg-rose-500/5 rounded-r text-muted-foreground italic text-xs">
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={`blank-${index}`} className="h-1.5" />);
      return;
    }

    // Regular paragraph line
    elements.push(
      <p key={`p-${index}`} className="my-0.5 leading-relaxed text-sm">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  // Handle unclosed code block at end of content
  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <div key="codeblock-eof" className="my-2.5 rounded-lg bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto font-mono text-xs text-zinc-100 shadow-inner">
        {codeBlockLang && (
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-800 pb-1">
            {codeBlockLang}
          </div>
        )}
        <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
      </div>
    );
  }

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
}

// Inline Markdown parser for **bold**, *italic*, `code`, and [links](url)
function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const nodes: React.ReactNode[] = [];
  // Matches: `code`, **bold**, *italic*, [link](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];

    // Inline Code: `code`
    if (token.startsWith('`') && token.endsWith('`')) {
      const codeStr = token.slice(1, -1);
      nodes.push(
        <code key={`code-${match.index}`} className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 font-mono text-[0.85em] text-rose-600 dark:text-rose-400 font-semibold">
          {codeStr}
        </code>
      );
    }
    // Bold: **bold**
    else if (token.startsWith('**') && token.endsWith('**')) {
      const boldStr = token.slice(2, -2);
      nodes.push(
        <strong key={`bold-${match.index}`} className="font-bold text-foreground">
          {boldStr}
        </strong>
      );
    }
    // Italic: *italic*
    else if (token.startsWith('*') && token.endsWith('*')) {
      const italicStr = token.slice(1, -1);
      nodes.push(
        <em key={`italic-${match.index}`} className="italic text-foreground/90">
          {italicStr}
        </em>
      );
    }
    // Link: [label](url)
    else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const label = linkMatch[1];
        const url = linkMatch[2];
        const isLeetCode = url.includes('leetcode.com');
        nodes.push(
          <a
            key={`link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-500 hover:text-rose-600 underline font-medium inline-flex items-center gap-0.5"
          >
            {label}
            {isLeetCode && <span className="text-[10px] opacity-75">↗</span>}
          </a>
        );
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes;
}
