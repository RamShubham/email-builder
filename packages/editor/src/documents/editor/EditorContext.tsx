import { create } from 'zustand';

import getConfiguration from '../../getConfiguration';

import { TEditorConfiguration } from './core';

type TValue = {
        document: TEditorConfiguration;

        selectedBlockId: string | null;
        selectedSidebarTab: 'block-configuration' | 'styles' | 'data' | 'blocks';
        selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
        selectedScreenSize: 'desktop' | 'mobile';

        inspectorDrawerOpen: boolean;
        samplesDrawerOpen: boolean;
        variables: Record<string, any>;

        workspaceId: string | null;
        parentId: string | null;
        projectId: string | null;
        assetId: string | null;

        globalLoader: boolean;
        templatePanelLoader: boolean;

        activeId: string | null;
        dragOverId: string | null;
};

const editorStateStore = create<TValue>(() => ({
        document: getConfiguration(window.location.hash),
        selectedBlockId: null,
        selectedSidebarTab: 'blocks',
        selectedMainTab: 'editor',
        selectedScreenSize: 'desktop',

        inspectorDrawerOpen: true,
        samplesDrawerOpen: true,
        variables: {},

        workspaceId: null,
        parentId: null,
        projectId: null,
        assetId: null,

        globalLoader: false,
        templatePanelLoader: false,
        activeId: null,
        dragOverId: null,
}));

export function useDocument() {
        return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
        return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
        return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
        return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
        return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
        return editorStateStore((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen() {
        return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen() {
        return editorStateStore((s) => s.samplesDrawerOpen);
}
export function useVariables() {
        return editorStateStore((s) => s.variables);
}

export function useGlobalLoader() {
        return editorStateStore((s) => s.globalLoader);
}

export function useTemplatePanelLoader() {
        return editorStateStore((s) => s.templatePanelLoader);
}

export function useActiveId() {
        return editorStateStore((s) => s.activeId);
}

export function useDragOverId() {
        return editorStateStore((s) => s.dragOverId);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
        const selectedSidebarTab =
                selectedBlockId === null ? 'styles' : 'block-configuration';
        const options: Partial<TValue> = {};
        if (selectedBlockId !== null) {
                options.inspectorDrawerOpen = true;
        }
        return editorStateStore.setState({
                selectedBlockId,
                selectedSidebarTab,
                ...options,
        });
}

export function setSidebarTab(
        selectedSidebarTab: TValue['selectedSidebarTab']
) {
        return editorStateStore.setState({ selectedSidebarTab });
}

function normalizeDocument(document: TValue['document']): TValue['document'] {
        return Object.fromEntries(
                Object.entries(document).map(([id, block]) => {
                        if (
                                block.type !== 'EmailLayout' &&
                                block?.data &&
                                'props' in block.data &&
                                !('template' in block.data)
                        ) {
                                return [
                                        id,
                                        {
                                                ...block,
                                                data: {
                                                        ...block.data,
                                                        template: block.data.props,
                                                },
                                        },
                                ];
                        }
                        return [id, block];
                })
        ) as TValue['document'];
}

export function resetDocument(document: TValue['document']) {
        return editorStateStore.setState({
                document: normalizeDocument(document),
                selectedSidebarTab: 'styles',
                selectedBlockId: null,
        });
}

export function updateDocument(document: TValue['document']) {
        return editorStateStore.setState({ document });
}

export function setDocument(document: TValue['document']) {
        const originalDocument = editorStateStore.getState().document;
        return editorStateStore.setState({
                document: {
                        ...originalDocument,
                        ...document,
                },
        });
}

export function resetDocument2() {
        return editorStateStore.setState({
                document: getConfiguration(window.location.hash),
        });
}

export function toggleInspectorDrawerOpen() {
        const inspectorDrawerOpen =
                !editorStateStore.getState().inspectorDrawerOpen;
        return editorStateStore.setState({ inspectorDrawerOpen });
}

export function toggleSamplesDrawerOpen() {
        const samplesDrawerOpen = !editorStateStore.getState().samplesDrawerOpen;
        return editorStateStore.setState({ samplesDrawerOpen });
}

export function setSelectedScreenSize(
        selectedScreenSize: TValue['selectedScreenSize']
) {
        return editorStateStore.setState({ selectedScreenSize });
}

export function setVariables(variables: TValue['variables']) {
        const prevVariables = editorStateStore.getState().variables;
        return editorStateStore.setState({
                variables: { ...prevVariables, ...variables },
        });
}

export function updateVariables(variables: TValue['variables']) {
        return editorStateStore.setState({
                variables,
        });
}

export function useIds() {
        return {
                workspaceId: editorStateStore((s) => s.workspaceId),
                parentId: editorStateStore((s) => s.parentId),
                projectId: editorStateStore((s) => s.projectId),
                assetId: editorStateStore((s) => s.assetId),
        };
}

export function setIds({
        workspaceId,
        parentId,
        projectId,
        assetId,
}: Partial<
        Pick<TValue, 'workspaceId' | 'parentId' | 'projectId' | 'assetId'>
>) {
        return editorStateStore.setState({
                workspaceId: workspaceId ?? editorStateStore.getState().workspaceId,
                parentId: parentId ?? editorStateStore.getState().parentId,
                projectId: projectId ?? editorStateStore.getState().projectId,
                assetId: assetId ?? editorStateStore.getState().assetId,
        });
}

export function setGlobalLoader(globalLoader: TValue['globalLoader']) {
        return editorStateStore.setState({ globalLoader });
}

export const setTemplatePanelLoader = (
        templatePanelLoader: TValue['templatePanelLoader']
) => {
        return editorStateStore.setState({ templatePanelLoader });
};

export const resetVariables = (variables: TValue['variables']) => {
        return editorStateStore.setState({ variables });
};

export const setActiveId = (activeId: TValue['activeId']) => {
        return editorStateStore.setState({ activeId });
};

export const setDragOverId = (dragOverId: TValue['dragOverId']) => {
        return editorStateStore.setState({ dragOverId });
};
