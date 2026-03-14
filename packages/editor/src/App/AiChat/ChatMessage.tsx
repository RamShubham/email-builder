import React from 'react';
import { Sparkles, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatMessage as ChatMessageType } from './useAiChat';

interface ChatMessageProps {
  message: ChatMessageType;
  onApplyTemplate?: (template: Record<string, any>) => void;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function StreamingCursor() {
  return (
    <span
      className="inline-block w-[2px] h-[14px] bg-gray-500 ml-0.5 rounded-sm align-middle"
      style={{ animation: 'cursor-blink 0.9s step-end infinite' }}
    />
  );
}

/** Lightweight markdown renderer: bold, italic, inline code, bullet lists */
function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    // Check for **bold**, *italic*, `code` — pick the earliest match
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    type Match = { index: number; length: number; node: React.ReactNode };
    let earliest: Match | null = null;

    const consider = (m: RegExpMatchArray | null, makeNode: (s: string) => React.ReactNode) => {
      if (m && m.index !== undefined) {
        const candidate: Match = { index: m.index, length: m[0].length, node: makeNode(m[1]) };
        if (!earliest || candidate.index < earliest.index) earliest = candidate;
      }
    };

    consider(boldMatch, (s) => <strong key={`${keyBase}-b-${idx}`} className="font-semibold">{s}</strong>);
    consider(italicMatch, (s) => <em key={`${keyBase}-i-${idx}`}>{s}</em>);
    consider(codeMatch, (s) => (
      <code key={`${keyBase}-c-${idx}`} className="px-1.5 py-0.5 bg-gray-100 rounded text-[12px] font-mono text-gray-700">
        {s}
      </code>
    ));

    if (earliest) {
      if (earliest.index > 0) parts.push(remaining.substring(0, earliest.index));
      parts.push(earliest.node);
      remaining = remaining.substring(earliest.index + earliest.length);
      idx++;
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bullet list item
    if (/^[-*•]\s+/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^[-*•]\s+/, '');
        listItems.push(
          <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[9px]" />
            <span>{renderInline(itemText, `li-${i}`)}</span>
          </li>
        );
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="flex flex-col gap-1 my-1">
          {listItems}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      const listItems: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+\.\s+/, '');
        listItems.push(
          <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
            <span className="text-gray-400 text-[12px] font-medium flex-shrink-0 mt-[1px] w-4 text-right">{num}.</span>
            <span>{renderInline(itemText, `oli-${i}`)}</span>
          </li>
        );
        i++;
        num++;
      }
      result.push(
        <ol key={`ol-${i}`} className="flex flex-col gap-1 my-1">
          {listItems}
        </ol>
      );
      continue;
    }

    // Empty line → paragraph break (skip)
    if (line.trim() === '') {
      if (result.length > 0) {
        result.push(<div key={`spacer-${i}`} className="h-1.5" />);
      }
      i++;
      continue;
    }

    // Normal paragraph line
    result.push(
      <p key={`p-${i}`} className="text-[13.5px] leading-relaxed">
        {renderInline(line, `p-${i}`)}
      </p>
    );
    i++;
  }

  return <div className="flex flex-col gap-0.5">{result}</div>;
}

export default function ChatMessage({ message, onApplyTemplate }: ChatMessageProps) {
  console.log('[ChatMessage v2] id:', message.id, 'role:', message.role, 'streaming:', message.isStreaming);
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;
  const hasContent = Boolean(message.content);

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm mb-0.5">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}

      <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`} style={{ maxWidth: 'calc(100% - 36px)' }}>
        <div
          className={`px-3.5 py-2.5 ${
            isUser
              ? 'bg-gray-900 text-white rounded-2xl rounded-br-sm text-[13.5px] leading-relaxed'
              : 'text-gray-800 rounded-2xl rounded-bl-sm'
          }`}
        >
          {isUser ? (
            <span className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{message.content}</span>
          ) : hasContent ? (
            <>
              <MarkdownContent content={message.content} />
              {isStreaming && <StreamingCursor />}
            </>
          ) : isStreaming ? (
            <TypingDots />
          ) : null}
        </div>

        {message.template && onApplyTemplate && (
          <button
            onClick={() => onApplyTemplate(message.template!)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-[12px] font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Wand2 className="w-3 h-3" />
            Apply to canvas
          </button>
        )}
      </div>
    </div>
  );
}
