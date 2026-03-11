import React from 'react';

import { Sparkles } from 'lucide-react';

import EditorBlock from '../../../documents/editor/EditorBlock';

function CustomEditorBlock({ mainBoxStyle }: { mainBoxStyle?: React.CSSProperties }) {
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

export default CustomEditorBlock;

interface AiPromptIslandProps {
  onActivate: (text?: string) => void;
}

export function AiPromptIsland({ onActivate }: AiPromptIslandProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value;
      onActivate(value || undefined);
      (e.target as HTMLInputElement).value = '';
    }
  };

  return (
    <div
      className="island flex-shrink-0 cursor-text"
      data-testid="prompt-island"
      onClick={() => onActivate()}
    >
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <input
            type="text"
            placeholder="Ask AI to build your email..."
            className="flex-1 bg-transparent border-0 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => onActivate()}
            data-testid="prompt-text-field"
          />
        </div>
      </div>
    </div>
  );
}
