import React, { useEffect, useState } from 'react';

  import { useSortable } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import { GripVertical } from 'lucide-react';

  import { useDocument } from '../../../../editor/EditorContext';

  type SortableItemProps = {
    id: string;
    children: React.ReactNode;
    isDropSuccess?: boolean;
    blockId: string;
  };

  export default function SortableItem({ id, children, isDropSuccess = false, blockId }: SortableItemProps) {
    const document = useDocument();
    const [isAnimating, setIsAnimating] = useState(false);

    const parentId = blockId.split('-column-')?.[0] || '';

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id,
      data: { type: 'block', parentType: document[parentId]?.type },
    });

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isDropSuccess) {
        setIsAnimating(true);
        timer = setTimeout(() => setIsAnimating(false), 600);
      }
      return () => clearTimeout(timer);
    }, [isDropSuccess]);

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : transition,
      opacity: isDragging ? 0.4 : 1,
      position: 'relative',
      zIndex: isDragging ? 1000 : 1,
      touchAction: 'none',
    };

    const isRte = document[id]?.type === 'Rte';

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative ${isRte ? 'min-h-[60px]' : ''}`}
      >
        {children}
        <div
          {...attributes}
          {...listeners}
          className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-blue-500/90 p-1 rounded-md shadow-sm"
          style={{ zIndex: 10 }}
        >
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }
  