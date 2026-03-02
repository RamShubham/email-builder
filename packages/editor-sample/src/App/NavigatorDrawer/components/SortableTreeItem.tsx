import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, GripVertical } from 'lucide-react';

import { cn } from '../../../lib/utils';
import BLOCK_ICON_MAPPING from '../../../constant/blockIcon';

type SortableTreeItemProps = {
  item: {
    id: string;
    type: string;
    children: any[];
  };
  level: number;
  handleBlockClick: (id: string) => void;
  toggleExpanded: (id: string) => void;
  isExpanded: boolean;
};

function SortableTreeItem({
  item,
  level,
  handleBlockClick,
  toggleExpanded,
  isExpanded,
}: SortableTreeItemProps) {
  const hasChildren = item.children.length > 0;
  const isColumn = item.id.includes('column');

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({ id: item.id });

  const handleClick = () => {
    if (!isColumn) {
      handleBlockClick(item.id);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          'flex items-center gap-1 py-1 pr-2 cursor-pointer text-sm rounded-sm transition-colors',
          !isColumn && 'hover:bg-accent group'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center min-w-[36px]">
          {hasChildren ? (
            <button
              className="p-0.5 mr-0.5 rounded hover:bg-blue-50 transition-all"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
            >
              <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <span className="text-gray-500 flex items-center">
            {BLOCK_ICON_MAPPING[item.type]}
          </span>
        </div>

        <span
          className={cn(
            'flex-1 truncate text-xs',
            !isColumn && 'text-gray-700',
            isColumn && 'text-gray-400'
          )}
        >
          {item.type}
        </span>

        {!isColumn && (
          <GripVertical
            className={cn(
              'h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            {...attributes}
            {...listeners}
          />
        )}
      </div>
    </div>
  );
}

export default SortableTreeItem;
