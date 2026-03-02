import React, { useState } from 'react';

  import {
    AlignEndVertical,
    AlignStartVertical,
    AlignVerticalJustifyCenter,
  } from 'lucide-react';

  import ColumnsContainerPropsSchema, {
    ColumnsContainerProps,
  } from '../../../../documents/blocks/ColumnsContainer/ColumnsContainerPropsSchema';
  import { Input } from '@/components/ui/input';
  import BaseSidebarPanel from './helpers/BaseSidebarPanel';
  import ColumnWidthsInput from './helpers/inputs/ColumnWidthsInput';
  import RadioGroupInput, { RadioOption } from './helpers/inputs/RadioGroupInput';
  import TextInput from './helpers/inputs/TextInput';
  import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

  type ColumnsContainerPanelProps = {
    data: ColumnsContainerProps;
    setData: (v: ColumnsContainerProps) => void;
  };

  export default function ColumnsContainerPanel({ data, setData }: ColumnsContainerPanelProps) {
    const [, setErrors] = useState<unknown>(null);
    const updateData = (d: unknown) => {
      const res = ColumnsContainerPropsSchema.safeParse(d);
      if (res.success) { setData(res.data); setErrors(null); }
      else setErrors(res.error);
    };

    return (
      <BaseSidebarPanel title="Columns block">
        <RadioGroupInput
          label="Number of columns"
          defaultValue={data.props?.columnsCount === 2 ? '2' : '3'}
          onChange={(v) => updateData({ ...data, props: { ...data.props, columnsCount: v === '2' ? 2 : 3 } })}
        >
          <RadioOption value="2">2</RadioOption>
          <RadioOption value="3">3</RadioOption>
        </RadioGroupInput>

        <TextInput
          label="URL"
          defaultValue={data.props?.url ?? ''}
          onChange={(url) => updateData({ ...data, props: { ...data.props, url: url || undefined } })}
        />

        <ColumnWidthsInput
          defaultValue={data.props?.fixedWidths}
          onChange={(fixedWidths) => updateData({ ...data, props: { ...data.props, fixedWidths } })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Columns gap</label>
          <div className="relative flex items-center">
            <Input
              type="number"
              min={0}
              defaultValue={data.props?.columnsGap ?? 0}
              onChange={(e) => updateData({ ...data, props: { ...data.props, columnsGap: Number(e.target.value) } })}
              className="pr-8 h-8 text-sm"
            />
            <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
          </div>
        </div>

        <RadioGroupInput
          label="Alignment"
          defaultValue={data.props?.contentAlignment ?? 'middle'}
          onChange={(contentAlignment) => updateData({ ...data, props: { ...data.props, contentAlignment } })}
        >
          <RadioOption value="top"><AlignStartVertical className="h-3.5 w-3.5" /></RadioOption>
          <RadioOption value="middle"><AlignVerticalJustifyCenter className="h-3.5 w-3.5" /></RadioOption>
          <RadioOption value="bottom"><AlignEndVertical className="h-3.5 w-3.5" /></RadioOption>
        </RadioGroupInput>

        <MultiStylePropertyPanel
          names={['backgroundColor', 'padding']}
          value={data.style}
          onChange={(style) => updateData({ ...data, style })}
        />
      </BaseSidebarPanel>
    );
  }
  