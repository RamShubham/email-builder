import React, { useState } from 'react';

  import TextDimensionInput from './TextDimensionInput';

  export const DEFAULT_2_COLUMNS = [6] as [number];
  export const DEFAULT_3_COLUMNS = [4, 8] as [number, number];

  type TWidthValue = number | null | undefined;
  type FixedWidths = [number | null | undefined, number | null | undefined, number | null | undefined];

  type ColumnsLayoutInputProps = {
    defaultValue: FixedWidths | null | undefined;
    onChange: (v: FixedWidths | null | undefined) => void;
  };

  export default function ColumnWidthsInput({ defaultValue, onChange }: ColumnsLayoutInputProps) {
    const [currentValue, setCurrentValue] = useState<[TWidthValue, TWidthValue, TWidthValue]>(() => {
      if (defaultValue) return defaultValue;
      return [null, null, null];
    });

    const setIndexValue = (index: 0 | 1 | 2, value: number | null | undefined) => {
      const nValue: FixedWidths = [...currentValue];
      nValue[index] = value;
      setCurrentValue(nValue);
      onChange(nValue);
    };

    return (
      <div className="flex gap-2">
        <TextDimensionInput label="Column 1" defaultValue={currentValue?.[0]} onChange={(v) => { if (v == null || v <= 500) setIndexValue(0, v); }} dataTestId="column-1-width-input" />
        <TextDimensionInput label="Column 2" defaultValue={currentValue?.[1]} onChange={(v) => { if (v == null || v <= 500) setIndexValue(1, v); }} dataTestId="column-2-width-input" />
        <TextDimensionInput label="Column 3" defaultValue={currentValue?.[2]} onChange={(v) => { if (v == null || v <= 500) setIndexValue(2, v); }} dataTestId="column-3-width-input" />
      </div>
    );
  }
  