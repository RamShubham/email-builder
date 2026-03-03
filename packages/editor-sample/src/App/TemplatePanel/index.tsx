import React, { useState, useCallback, useEffect, useRef } from 'react';

import { Monitor, Smartphone } from 'lucide-react';
import { Reader } from '@usewaypoint/email-builder';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  resetDocument,
  resetVariables,
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import getGlobalVariables from '../../utils/getGlobalVariables';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import AiChatOverlay from '../AiChat/AiChatOverlay';
import { useAiChat } from '../AiChat/useAiChat';

import CustomEditorBlock, { AiPromptIsland } from './CustomEditorBlock';
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  const [chatOpen, setChatOpen] = useState(false);
  const pendingMessage = useRef<string | undefined>();
  const { messages, isLoading, sendMessage, resetChat } = useAiChat();

  const handleActivateChat = useCallback((text?: string) => {
    if (text) {
      pendingMessage.current = text;
    }
    setChatOpen(true);
  }, []);

  useEffect(() => {
    if (chatOpen && pendingMessage.current) {
      const msg = pendingMessage.current;
      pendingMessage.current = undefined;
      sendMessage(msg);
    }
  }, [chatOpen, sendMessage]);

  const handleApplyTemplate = useCallback((template: Record<string, any>) => {
    resetDocument(template as any);
    const globalVariables = getGlobalVariables({ document: template as any });
    resetVariables(globalVariables);
  }, []);

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
    <div className="flex flex-col h-full gap-2.5">
      <div className="island flex flex-col flex-1 min-h-0 overflow-hidden relative">
        <div className="flex items-center px-2 py-1.5 flex-shrink-0">
          <div className="flex-1 flex items-center px-1">
            <MainTabsGroup />
          </div>

          <div className="flex items-center gap-1 px-1">
            {selectedMainTab === 'editor' && (
              <div className="flex items-center bg-gray-100/80 rounded-xl p-0.5 gap-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`h-7 w-7 flex items-center justify-center rounded-[10px] transition-all ${
                        selectedScreenSize === 'desktop'
                          ? 'bg-white shadow-sm text-gray-700'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      onClick={() => setSelectedScreenSize('desktop')}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`h-7 w-7 flex items-center justify-center rounded-[10px] transition-all ${
                        selectedScreenSize === 'mobile'
                          ? 'bg-white shadow-sm text-gray-700'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      onClick={() => setSelectedScreenSize('mobile')}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile</TooltipContent>
                </Tooltip>
              </div>
            )}
            <ImportJson />
            <DownloadJson />
            <ToggleInspectorPanelButton />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100/60 rounded-b-[1rem] mx-[1px] mb-[1px]">
          {renderMainPanel()}
        </div>

        <AiChatOverlay
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          onApplyTemplate={handleApplyTemplate}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onResetChat={resetChat}
        />
      </div>

      {selectedMainTab === 'editor' && !chatOpen && <AiPromptIsland onActivate={handleActivateChat} />}
    </div>
  );
}
