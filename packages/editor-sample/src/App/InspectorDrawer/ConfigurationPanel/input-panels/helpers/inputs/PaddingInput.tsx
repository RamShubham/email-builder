import React, { useState } from 'react';

  import { MoveHorizontal, MoveVertical } from 'lucide-react';

  import { Input } from '@/components/ui/input';

  type TPaddingValue = { top: number; bottom: number; right: number; left: number };

  type Props = {
    label: string;
    defaultValue: TPaddingValue | null;
    onChange: (value: TPaddingValue) => void;
    dataTestId?: string;
  };

  export default function PaddingInput({ label, defaultValue, onChange, dataTestId }: Props) {
    const [value, setValue] = useState<TPaddingValue>(
      defaultValue ?? { top: 0, bottom: 0, right: 0, left: 0 }
    );

    const handleChange = (side: keyof TPaddingValue, num: number) => {
      const nValue = { ...value, [side]: num };
      setValue(nValue);
      onChange(nValue);
    };

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">{label}</label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 flex-1">
              <MoveVertical className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <div className="relative flex-1">
                <Input data-testid={`${dataTestId}-top`} type="number" min={0} value={value.top} onChange={(e) => handleChange('top', Number(e.target.value))} className="pr-7 h-8 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">px</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-1">
              <MoveVertical className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <div className="relative flex-1">
                <Input data-testid={`${dataTestId}-bottom`} type="number" min={0} value={value.bottom} onChange={(e) => handleChange('bottom', Number(e.target.value))} className="pr-7 h-8 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">px</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 flex-1">
              <MoveHorizontal className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <div className="relative flex-1">
                <Input data-testid={`${dataTestId}-left`} type="number" min={0} value={value.left} onChange={(e) => handleChange('left', Number(e.target.value))} className="pr-7 h-8 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">px</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-1">
              <MoveHorizontal className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <div className="relative flex-1">
                <Input data-testid={`${dataTestId}-right`} type="number" min={0} value={value.right} onChange={(e) => handleChange('right', Number(e.target.value))} className="pr-7 h-8 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  