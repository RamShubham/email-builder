import { useEffect, useRef, useCallback } from 'react';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import {
  resetDocument,
  setSelectedMainTab,
  setVariables,
  useDocument,
} from '../documents/editor/EditorContext';

let parentOrigin: string | null = null;

function postToHost(message: any) {
  if (window.parent !== window) {
    const target = parentOrigin || '*';
    window.parent.postMessage(message, target);
  }
}

function applyVariablesToJson(templateJson: any, variables: Record<string, string>): any {
  if (!variables || Object.keys(variables).length === 0) return templateJson;
  const jsonStr = JSON.stringify(templateJson);
  const replaced = jsonStr.replace(/\{\{(.*?)\}\}/g, (_, varName) =>
    variables[varName] !== undefined ? variables[varName] : `{{${varName}}}`
  );
  return JSON.parse(replaced);
}

export function usePostMessage(
  setTheme?: (theme: 'light' | 'dark') => void,
) {
  const documentRef = useRef<any>(null);
  const document = useDocument();

  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  const prevDocRef = useRef<string>('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentJson = JSON.stringify(document);
    if (prevDocRef.current && prevDocRef.current !== currentJson) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        postToHost({
          type: 'TINY_EMAIL_TEMPLATE_CHANGED',
          template: document,
          changeType: 'block_updated',
        });
      }, 500);
    }
    prevDocRef.current = currentJson;
  }, [document]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.source !== window.parent) return;

    const { data } = event;
    if (!data || !data.type || !data.type.startsWith('TINY_EMAIL_')) return;

    if (!parentOrigin && event.origin) {
      parentOrigin = event.origin;
    }

    try {
      switch (data.type) {
        case 'TINY_EMAIL_LOAD_TEMPLATE': {
          resetDocument(data.template);
          postToHost({
            type: 'TINY_EMAIL_TEMPLATE_LOADED',
            requestId: data.requestId,
            blockCount: Object.keys(data.template).length - 1,
          });
          break;
        }

        case 'TINY_EMAIL_GET_TEMPLATE': {
          postToHost({
            type: 'TINY_EMAIL_TEMPLATE_RESPONSE',
            requestId: data.requestId,
            template: documentRef.current,
          });
          break;
        }

        case 'TINY_EMAIL_GET_HTML': {
          const doc = documentRef.current;
          const substituted = data.variables
            ? applyVariablesToJson(doc, data.variables)
            : doc;
          const html = renderToStaticMarkup(substituted, { rootBlockId: 'root' });
          postToHost({
            type: 'TINY_EMAIL_HTML_RESPONSE',
            requestId: data.requestId,
            html,
          });
          break;
        }

        case 'TINY_EMAIL_SET_VARIABLES': {
          setVariables(data.variables);
          break;
        }

        case 'TINY_EMAIL_SET_THEME': {
          if (setTheme) setTheme(data.theme);
          break;
        }

        case 'TINY_EMAIL_SET_MODE': {
          const modeMap: Record<string, string> = {
            edit: 'editor',
            preview: 'preview',
            json: 'json',
          };
          const tab = modeMap[data.mode] || 'editor';
          setSelectedMainTab(tab as any);
          break;
        }

        default:
          break;
      }
    } catch (err: any) {
      postToHost({
        type: 'TINY_EMAIL_ERROR',
        requestId: data.requestId,
        error: err.message || 'Unknown error',
      });
    }
  }, [setTheme]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    const readyTimeout = setTimeout(() => {
      postToHost({ type: 'TINY_EMAIL_EDITOR_READY' });
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(readyTimeout);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [handleMessage]);
}
