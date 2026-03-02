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
      className="flex flex-col items-center cursor-grab active:cursor-grabbing select-none group"
    >
      <div className="w-full bg-gray-50 flex justify-center p-2.5 border border-gray-100 rounded-lg mb-1.5 group-hover:bg-gray-100 group-hover:border-gray-200 group-hover:shadow-sm transition-all duration-150">
        {icon}
      </div>
      <span className="text-[11px] text-gray-500 text-center leading-tight font-medium">{label}</span>
    </div>
  );
}

export default Block;
