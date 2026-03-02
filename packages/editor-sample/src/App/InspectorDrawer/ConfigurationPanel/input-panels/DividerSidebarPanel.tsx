import React, { useState } from 'react';
  import { z as Zod } from 'zod';

  import {
    DividerProps,
    DividerPropsDefaults,
    DividerPropsSchema,
  } from '@usewaypoint/block-divider';

  import { Input } from '@/components/ui/input';
  import BaseSidebarPanel from './helpers/BaseSidebarPanel';
  import ColorInput from './helpers/inputs/ColorInput';
  import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

  type DividerSidebarPanelProps = {
    data: DividerProps;
    setData: (v: DividerProps) => void;
  };

  export default function DividerSidebarPanel({ data, setData }: DividerSidebarPanelProps) {
    const [, setErrors] = useState<unknown>(null);
    const updateData = (d: unknown) => {
      const res = DividerPropsSchema.safeParse(d);
      if (res.success) { setData(res.data); setErrors(null); }
      else setErrors(res.error);
    };

    const lineColor = data.props?.lineColor ?? DividerPropsDefaults.lineColor;
    const lineHeight = data.props?.lineHeight ?? DividerPropsDefaults.lineHeight;

    return (
      <BaseSidebarPanel title="Divider block" dataTestId="divider-inspect-panel">
        <ColorInput
          label="Color"
          defaultValue={lineColor}
          onChange={(lineColor) => updateData({ ...data, props: { ...data.props, lineColor } })}
          dataTestId="inspect-panel-divider-color"
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Height</label>
          <div className="relative flex items-center">
            <Input
              type="number"
              min={1}
              max={24}
              defaultValue={lineHeight ?? 0}
              onChange={(e) => updateData({ ...data, props: { ...data.props, lineHeight: Number(e.target.value) } })}
              className="pr-8 h-8 text-sm"
              data-testid="inspect-panel-divider-height-field"
            />
            <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
          </div>
        </div>
        <MultiStylePropertyPanel
          names={['backgroundColor', 'padding']}
          value={data.style}
          onChange={(style) => updateData({ ...data, style })}
        />
      </BaseSidebarPanel>
    );
  }
  