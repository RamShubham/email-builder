import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  setSidebarTab,
  useInspectorDrawerOpen,
  useSelectedSidebarTab,
} from '../../documents/editor/EditorContext';

import BlocksPanel from './BlocksPanel';
import ConfigurationPanel from './ConfigurationPanel';
import DataPanel from './DataPanel';
import StylesPanel from './StylesPanel';

export const INSPECTOR_DRAWER_WIDTH = 320;

export default function InspectorDrawer() {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'styles':
        return <StylesPanel />;
      case 'data':
        return <DataPanel />;
      case 'blocks':
        return <BlocksPanel />;
    }
  };

  return (
    <aside
      className="island absolute right-0 top-0 h-full flex flex-col overflow-hidden transition-all duration-200 z-10"
      style={{
        width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
      }}
      data-testid="inspector-panel"
    >
      <div className="flex flex-col h-full overflow-hidden" style={{ width: INSPECTOR_DRAWER_WIDTH }}>
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <Tabs
            value={selectedSidebarTab}
            onValueChange={(v) => setSidebarTab(v as any)}
          >
            <TabsList className="h-10 bg-gray-100/80 rounded-xl p-0.5 gap-0.5 w-full">
              <TabsTrigger
                value="blocks"
                className="flex-1 rounded-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm h-full text-xs font-medium"
                data-testid="blocks-panel-tab"
              >
                Blocks
              </TabsTrigger>
              <TabsTrigger
                value="styles"
                className="flex-1 rounded-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm h-full text-xs font-medium"
                data-testid="styles-panel-tab"
              >
                Styles
              </TabsTrigger>
              <TabsTrigger
                value="block-configuration"
                className="flex-1 rounded-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm h-full text-xs font-medium"
                data-testid="inspect-panel-tab"
              >
                Inspect
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="flex-1 rounded-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm h-full text-xs font-medium"
                data-testid="data-panel-tab"
              >
                Data
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderCurrentSidebarPanel()}
        </div>
      </div>
    </aside>
  );
}
