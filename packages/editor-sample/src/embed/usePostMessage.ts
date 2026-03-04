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

function collectReferencedIds(template: any): string[] {
  const refs: string[] = [];
  for (const [id, block] of Object.entries(template)) {
    const b = block as any;
    if (b?.data?.childrenIds) {
      refs.push(...b.data.childrenIds);
    }
    if (b?.data?.props?.childrenIds) {
      refs.push(...b.data.props.childrenIds);
    }
    if (b?.data?.props?.columns) {
      for (const col of b.data.props.columns) {
        if (col?.childrenIds) {
          refs.push(...col.childrenIds);
        }
      }
    }
  }
  return refs;
}

function validateAndFixTemplate(template: any): { fixed: any; warnings: string[] } {
  const warnings: string[] = [];
  const blockIds = new Set(Object.keys(template));
  const referenced = collectReferencedIds(template);

  const missing = referenced.filter(id => !blockIds.has(id));
  if (missing.length > 0) {
    warnings.push(`Missing block IDs referenced in template: ${missing.join(', ')}`);
  }

  if (missing.length === 0) {
    return { fixed: template, warnings };
  }

  const missingSet = new Set(missing);
  const fixed = JSON.parse(JSON.stringify(template));

  for (const [id, block] of Object.entries(fixed)) {
    const b = block as any;
    if (b?.data?.childrenIds) {
      b.data.childrenIds = b.data.childrenIds.filter((cid: string) => !missingSet.has(cid));
    }
    if (b?.data?.props?.childrenIds) {
      b.data.props.childrenIds = b.data.props.childrenIds.filter((cid: string) => !missingSet.has(cid));
    }
    if (b?.data?.props?.columns) {
      for (const col of b.data.props.columns) {
        if (col?.childrenIds) {
          col.childrenIds = col.childrenIds.filter((cid: string) => !missingSet.has(cid));
        }
      }
    }
  }

  return { fixed, warnings };
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

    console.log(`[PostMessage] Received: ${data.type}`, {
      origin: event.origin,
      requestId: data.requestId,
      hasTemplate: !!data.template,
      hasVariables: !!data.variables,
      mode: data.mode,
      theme: data.theme,
    });

    try {
      switch (data.type) {
        case 'TINY_EMAIL_LOAD_TEMPLATE': {
          console.log('[PostMessage] LOAD_TEMPLATE payload:', {
            blockIds: data.template ? Object.keys(data.template) : 'NO TEMPLATE',
            blockCount: data.template ? Object.keys(data.template).length : 0,
            rootType: data.template?.root?.type,
            rootChildrenIds: data.template?.root?.data?.childrenIds,
          });
          console.log('[PostMessage] Full template JSON:', JSON.stringify(data.template, null, 2));

          if (!data.template || typeof data.template !== 'object') {
            console.error('[PostMessage] LOAD_TEMPLATE received invalid template:', data.template);
            postToHost({
              type: 'TINY_EMAIL_ERROR',
              requestId: data.requestId,
              error: 'Invalid template: expected an object with block definitions',
            });
            break;
          }

          if (!data.template.root) {
            console.error('[PostMessage] LOAD_TEMPLATE missing root block. Keys:', Object.keys(data.template));
            postToHost({
              type: 'TINY_EMAIL_ERROR',
              requestId: data.requestId,
              error: 'Invalid template: missing "root" block',
            });
            break;
          }

          const { fixed, warnings } = validateAndFixTemplate(data.template);
          for (const w of warnings) {
            console.warn(`[PostMessage] Template validation: ${w}`);
          }

          resetDocument(fixed);
          postToHost({
            type: 'TINY_EMAIL_TEMPLATE_LOADED',
            requestId: data.requestId,
            blockCount: Object.keys(fixed).length - 1,
            warnings: warnings.length > 0 ? warnings : undefined,
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
          console.log('[PostMessage] SET_VARIABLES:', data.variables);
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
          console.log(`[PostMessage] Unhandled message type: ${data.type}`);
          break;
      }
    } catch (err: any) {
      console.error(`[PostMessage] Error handling ${data.type}:`, err);
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
      console.log('[PostMessage] Sending EDITOR_READY');
      postToHost({ type: 'TINY_EMAIL_EDITOR_READY' });
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(readyTimeout);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [handleMessage]);
}
