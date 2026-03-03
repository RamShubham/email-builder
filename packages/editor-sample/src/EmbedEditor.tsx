import React, { useEffect, useState } from 'react';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  Modifier,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import {
  setDocument,
  setSelectedMainTab,
  toggleInspectorDrawerOpen,
  useDocument,
  useInspectorDrawerOpen,
  useVariables,
} from './documents/editor/EditorContext';
import { replaceTemplateVariables } from './utils/replaceTemplateVariables';
import { usePostMessage } from './embed/usePostMessage';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './App/InspectorDrawer';
import TemplatePanel from './App/TemplatePanel';

const ISLAND_GAP = 10;

const conditionalModifiers: Modifier = (args) => {
  const { active, over } = args;
  const { id, data } = active || {};
  const activeParentType = data?.current?.parentType;
  const overParentType = over?.data?.current?.parentType;

  if (
    typeof id === 'string' &&
    id.startsWith('block-') &&
    ![activeParentType, overParentType].includes('ColumnsContainer')
  ) {
    return restrictToVerticalAxis({ ...args, transform: restrictToWindowEdges(args) });
  }
  return restrictToWindowEdges(args);
};

export default function EmbedEditor() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const globalVariables = useVariables();
  const document = useDocument();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  usePostMessage(setTheme);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const mode = params.get('mode');
    if (mode === 'preview') setSelectedMainTab('preview');
    else if (mode === 'json') setSelectedMainTab('json');

    const hideInspector = params.get('hideInspector');
    if (hideInspector === 'true' && inspectorDrawerOpen) {
      toggleInspectorDrawerOpen();
    }

    const themeParam = params.get('theme');
    if (themeParam === 'dark') setTheme('dark');
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    if (Object.keys(globalVariables).length > 0) {
      const updatedDocument = Object.entries(document).reduce(
        (acc, [blockId, { data, type }]) => {
          if (!data) { acc[blockId] = { data: { props: {}, template: {} }, type }; return acc; }
          const { props, template } = data || {};
          if (!props || !template) { acc[blockId] = { data, type }; return acc; }
          const updatedProps = replaceTemplateVariables(template, globalVariables);
          acc[blockId] = { type, data: { ...data, props: updatedProps } };
          return acc;
        },
        {} as Record<string, any>
      );
      setDocument(updatedDocument);
    }
  }, [globalVariables]);

  useEffect(() => {
    if (theme === 'dark') {
      window.document.documentElement.classList.add('dark');
    } else {
      window.document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden p-2.5 gap-2.5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[conditionalModifiers]}
      >
        <div className="relative flex-1 min-h-0">
          <InspectorDrawer />
          <div
            className="h-full transition-all duration-200"
            style={{
              marginRight: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH + ISLAND_GAP : 0,
            }}
          >
            <TemplatePanel />
          </div>
        </div>
      </DndContext>
    </div>
  );
}
