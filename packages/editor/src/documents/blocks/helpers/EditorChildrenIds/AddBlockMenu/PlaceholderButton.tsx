import { Plus } from 'lucide-react';
import React from 'react';

type Props = {
  onClick: () => void;
};

export default function PlaceholderButton({ onClick }: Props) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={(ev) => {
        ev.stopPropagation();
        onClick();
      }}
      className="flex items-center justify-center h-12 w-full bg-black/5 hover:bg-black/10 transition-colors"
      data-testid="add-block-button"
    >
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
        <Plus className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
