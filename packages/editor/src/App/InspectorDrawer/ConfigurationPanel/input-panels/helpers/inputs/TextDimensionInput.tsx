import React from 'react';

  import { Input } from '@/components/ui/input';

  type TextDimensionInputProps = {
    label: string;
    defaultValue: number | null | undefined;
    onChange: (v: number | null) => void;
    dataTestId: string;
  };

  export default function TextDimensionInput({ label, defaultValue, onChange, dataTestId }: TextDimensionInputProps) {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
      const value = parseInt(ev.target.value);
      onChange(isNaN(value) ? null : value);
    };

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">{label}</label>
        <div className="relative flex items-center">
          <Input
            onChange={handleChange}
            defaultValue={defaultValue ?? ''}
            placeholder="auto"
            type="number"
            min={0}
            max={500}
            data-testid={dataTestId}
            className="pr-8 h-8 text-sm"
          />
          <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
        </div>
      </div>
    );
  }
  