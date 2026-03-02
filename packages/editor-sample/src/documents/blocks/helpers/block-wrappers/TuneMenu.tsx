import cloneDeep from 'lodash/cloneDeep';
  import React from 'react';

  import { Copy, Trash2 } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
  import generateId from '../../../../utils/generateId';
  import { TEditorBlock } from '../../../editor/core';
  import {
    resetDocument,
    setSelectedBlockId,
    useDocument,
  } from '../../../editor/EditorContext';
  import { ColumnsContainerProps } from '../../ColumnsContainer/ColumnsContainerPropsSchema';

  type Props = {
    blockId: string;
  };

  export default function TuneMenu({ blockId }: Props) {
    const document = useDocument();

    const handleDeleteClick = () => {
      const filterChildrenIds = (childrenIds: string[] | null | undefined) => {
        if (!childrenIds) return childrenIds;
        return childrenIds.filter((f) => f !== blockId);
      };

      const nDocument: typeof document = { ...document };

      for (const [id, b] of Object.entries(nDocument)) {
        const block = b as TEditorBlock;
        if (id === blockId) continue;
        switch (block.type) {
          case 'EmailLayout':
            nDocument[id] = {
              ...block,
              data: { ...block.data, childrenIds: filterChildrenIds(block.data.childrenIds) },
            };
            break;
          case 'Container':
            nDocument[id] = {
              ...block,
              data: {
                ...block.data,
                props: { ...block.data.props, childrenIds: filterChildrenIds(block.data.props?.childrenIds) },
              },
            };
            break;
          case 'ColumnsContainer': {
            const cols = (block as TEditorBlock & { data: ColumnsContainerProps }).data.columns;
            if (!cols) break;
            nDocument[id] = {
              ...block,
              data: {
                ...block.data,
                columns: cols.map((col: any) => ({
                  ...col,
                  childrenIds: filterChildrenIds(col.childrenIds),
                })),
              },
            };
            break;
          }
        }
      }

      delete nDocument[blockId];
      resetDocument(nDocument);
      setSelectedBlockId(null);
    };

    const handleDuplicateClick = () => {
      const newBlockId = generateId();
      const nDocument = cloneDeep(document);
      nDocument[newBlockId] = cloneDeep(document[blockId]);

      const childrenIds = nDocument.root.data.childrenIds ?? [];
      const currBlockIndex = childrenIds.indexOf(blockId);
      childrenIds.splice(currBlockIndex + 1, 0, newBlockId);
      nDocument.root.data.childrenIds = childrenIds;

      resetDocument(nDocument);
      setSelectedBlockId(newBlockId);
    };

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: -56,
          borderRadius: 64,
          paddingInline: 4,
          paddingBlock: 8,
          zIndex: 1200,
          backgroundColor: '#2196F3',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        onClick={(ev) => ev.stopPropagation()}
        data-testid="tune-menu"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDuplicateClick}
              className="h-8 w-8 text-white hover:bg-blue-400 hover:text-white"
              data-testid="duplicate-button"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Duplicate</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDeleteClick}
              className="h-8 w-8 text-white hover:bg-blue-400 hover:text-white"
              data-testid="delete-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Delete</TooltipContent>
        </Tooltip>
      </div>
    );
  }
  