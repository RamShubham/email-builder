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
      className="h-8 w-8 rounded-md transition-colors"
    >
      {inspectorDrawerOpen ? (
        <ChevronsRight className="h-4 w-4" />
      ) : (
        <LayoutTemplate className="h-4 w-4" />
      )}
    </Button>
  );
}
