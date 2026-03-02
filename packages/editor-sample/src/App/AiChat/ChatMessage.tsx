import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatMessage as ChatMessageType } from './useAiChat';

interface ChatMessageProps {
  message: ChatMessageType;
  onApplyTemplate?: (template: Record<string, any>) => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function formatContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);

      let nextMatch: { index: number; length: number; node: React.ReactNode } | null = null;

      if (boldMatch && boldMatch.index !== undefined) {
        const candidate = { index: boldMatch.index, length: boldMatch[0].length, node: <strong key={`b-${i}-${keyIdx}`}>{boldMatch[1]}</strong> };
        if (!nextMatch || candidate.index < nextMatch.index) nextMatch = candidate;
      }
      if (codeMatch && codeMatch.index !== undefined) {
        const candidate = { index: codeMatch.index, length: codeMatch[0].length, node: <code key={`c-${i}-${keyIdx}`} className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">{codeMatch[1]}</code> };
        if (!nextMatch || candidate.index < nextMatch.index) nextMatch = candidate;
      }

      if (nextMatch) {
        if (nextMatch.index > 0) {
          parts.push(remaining.substring(0, nextMatch.index));
        }
        parts.push(nextMatch.node);
        remaining = remaining.substring(nextMatch.index + nextMatch.length);
        keyIdx++;
      } else {
        parts.push(remaining);
        break;
      }
    }

    return (
      <React.Fragment key={i}>
        {parts}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function ChatMessage({ message, onApplyTemplate }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming && !message.content;

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 text-[13.5px] leading-relaxed ${
            isUser
              ? 'bg-gray-900 text-white rounded-2xl rounded-br-md'
              : 'bg-gray-100/80 text-gray-800 rounded-2xl rounded-bl-md'
          }`}
        >
          {isStreaming ? <TypingIndicator /> : formatContent(message.content)}
        </div>

        {message.template && onApplyTemplate && (
          <Button
            onClick={() => onApplyTemplate(message.template!)}
            className="h-9 px-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Apply to canvas
          </Button>
        )}
      </div>
    </div>
  );
}
