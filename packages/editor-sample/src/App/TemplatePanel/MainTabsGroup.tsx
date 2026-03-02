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
      <div className="flex">
        {TABS.map(({ value, icon: Icon, label, testId }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSelectedMainTab(value)}
                data-testid={testId}
                className={`h-12 w-12 flex items-center justify-center transition-all hover:bg-gray-100 ${
                  selectedMainTab === value
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }
  