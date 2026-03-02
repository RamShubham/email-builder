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
      <div className="flex flex-col h-full">
        <div className="flex items-center border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center px-2">
            <ToggleNavigatorPanelButton />
          </div>

          <div className="flex-1">
            <MainTabsGroup />
          </div>

          <div className="flex items-center gap-1 px-2">
            {selectedMainTab === 'editor' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedScreenSize === 'desktop' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedScreenSize('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedScreenSize === 'mobile' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedScreenSize('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
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

        <div className="flex-1 overflow-auto bg-gray-50">
          {renderMainPanel()}
        </div>
      </div>
    );
  }
  