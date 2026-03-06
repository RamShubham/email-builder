import { useCallback, useRef, useState } from 'react';

import useRequest from '../../hook/useRequest';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  template?: Record<string, any>;
  isStreaming?: boolean;
}

const API_BASE_URL = process.env.REACT_APP_AI_BASE_URL;

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
  const abortRef = useRef<AbortController | null>(null);

  const [, resetChatRequest] = useRequest(
    {
      method: 'post',
      url: `${API_BASE_URL}/chat/reset`,
    },
    { manual: true }
  );

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    };

    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '', isStreaming: true },
    ]);
    setIsLoading(true);

    abortRef.current = new AbortController();

    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          sessionId: sessionIdRef.current,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let templateData: Record<string, any> | undefined;
      let hitTemplateMarker = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === 'chunk') {
              fullContent += event.content;

              if (!hitTemplateMarker) {
                const displayContent = stripTemplateContent(fullContent);
                if (displayContent !== fullContent) {
                  hitTemplateMarker = true;
                }
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: displayContent || 'Building your template...' } : m
                  )
                );
              }
            } else if (event.type === 'done') {
              if (event.responseType === 'template' && event.template) {
                templateData = event.template;
              }
              const finalContent = event.content || stripTemplateContent(fullContent);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: finalContent, template: templateData, isStreaming: false }
                    : m
                )
              );
            } else if (event.type === 'error') {
              throw new Error(event.error);
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      if (!templateData) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.', isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [isLoading]);

  const resetChat = useCallback(async () => {
    try {
      await resetChatRequest({
        data: { sessionId: sessionIdRef.current },
      });
    } catch {
      // ignore reset errors
    }

    sessionIdRef.current = `session-${Date.now()}`;
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content:
          'Hey! I\'m your email builder assistant. Tell me about the email you\'d like to create — a welcome message, a newsletter, a notification, or something else entirely. I\'ll help you design it step by step.',
      },
    ]);
    setIsLoading(false);
  }, [resetChatRequest]);

  return { messages, isLoading, sendMessage, resetChat };
}
