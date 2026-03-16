import React from 'react';
import EditorBlock from '../../../documents/editor/EditorBlock';

export default function CustomEditorBlock({ mainBoxStyle }: { mainBoxStyle?: React.CSSProperties }) {
  return (
    <div className="flex flex-col h-full" data-testid="editor-tab-content">
      <div className="flex-1 overflow-auto">
        <div style={mainBoxStyle} data-testid="editor-container">
          <EditorBlock id="root" />
        </div>
      </div>
    </div>
  );
}
