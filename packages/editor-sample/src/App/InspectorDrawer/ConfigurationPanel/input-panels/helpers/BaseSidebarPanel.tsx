import React from 'react';

  type SidebarPanelProps = {
    title: string;
    children: React.ReactNode;
    dataTestId?: string;
  };

  export default function BaseSidebarPanel({ title, children, dataTestId }: SidebarPanelProps) {
    return (
      <div className="p-4" data-testid={dataTestId}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">{title}</p>
        <div className="flex flex-col gap-5 mb-4">{children}</div>
      </div>
    );
  }
  