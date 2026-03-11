import React from 'react';

import { ChevronsRight, LayoutTemplate } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  toggleInspectorDrawerOpen,
  useInspectorDrawerOpen,
} from '../../documents/editor/EditorContext';

export default function ToggleInspectorPanelButton() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleInspectorDrawerOpen}
      data-testid="inspector-panel-button"
      className="h-7 w-7 rounded-xl transition-all hover:bg-gray-100/80"
    >
      {inspectorDrawerOpen ? (
        <ChevronsRight className="h-3.5 w-3.5" />
      ) : (
        <LayoutTemplate className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
