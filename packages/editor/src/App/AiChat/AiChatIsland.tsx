import React, { useRef, useEffect, useCallback } from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage } from './useAiChat';

export const ISLAND_HEIGHT = 60;

interface AiChatIslandProps {
  open: boolean;
  onOpen: (text?: string) => void;
  onClose: () => void;
  onApplyTemplate: (template: Record<string, any>) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
}

export default function AiChatIsland({
  open,
  onOpen,
  onClose,
  onApplyTemplate,
  messages,
  isLoading,
  onSendMessage,
  onResetChat,
}: AiChatIslandProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isNearBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 80;
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    isNearBottomRef.current = true;
    setTimeout(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 120);
  }, [open]);

  const handleApply = (template: Record<string, any>) => {
    onApplyTemplate(template);
    onClose();
  };

  return (
    <>
      {/* Backdrop — fades in when open, click to close */}
      <div
        className={`absolute inset-0 z-40 rounded-[1rem] bg-white/60 backdrop-blur-[6px] transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Single expanding container — grows upward from the island pill */}
      <div
        className="absolute bottom-0 left-1/2 z-50 flex w-full max-w-[560px] -translate-x-1/2 flex-col overflow-hidden rounded-2xl bg-white"
        style={{
          height: open ? 'min(600px, calc(100% - 16px))' : `${ISLAND_HEIGHT}px`,
          border: `1px solid ${open ? 'rgba(0,0,0,0.07)' : 'rgb(229,231,235)'}`,
          boxShadow: open ? '0 -4px 24px rgba(0,0,0,0.08), 0 -1px 6px rgba(0,0,0,0.04)' : 'none',
          transition: [
            'height 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            'box-shadow 0.3s ease',
            'border-color 0.25s ease',
          ].join(', '),
        }}
      >
        {/* ── Top section: header + messages — grows from nothing ── */}
        <div
          className={`flex flex-1 min-h-0 flex-col overflow-hidden transition-opacity ${open ? 'opacity-100 delay-150 duration-200' : 'opacity-0 duration-100'}`}
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800">AI Email Builder</span>
            </div>
            <div className="flex gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onResetChat}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New conversation</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onClose}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="h-px w-full flex-shrink-0 bg-gray-100" />

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto px-4 py-3"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} onApplyTemplate={handleApply} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom section: morphs between island pill and chat input ── */}
        <div className="relative flex-shrink-0 min-h-[60px]">
          {/* Chat input — shown when open */}
          <div
            className={`transition-opacity ${open ? 'opacity-100 delay-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'}`}
          >
            <ChatInput onSend={onSendMessage} disabled={isLoading} />
          </div>

          {/* Island pill — shown when closed */}
          <div
            className={`absolute inset-0 flex cursor-text items-center gap-[10px] px-3 transition-opacity ${open ? 'pointer-events-none opacity-0 delay-0 duration-75' : 'pointer-events-auto opacity-100 delay-75 duration-200'}`}
            onClick={() => onOpen()}
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <input
              type="text"
              placeholder="Ask AI to build your email…"
              className="flex-1 border-none bg-transparent text-[13.5px] leading-relaxed text-gray-800 outline-none"
              onClick={(e) => e.stopPropagation()}
              onFocus={() => onOpen()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
