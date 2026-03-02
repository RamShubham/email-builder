import React from 'react';

type SidebarPanelProps = {
  title: string;
  children: React.ReactNode;
  dataTestId?: string;
};

export default function BaseSidebarPanel({ title, children, dataTestId }: SidebarPanelProps) {
  return (
    <div className="p-4" data-testid={dataTestId}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">{title}</p>
      <div className="flex flex-col gap-4 mb-4">{children}</div>
    </div>
  );
}
