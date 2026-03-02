import React from 'react';

import { ChevronsLeft, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  toggleSamplesDrawerOpen,
  useSamplesDrawerOpen,
} from '../../documents/editor/EditorContext';

export default function ToggleNavigatorPanelButton() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSamplesDrawerOpen}
      data-testid="navigator-panel-button"
      className="h-8 w-8 rounded-md transition-colors"
    >
      {samplesDrawerOpen ? (
        <ChevronsLeft className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  );
}
