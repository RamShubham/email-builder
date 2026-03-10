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

const API_BASE_URL = `${process.env.REACT_APP_AI_BASE_URL}api/`;

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

  const [, resetChatRequest] = useRequest(
    {
      method: 'post',
      url: `${API_BASE_URL}chat/reset`,
    },
    { manual: true }
  );

  const [, chatRequest] = useRequest(
    {
      method: 'post',
      // Use full URL so we can target the AI base URL while still benefiting from the axios interceptors
      url: `${API_BASE_URL}chat`,
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

    try {
      const { data } = await chatRequest({
        data: {
          message: content.trim(),
          sessionId: sessionIdRef.current,
          workspaceId,
        },
      });

      const responseType = data?.type as 'message' | 'template' | undefined;
      const rawContent: string = data?.content ?? '';
      const templateData: Record<string, any> | undefined =
        responseType === 'template' && data?.template ? data.template : undefined;

      const finalContent = stripTemplateContent(rawContent);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
              ...m,
              content: finalContent || 'Sorry, something went wrong. Please try again.',
              template: templateData,
              isStreaming: false,
            }
            : m
        )
      );
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
  }, [chatRequest, isLoading, workspaceId]);

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
        content:
          'Hey! I\'m your email builder assistant. Tell me about the email you\'d like to create — a welcome message, a newsletter, a notification, or something else entirely. I\'ll help you design it step by step.',
      },
    ]);
    setIsLoading(false);
  }, [resetChatRequest, workspaceId]);

  return { messages, isLoading, sendMessage, resetChat };
}
