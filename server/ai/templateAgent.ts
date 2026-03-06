import OpenAI from 'openai';

import { SYSTEM_PROMPT } from './systemPrompt.js';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentResponse {
  type: 'message' | 'template';
  content: string;
  template?: Record<string, any>;
}

const MAX_SESSIONS = 100;
const SESSION_TTL = 30 * 60 * 1000;
const MAX_HISTORY = 40;

interface Session {
  messages: ChatMessage[];
  lastAccess: number;
}

const sessions = new Map<string, Session>();

function cleanupSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastAccess > SESSION_TTL) {
      sessions.delete(id);
    }
  }
  if (sessions.size > MAX_SESSIONS) {
    const sorted = [...sessions.entries()].sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const toRemove = sorted.slice(0, sessions.size - MAX_SESSIONS);
    for (const [id] of toRemove) {
      sessions.delete(id);
    }
  }
}

function getOrCreateSession(sessionId: string): ChatMessage[] {
  cleanupSessions();
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { messages: [], lastAccess: Date.now() });
  }
  const session = sessions.get(sessionId)!;
  session.lastAccess = Date.now();
  return session.messages;
}

export function resetSession(sessionId: string): void {
  sessions.delete(sessionId);
}

function trimHistory(history: ChatMessage[]) {
  if (history.length > MAX_HISTORY) {
    const excess = history.length - MAX_HISTORY;
    history.splice(0, excess);
  }
}

function extractTemplate(text: string): { content: string; template: Record<string, any> | null } {
  const startMarker = '|||TEMPLATE_START|||';
  const endMarker = '|||TEMPLATE_END|||';

  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    return { content: text, template: null };
  }

  const jsonStr = text.substring(startIdx + startMarker.length, endIdx).trim();
  const contentBefore = text.substring(0, startIdx).trim();
  const contentAfter = text.substring(endIdx + endMarker.length).trim();
  const content = [contentBefore, contentAfter].filter(Boolean).join('\n\n');

  try {
    const template = JSON.parse(jsonStr);
    return { content: content || 'Here\'s your template! Click \'Apply to canvas\' to load it into the editor.', template };
  } catch (e) {
    return { content: text, template: null };
  }
}

export async function chat(sessionId: string, userMessage: string): Promise<AgentResponse> {
  const history = getOrCreateSession(sessionId);

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages,
    max_tokens: 8192,
    temperature: 0.7,
  });

  const assistantMessage = response.choices[0]?.message?.content || '';

  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: assistantMessage });
  trimHistory(history);

  const { content, template } = extractTemplate(assistantMessage);

  if (template) {
    return { type: 'template', content, template };
  }

  return { type: 'message', content };
}

export async function chatStream(
  sessionId: string,
  userMessage: string,
  onChunk: (chunk: string) => void
): Promise<AgentResponse> {
  const history = getOrCreateSession(sessionId);

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const stream = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages,
    max_tokens: 8192,
    temperature: 0.7,
    stream: true,
  });

  let fullResponse = '';

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullResponse += content;
      onChunk(content);
    }
  }

  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: fullResponse });
  trimHistory(history);

  const { content, template } = extractTemplate(fullResponse);

  if (template) {
    return { type: 'template', content, template };
  }

  return { type: 'message', content: fullResponse };
}
