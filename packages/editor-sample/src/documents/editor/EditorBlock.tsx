import React, { createContext, useContext } from 'react';

import { EditorBlock as CoreEditorBlock } from './core';
import { useDocument } from './EditorContext';

const EditorBlockContext = createContext<string | null>(null);
export const useCurrentBlockId = () => useContext(EditorBlockContext)!;

type EditorBlockProps = {
  id: string;
};

export default function EditorBlock({ id }: EditorBlockProps) {
  const document = useDocument();
  const block = document[id];

  if (!block) {
    console.warn(`[EditorBlock] Missing block id="${id}". Available blocks:`, Object.keys(document));
    return (
      <div style={{
        padding: '12px 16px',
        margin: '4px 0',
        background: '#fef2f2',
        border: '1px dashed #fca5a5',
        borderRadius: '6px',
        color: '#991b1b',
        fontSize: '13px',
        fontFamily: 'monospace',
      }}>
        ⚠ Missing block: <strong>{id}</strong>
      </div>
    );
  }
  return (
    <EditorBlockContext.Provider value={id}>
      <CoreEditorBlock {...block} />
    </EditorBlockContext.Provider>
  );
}
