import React, { useState } from 'react';
  import { z as Zod } from 'zod';

  import {
    SpacerProps,
    SpacerPropsDefaults,
    SpacerPropsSchema,
  } from '@usewaypoint/block-spacer';

  import { Input } from '@/components/ui/input';
  import BaseSidebarPanel from './helpers/BaseSidebarPanel';

  type SpacerSidebarPanelProps = {
    data: SpacerProps;
    setData: (v: SpacerProps) => void;
  };

  export default function SpacerSidebarPanel({ data, setData }: SpacerSidebarPanelProps) {
    const [, setErrors] = useState<unknown>(null);

    const updateData = (d: unknown) => {
      const res = SpacerPropsSchema.safeParse(d);
      if (res.success) { setData(res.data); setErrors(null); }
      else setErrors(res.error);
    };

    return (
      <BaseSidebarPanel title="Spacer block" dataTestId="spacer-inspect-panel">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Height</label>
          <div className="relative flex items-center">
            <Input
              type="number"
              min={4}
              max={128}
              defaultValue={data?.props?.height ?? SpacerPropsDefaults.height}
              onChange={(e) => updateData({ ...data, props: { ...data.props, height: Number(e.target.value) } })}
              className="pr-8 h-8 text-sm"
              data-testid="inspect-panel-spacer-height-field"
            />
            <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
          </div>
        </div>
      </BaseSidebarPanel>
    );
  }
  