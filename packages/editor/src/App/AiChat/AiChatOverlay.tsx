import React, { useRef, useEffect, useCallback, useState } from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage } from './useAiChat';

const EXIT_DURATION = 220;

interface AiChatOverlayProps {
  open: boolean;
  onClose: () => void;
  onApplyTemplate: (template: Record<string, any>) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
}

export default function AiChatOverlay({
  open,
  onClose,
  onApplyTemplate,
  messages,
  isLoading,
  onSendMessage,
  onResetChat,
}: AiChatOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const [isRendered, setIsRendered] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      setIsRendered(true);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, EXIT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      isNearBottomRef.current = true;
      setTimeout(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    }
  }, [open]);

  const handleApply = (template: Record<string, any>) => {
    onApplyTemplate(template);
    onClose();
  };

  if (!isRendered) return null;

  const backdropClass = isClosing ? 'ai-backdrop-exit' : 'ai-backdrop-enter';
  const panelClass = isClosing ? 'ai-panel-exit' : 'ai-panel-enter';

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-white/50 backdrop-blur-[6px] rounded-[1rem] ${backdropClass}`}
        onClick={isClosing ? undefined : onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-[520px] flex flex-col bg-white rounded-t-2xl overflow-hidden ai-chat-panel ${panelClass}`}
        style={{ height: 'min(600px, calc(100% - 48px))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-gray-800">AI Email Builder</span>
          </div>

          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onResetChat}
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New conversation</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 flex-shrink-0" />

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3 min-h-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <ChatMessageComponent key={msg.id} message={msg} onApplyTemplate={handleApply} />
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0">
          <ChatInput onSend={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
