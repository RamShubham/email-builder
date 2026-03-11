import React, { useState } from 'react';

  import { Input } from '@/components/ui/input';

  type Props = {
    label: string;
    defaultValue: number;
    onChange: (v: number) => void;
    dataTestId?: string;
  };

  export default function FontSizeInput({ label, defaultValue, onChange, dataTestId }: Props) {
    const [value, setValue] = useState(defaultValue || 16);

    const handleChange = (v: number) => {
      setValue(v);
      onChange(v);
    };

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">{label}</label>
        <div className="relative flex items-center">
          <Input
            data-testid={dataTestId}
            type="number"
            min={0}
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="pr-8 h-8 text-sm"
          />
          <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
        </div>
      </div>
    );
  }
  