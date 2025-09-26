import React from 'react';

interface TextFormatterProps {
  text: string;
  className?: string;
}

/**
 * Advanced text formatter with ChatGPT-like markdown support
 * Supports:
 * - # Headers (H1-H6)
 * - **bold** and ***bold*** text
 * - *italic* text
 * - `inline code`
 * - ```code blocks```
 * - Numbered lists (1. item)
 * - Bullet lists (- item, * item, • item)
 * - Line breaks and paragraphs
 * - Links [text](url)
 * - Blockquotes > text
 */
export const formatText = (text: string): React.ReactNode[] => {
  if (!text) return [];

  const lines = text.split('\n');
  const formattedLines: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        formattedLines.push(
          <div key={`codeblock-${lineIndex}`} className="my-3">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          </div>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      formattedLines.push(<div key={`empty-${lineIndex}`} className="h-2" />);
      continue;
    }

    // Handle headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
      const headerClasses = {
        1: 'text-2xl font-bold mb-4 mt-6',
        2: 'text-xl font-bold mb-3 mt-5',
        3: 'text-lg font-bold mb-2 mt-4',
        4: 'text-base font-bold mb-2 mt-3',
        5: 'text-sm font-bold mb-1 mt-2',
        6: 'text-xs font-bold mb-1 mt-2'
      };
      
      formattedLines.push(
        <HeaderTag key={`header-${lineIndex}`} className={headerClasses[level as keyof typeof headerClasses]}>
          {formatInlineText(text)}
        </HeaderTag>
      );
      continue;
    }

    // Handle blockquotes
    if (line.trim().startsWith('> ')) {
      const quoteText = line.trim().slice(2);
      formattedLines.push(
        <blockquote key={`quote-${lineIndex}`} className="border-l-4 border-blue-500 pl-4 py-2 my-2 bg-blue-50 italic">
          {formatInlineText(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Handle numbered lists
    const numberedListMatch = line.match(/^\s*(\d+)\. (.+)$/);
    if (numberedListMatch) {
      const text = numberedListMatch[2];
      formattedLines.push(
        <div key={`numbered-${lineIndex}`} className="flex items-start mb-1">
          <span className="font-semibold text-blue-600 mr-2 min-w-[1.5rem]">{numberedListMatch[1]}.</span>
          <span className="flex-1">{formatInlineText(text)}</span>
        </div>
      );
      continue;
    }

    // Handle bullet lists
    const bulletListMatch = line.match(/^\s*[-*•]\s+(.+)$/);
    if (bulletListMatch) {
      const text = bulletListMatch[1];
      formattedLines.push(
        <div key={`bullet-${lineIndex}`} className="flex items-start mb-1">
          <span className="text-blue-600 mr-2 mt-1">•</span>
          <span className="flex-1">{formatInlineText(text)}</span>
        </div>
      );
      continue;
    }

    // Handle regular paragraphs
    formattedLines.push(
      <div key={`para-${lineIndex}`} className="mb-2 leading-relaxed">
        {formatInlineText(line)}
      </div>
    );
  }

  return formattedLines;
};

/**
 * Format inline text elements (bold, italic, code, links)
 */
const formatInlineText = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let partIndex = 0;

  // Patterns for inline formatting (order matters!)
  const patterns = [
    // Links [text](url)
    { 
      regex: /\[([^\]]+)\]\(([^)]+)\)/g, 
      render: (match: RegExpMatchArray, key: string) => (
        <a key={key} href={match[2]} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      )
    },
    // Bold with triple asterisks
    { 
      regex: /\*\*\*(.*?)\*\*\*/g, 
      render: (match: RegExpMatchArray, key: string) => (
        <strong key={key} className="font-bold text-gray-900">{match[1]}</strong>
      )
    },
    // Bold with double asterisks
    { 
      regex: /\*\*(.*?)\*\*/g, 
      render: (match: RegExpMatchArray, key: string) => (
        <strong key={key} className="font-bold text-gray-900">{match[1]}</strong>
      )
    },
    // Italic
    { 
      regex: /\*(.*?)\*/g, 
      render: (match: RegExpMatchArray, key: string) => (
        <em key={key} className="italic text-gray-700">{match[1]}</em>
      )
    },
    // Inline code
    { 
      regex: /`([^`]+)`/g, 
      render: (match: RegExpMatchArray, key: string) => (
        <code key={key} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border">
          {match[1]}
        </code>
      )
    }
  ];

  // Find all matches
  const allMatches: Array<{
    match: RegExpMatchArray;
    pattern: typeof patterns[0];
    start: number;
    end: number;
  }> = [];

  patterns.forEach(pattern => {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      allMatches.push({
        match,
        pattern,
        start: match.index!,
        end: match.index! + match[0].length
      });
    }
  });

  // Sort matches by start position
  allMatches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one)
  const validMatches = [];
  let lastEnd = 0;
  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      validMatches.push(match);
      lastEnd = match.end;
    }
  }

  // Build formatted parts
  validMatches.forEach(({ match, pattern, start, end }) => {
    // Add text before this match
    if (start > currentIndex) {
      const beforeText = text.slice(currentIndex, start);
      if (beforeText) {
        parts.push(<span key={`text-${partIndex++}`}>{beforeText}</span>);
      }
    }

    // Add the formatted match
    parts.push(pattern.render(match, `format-${partIndex++}`));
    currentIndex = end;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    if (remainingText) {
      parts.push(<span key={`text-${partIndex++}`}>{remainingText}</span>);
    }
  }

  // If no formatting was found, return the plain text
  if (parts.length === 0) {
    parts.push(<span key="plain">{text}</span>);
  }

  return parts;
};

/**
 * React component for rendering ChatGPT-like formatted text
 */
export const FormattedText: React.FC<TextFormatterProps> = ({ text, className = '' }) => {
  const formattedContent = formatText(text);
  
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {formattedContent}
    </div>
  );
};

/**
 * Simple formatter for ChatGPT-style markdown
 * Returns JSX elements with comprehensive formatting
 */
export const renderFormattedText = (text: string): React.ReactNode => {
  return <FormattedText text={text} />;
};

export default FormattedText;
