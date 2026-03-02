import React from 'react';

import { Monitor, Smartphone } from 'lucide-react';
import { Reader } from '@usewaypoint/email-builder';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleNavigatorPanelButton from '../NavigatorDrawer/ToggleNavigatorPanelButton';

import CustomEditorBlock from './CustomEditorBlock';
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  const renderMainPanel = () => {
    const boxStyle: React.CSSProperties =
      selectedScreenSize === 'mobile'
        ? { maxWidth: 400, margin: '0 auto' }
        : {};

    switch (selectedMainTab) {
      case 'editor':
        return <CustomEditorBlock mainBoxStyle={boxStyle} />;
      case 'preview':
        return (
          <div style={boxStyle}>
            <Reader document={document as any} rootBlockId="root" />
          </div>
        );
      case 'html':
        return <HtmlPanel />;
      case 'json':
        return <JsonPanel />;
    }
  };

  return (
    <div className="island flex flex-col h-full overflow-hidden">
      <div className="flex items-center border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center px-1.5">
          <ToggleNavigatorPanelButton />
        </div>

        <div className="flex-1">
          <MainTabsGroup />
        </div>

        <div className="flex items-center gap-0.5 px-2">
          {selectedMainTab === 'editor' && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedScreenSize === 'desktop' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setSelectedScreenSize('desktop')}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedScreenSize === 'mobile' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setSelectedScreenSize('mobile')}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile</TooltipContent>
              </Tooltip>
            </>
          )}
          <ImportJson />
          <DownloadJson />
          <ToggleInspectorPanelButton />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50/50 rounded-b-xl">
        {renderMainPanel()}
      </div>
    </div>
  );
}
