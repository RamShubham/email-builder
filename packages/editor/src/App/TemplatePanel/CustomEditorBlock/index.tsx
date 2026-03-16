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
  chatOpen?: boolean;
}

export function AiPromptIsland({ onActivate, chatOpen }: AiPromptIslandProps) {
  return (
    <div
      className={`flex-shrink-0 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2 cursor-text hover:border-violet-300 hover:bg-white transition-all duration-200 ${
        chatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transition: 'opacity 150ms ease, border-color 200ms, background-color 200ms' }}
      data-testid="prompt-island"
      onClick={() => onActivate()}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-0.5">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <input
        type="text"
        placeholder="Ask AI to build your email…"
        className="flex-1 bg-transparent border-0 text-[13.5px] text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed"
        onClick={(e) => e.stopPropagation()}
        onFocus={() => onActivate()}
        data-testid="prompt-text-field"
      />
    </div>
  );
}
