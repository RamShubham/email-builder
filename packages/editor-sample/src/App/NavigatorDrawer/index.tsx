import React from 'react';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import BlockTree from './components/BlockTree';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import useNavigatorDrawer from './hooks/useNavigatorDrawer';

export const NAVIGATOR_DRAWER_WIDTH = 240;

export default function NavigatorDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();

  const {
    document,
    toggleExpanded,
    handleBlockClick,
    blockTree,
    expandedBlocks,
  } = useNavigatorDrawer();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const { handleDragStart, handleDragEnd } = useDragAndDrop({
    document,
    blockTree,
  });

  return (
    <aside
      className="island absolute left-0 top-0 h-full flex flex-col overflow-hidden transition-all duration-200 z-10"
      style={{
        width: samplesDrawerOpen ? NAVIGATOR_DRAWER_WIDTH : 0,
      }}
      data-testid="navigator-panel"
    >
      <div className="flex flex-col h-full overflow-hidden" style={{ width: NAVIGATOR_DRAWER_WIDTH }}>
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <h2 className="text-[13px] font-semibold text-gray-800 tracking-tight">Navigator</h2>
          <p className="text-[11px] text-gray-400 mt-1">
            Drag and drop to move blocks.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <ul className="list-none p-0 m-0 py-1">
              {blockTree && (
                <BlockTree
                  items={blockTree.children}
                  handleBlockClick={handleBlockClick}
                  toggleExpanded={toggleExpanded}
                  expandedBlocks={expandedBlocks}
                />
              )}
            </ul>
          </DndContext>
        </div>
      </div>
    </aside>
  );
}
