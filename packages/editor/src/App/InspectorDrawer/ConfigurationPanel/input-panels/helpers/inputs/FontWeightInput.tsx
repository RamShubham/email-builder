import React, { useState } from 'react';

  import RadioGroupInput, { RadioOption } from './RadioGroupInput';

  type Props = {
    label: string;
    defaultValue: string;
    onChange: (value: string) => void;
    dataTestId?: string;
  };

  export default function FontWeightInput({ label, defaultValue, onChange, dataTestId }: Props) {
    const [value, setValue] = useState(defaultValue);
    return (
      <RadioGroupInput
        dataTestId={dataTestId}
        label={label}
        defaultValue={value}
        onChange={(fontWeight) => {
          setValue(fontWeight);
          onChange(fontWeight);
        }}
      >
        <RadioOption value="normal">Regular</RadioOption>
        <RadioOption value="bold">Bold</RadioOption>
      </RadioGroupInput>
    );
  }
  