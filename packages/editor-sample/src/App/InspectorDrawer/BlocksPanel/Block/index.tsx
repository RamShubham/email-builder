import { useDraggable } from '@dnd-kit/core';

import { TEditorBlock } from '../../../../documents/editor/core';

function Block({
  icon,
  label,
  block,
}: {
  icon: React.ReactNode;
  label: string;
  block: () => TEditorBlock;
}) {
  const { setNodeRef, attributes, listeners } = useDraggable({
    id: `inspect-block-${label}`,
    data: { type: 'blockElement', block: block() },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center m-1 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="w-full bg-gray-100 flex justify-center p-2 border border-gray-200 rounded-md mb-1.5 hover:bg-gray-200 transition-colors">
        {icon}
      </div>
      <span className="text-xs text-gray-600 text-center leading-tight">{label}</span>
    </div>
  );
}

export default Block;
