import type { ZodError } from 'zod';
import React, { useState } from 'react';

  import EmailLayoutPropsSchema, {
    EmailLayoutProps,
  } from '../../../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';
  import { Input } from '@/components/ui/input';
  import BaseSidebarPanel from './helpers/BaseSidebarPanel';
  import ColorInput, { NullableColorInput } from './helpers/inputs/ColorInput';
  import { NullableFontFamily } from './helpers/inputs/FontFamily';

  type EmailLayoutSidebarFieldsProps = {
    data: EmailLayoutProps;
    setData: (v: EmailLayoutProps) => void;
  };

  export default function EmailLayoutSidebarFields({ data, setData }: EmailLayoutSidebarFieldsProps) {
    const [, setErrors] = useState<unknown>(null);

    const updateData = (d: unknown) => {
      const res = EmailLayoutPropsSchema.safeParse(d);
      if (res.success) { setData(res.data); setErrors(null); }
      else setErrors(res.error);
    };

    return (
      <BaseSidebarPanel title="Global">
        <ColorInput
          label="Backdrop color"
          defaultValue={data.backdropColor ?? '#F5F5F5'}
          onChange={(backdropColor) => updateData({ ...data, backdropColor })}
        />
        <ColorInput
          label="Canvas color"
          defaultValue={data.canvasColor ?? '#FFFFFF'}
          onChange={(canvasColor) => updateData({ ...data, canvasColor })}
        />
        <NullableColorInput
          label="Canvas border color"
          defaultValue={data.borderColor ?? null}
          onChange={(borderColor) => updateData({ ...data, borderColor })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Canvas border radius</label>
          <div className="relative flex items-center">
            <Input
              type="number"
              min={0}
              max={48}
              defaultValue={data.borderRadius ?? 0}
              onChange={(e) => updateData({ ...data, borderRadius: Number(e.target.value) })}
              className="pr-8 h-8 text-sm"
            />
            <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
          </div>
        </div>
        <NullableFontFamily
          label="Font family"
          defaultValue={data.fontFamily ?? 'MODERN_SANS'}
          onChange={(fontFamily) => updateData({ ...data, fontFamily })}
          dataTestId="styles-panel-font-family"
        />
        <ColorInput
          label="Text color"
          defaultValue={data.textColor ?? '#262626'}
          onChange={(textColor) => updateData({ ...data, textColor })}
        />
      </BaseSidebarPanel>
    );
  }
  