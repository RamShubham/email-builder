import { useCallback, useRef, useState } from 'react';

import { useIds } from '../../documents/editor/EditorContext';
import useRequest from '../../hook/useRequest';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  template?: Record<string, any>;
  isStreaming?: boolean;
}

const TEMPLATE_START = '|||TEMPLATE_START|||';
const MARKER_PREFIX = '|||';

function stripTemplateContent(text: string): string {
  const idx = text.indexOf(TEMPLATE_START);
  if (idx !== -1) return text.substring(0, idx).trim();

  const lastPipe = text.lastIndexOf(MARKER_PREFIX);
  if (lastPipe !== -1) {
    const trailing = text.substring(lastPipe);
    if (TEMPLATE_START.startsWith(trailing)) {
      return text.substring(0, lastPipe).trim();
    }
  }

  return text;
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: 'Hey! I\'m your email builder assistant. Tell me about the email you\'d like to create — a welcome message, a newsletter, a notification, or something else entirely. I\'ll help you design it step by step.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(`session-${Date.now()}`);
  const { workspaceId } = useIds();

  const [{ loading: isResetLoading }, resetChatRequest] = useRequest(
    { method: 'post', url: '/api/chat/reset' },
    { manual: true }
  );

  const sendMessage = useCallback(async (content: string, currentDocument?: Record<string, any>) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    };
    const assistantId = `assistant-${Date.now()}`;

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '', isStreaming: true },
    ]);

    try {
      const token = (window as any).accessToken || '';
      const backendUrl = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');
      const response = await fetch(`${backendUrl}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ message: content.trim(), sessionId: sessionIdRef.current, workspaceId, currentDocument }),
      });


      if (!response.ok || !response.body) {
        const errorText = await response.text();
        console.error('[useAiChat] request failed, body:', errorText);
        throw new Error(`Stream request failed: ${response.status} ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = JSON.parse(line.slice(6));

          if (data.type === 'chunk') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: stripTemplateContent(m.content + data.content) }
                  : m
              )
            );
          } else if (data.type === 'done') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                    ...m,
                    content: data.content || 'Sorry, something went wrong. Please try again.',
                    template: data.template ?? undefined,
                    isStreaming: false,
                  }
                  : m
              )
            );
          } else if (data.type === 'error') {
            throw new Error(data.error);
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.', isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, workspaceId]);

  const resetChat = useCallback(async () => {
    try {
      await resetChatRequest({
        data: { sessionId: sessionIdRef.current, workspaceId },
      });
    } catch {
      // ignore reset errors
    }

    sessionIdRef.current = `session-${Date.now()}`;
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: 'Hey! I\'m your email builder assistant. Tell me about the email you\'d like to create — a welcome message, a newsletter, a notification, or something else entirely. I\'ll help you design it step by step.',
      },
    ]);
  }, [resetChatRequest, workspaceId]);

  return { messages, isLoading: isLoading || isResetLoading, sendMessage, resetChat } as const;
}
