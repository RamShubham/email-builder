import React, { useRef, useEffect } from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage } from './useAiChat';

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleApply = (template: Record<string, any>) => {
    onApplyTemplate(template);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col chat-overlay-enter">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-[1rem]" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">AI Email Builder</span>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onResetChat}
                  className="h-8 w-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
                >
                  <RotateCcw className="w-4 h-4" />
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
                  className="h-8 w-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80"
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200/60" />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessageComponent key={msg.id} message={msg} onApplyTemplate={handleApply} />
          ))}
        </div>

        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <ChatInput onSend={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
