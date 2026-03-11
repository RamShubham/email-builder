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
      className="h-7 w-7 rounded-xl transition-all hover:bg-gray-100/80"
    >
      {samplesDrawerOpen ? (
        <ChevronsLeft className="h-3.5 w-3.5" />
      ) : (
        <Menu className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
