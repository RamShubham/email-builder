import React from 'react';

import { Code, Edit, Eye, FileJson } from 'lucide-react';

import {
  setSelectedMainTab,
  useSelectedMainTab,
} from '../../documents/editor/EditorContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TABS = [
  { value: 'editor', icon: Edit, label: 'Edit', testId: 'editor-tab' },
  { value: 'preview', icon: Eye, label: 'Preview', testId: 'preview-tab' },
  { value: 'html', icon: Code, label: 'HTML output', testId: 'html-tab' },
  { value: 'json', icon: FileJson, label: 'JSON output', testId: 'json-tab' },
] as const;

export default function MainTabsGroup() {
  const selectedMainTab = useSelectedMainTab();

  return (
    <div className="flex gap-0.5 px-1 py-1.5">
      {TABS.map(({ value, icon: Icon, label, testId }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSelectedMainTab(value)}
              data-testid={testId}
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
                selectedMainTab === value
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
