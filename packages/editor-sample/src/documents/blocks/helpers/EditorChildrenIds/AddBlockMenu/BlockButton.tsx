import React from 'react';

  type BlockMenuButtonProps = {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };

  export default function BlockTypeButton({ label, icon, onClick }: BlockMenuButtonProps) {
    return (
      <button
        className="p-1.5 flex flex-col items-center hover:bg-gray-100 rounded-md transition-colors"
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
        data-testid={`${label.toLowerCase()}-block-button`}
      >
        <div className="w-full bg-gray-100 flex justify-center p-1 border border-gray-200 rounded mb-1">
          {icon}
        </div>
        <span className="text-xs text-gray-600">{label}</span>
      </button>
    );
  }
  