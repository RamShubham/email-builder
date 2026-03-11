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
    return null;
  }
  return (
    <EditorBlockContext.Provider value={id}>
      <CoreEditorBlock {...block} />
    </EditorBlockContext.Provider>
  );
}
