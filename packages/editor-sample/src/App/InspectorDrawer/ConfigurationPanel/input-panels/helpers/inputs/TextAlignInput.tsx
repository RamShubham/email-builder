import React, { useState } from 'react';

  import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

  import RadioGroupInput, { RadioOption } from './RadioGroupInput';

  type Props = {
    label: string;
    defaultValue: string | null;
    onChange: (value: string | null) => void;
    dataTestId?: string;
  };

  export default function TextAlignInput({ label, defaultValue, onChange, dataTestId }: Props) {
    const [value, setValue] = useState(defaultValue ?? 'left');

    return (
      <RadioGroupInput
        dataTestId={dataTestId}
        label={label}
        defaultValue={value}
        onChange={(value) => {
          setValue(value);
          onChange(value);
        }}
      >
        <RadioOption value="left"><AlignLeft className="h-3.5 w-3.5" /></RadioOption>
        <RadioOption value="center"><AlignCenter className="h-3.5 w-3.5" /></RadioOption>
        <RadioOption value="right"><AlignRight className="h-3.5 w-3.5" /></RadioOption>
      </RadioGroupInput>
    );
  }
  