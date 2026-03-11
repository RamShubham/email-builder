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
      <div className="w-full bg-gray-100 border border-gray-200/60 flex justify-center p-3 rounded-xl mb-1.5 group-hover:bg-gray-200/80 group-hover:border-gray-300/60 group-hover:shadow-sm transition-all duration-150">
        {icon}
      </div>
      <span className="text-[11px] text-gray-500 text-center leading-tight font-medium">{label}</span>
    </div>
  );
}

export default Block;
