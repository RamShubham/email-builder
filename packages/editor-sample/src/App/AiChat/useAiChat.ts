import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  template?: Record<string, any>;
  isStreaming?: boolean;
}

const API_BASE = '/api';

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: "Hey! I'm your email builder assistant. Tell me about the email you'd like to create — a welcome message, a newsletter, a notification, or something else entirely. I'll help you design it step by step.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(`session-${Date.now()}`);
  const abortRef = useRef<AbortController | null>(null);

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
      const response = await fetch(`${API_BASE}/chat/stream`, {
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
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullContent } : m
                )
              );
            } else if (event.type === 'done') {
              if (event.responseType === 'template' && event.template) {
                templateData = event.template;
              }
              const finalContent = event.content || fullContent;
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
            ? { ...m, content: "Sorry, something went wrong. Please try again.", isStreaming: false }
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
      await fetch(`${API_BASE}/chat/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      });
    } catch {}

    sessionIdRef.current = `session-${Date.now()}`;
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: "Hey! I'm your email builder assistant. Tell me about the email you'd like to create — a welcome message, a newsletter, a notification, or something else entirely. I'll help you design it step by step.",
      },
    ]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
}
