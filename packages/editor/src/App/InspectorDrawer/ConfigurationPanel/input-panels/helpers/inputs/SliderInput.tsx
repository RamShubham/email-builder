import React, { useState } from 'react';

  import RawSliderInput from './raw/RawSliderInput';

  type SliderInputProps = {
    label: string;
    iconLabel: JSX.Element;
    step?: number;
    marks?: boolean;
    units: string;
    min?: number;
    max?: number;
    defaultValue: number;
    onChange: (v: number) => void;
  };

  export default function SliderInput({ label, defaultValue, onChange, ...props }: SliderInputProps) {
    const [value, setValue] = useState(defaultValue);
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">{label}</label>
        <RawSliderInput
          value={value}
          setValue={(value: number) => {
            setValue(value);
            onChange(value);
          }}
          {...props}
        />
      </div>
    );
  }
  