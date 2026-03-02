import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EditorBlock from '../../../documents/editor/EditorBlock';

import useTemplate from './useTemplate';

function CustomEditorBlock({ mainBoxStyle }: { mainBoxStyle?: React.CSSProperties }) {
  const { loading: templateLoading, prompt, setPrompt, onSubmitHandler } = useTemplate();

  return (
    <div className="flex flex-col h-full" data-testid="editor-tab-content">
      <div className="flex-1 overflow-auto">
        <div style={mainBoxStyle} data-testid="editor-container">
          <EditorBlock id="root" />
        </div>
      </div>

      <div className="border-t border-gray-100 p-3">
        <div className="relative" data-testid="prompt-field-container">
          <Textarea
            placeholder="Describe your email template or enter a prompt for AI to generate..."
            value={prompt}
            rows={3}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmitHandler();
              }
            }}
            className="resize-none pr-12 text-sm"
            data-testid="prompt-text-field"
          />
          <Button
            size="icon"
            variant="ghost"
            disabled={templateLoading || isEmpty(prompt)}
            onClick={onSubmitHandler}
            className="absolute right-2 bottom-2 h-8 w-8"
            data-testid="prompt-submit-icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CustomEditorBlock;
