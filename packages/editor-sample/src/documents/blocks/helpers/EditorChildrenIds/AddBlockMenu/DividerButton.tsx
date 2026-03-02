import React from 'react';

  import { Plus } from 'lucide-react';

  type Props = {
    onClick: () => void;
  };

  export default function DividerButton({ onClick }: Props) {
    return (
      <button
        className="absolute top-[-12px] left-1/2 -translate-x-1/2 z-50 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
        data-testid="add-block-button"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    );
  }
  