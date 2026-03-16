import React, { useRef, useEffect, useCallback } from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage } from './useAiChat';

export const ISLAND_HEIGHT = 52;

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
        className="absolute inset-0 z-40 rounded-[1rem]"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        onClick={onClose}
      />

      {/* Single expanding container — grows upward from the island pill */}
      <div
        style={{
          position: 'absolute',
          zIndex: 50,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(560px, 100%)',
          height: open ? 'min(600px, calc(100% - 16px))' : `${ISLAND_HEIGHT}px`,
          borderRadius: 16,
          border: `1px solid ${open ? 'rgba(0,0,0,0.07)' : 'rgb(229,231,235)'}`,
          boxShadow: open ? '0 -4px 24px rgba(0,0,0,0.08), 0 -1px 6px rgba(0,0,0,0.04)' : 'none',
          background: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: [
            'height 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            'box-shadow 0.3s ease',
            'border-color 0.25s ease',
          ].join(', '),
        }}
      >
        {/* ── Top section: header + messages — grows from nothing ── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            opacity: open ? 1 : 0,
            transition: open ? 'opacity 0.2s ease 0.15s' : 'opacity 0.1s ease 0s',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              >
                <Sparkles style={{ width: 12, height: 12, color: 'white' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>AI Email Builder</span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onResetChat}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80">
                    <RotateCcw style={{ width: 14, height: 14 }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New conversation</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onClose}
                    className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80">
                    <X style={{ width: 14, height: 14 }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgb(243,244,246)', flexShrink: 0 }} />

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', minHeight: 0, scrollBehavior: 'smooth' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} onApplyTemplate={handleApply} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom section: morphs between island pill and chat input ── */}
        <div style={{ flexShrink: 0, height: ISLAND_HEIGHT, position: 'relative' }}>
          {/* Chat input — shown when open */}
          <div
            style={{
              position: 'absolute', inset: 0,
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              transition: open ? 'opacity 0.18s ease 0.12s' : 'opacity 0.1s ease 0s',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChatInput onSend={onSendMessage} disabled={isLoading} />
          </div>

          {/* Island pill — shown when closed */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
              cursor: 'text',
              opacity: open ? 0 : 1,
              pointerEvents: open ? 'none' : 'auto',
              transition: open ? 'opacity 0.08s ease 0s' : 'opacity 0.2s ease 0.08s',
            }}
            onClick={() => onOpen()}
          >
            <div
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 10,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Sparkles style={{ width: 12, height: 12, color: 'white' }} />
            </div>
            <input
              type="text"
              placeholder="Ask AI to build your email…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 13.5, color: '#1f2937', lineHeight: 1.5,
              }}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => onOpen()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
