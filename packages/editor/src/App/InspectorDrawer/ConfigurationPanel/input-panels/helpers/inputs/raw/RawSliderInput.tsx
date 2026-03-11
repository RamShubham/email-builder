import React from 'react';

  import { Slider } from '@/components/ui/slider';

  type SliderInputProps = {
    iconLabel: JSX.Element;
    step?: number;
    marks?: boolean;
    units: string;
    min?: number;
    max?: number;
    value: number;
    setValue: (v: number) => void;
  };

  export default function RawSliderInput({ iconLabel, value, setValue, units, min, max, step }: SliderInputProps) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="min-w-6 flex-shrink-0 leading-none">{iconLabel}</div>
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]: number[]) => setValue(v)}
          className="flex-1"
        />
        <div className="min-w-8 text-right flex-shrink-0">
          <span className="text-xs text-gray-500">{value}{units}</span>
        </div>
      </div>
    );
  }
  