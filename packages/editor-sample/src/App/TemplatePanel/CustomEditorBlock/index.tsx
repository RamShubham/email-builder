import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import EditorBlock from '../../../documents/editor/EditorBlock';

import useTemplate from './useTemplate';

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

export function AiPromptIsland() {
  const { loading: templateLoading, prompt, setPrompt, onSubmitHandler } =
    useTemplate();

  return (
    <div className="island flex-shrink-0" data-testid="prompt-island">
      <div className="p-3" data-testid="prompt-field-container">
        <div className="relative">
          <textarea
            placeholder="Describe your email template or enter a prompt for AI to generate..."
            value={prompt}
            rows={2}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmitHandler();
              }
            }}
            className="w-full resize-none rounded-xl border-0 bg-gray-50/80 px-4 py-3 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            data-testid="prompt-text-field"
          />
          <Button
            size="icon"
            variant="ghost"
            disabled={templateLoading || isEmpty(prompt)}
            onClick={onSubmitHandler}
            className="absolute right-2 bottom-2 h-8 w-8 rounded-xl hover:bg-gray-200/60"
            data-testid="prompt-submit-icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
