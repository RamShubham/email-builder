import React, { useState } from 'react';

  import { Label } from '@/components/ui/label';
  import { Switch } from '@/components/ui/switch';

  type Props = {
    label: string;
    defaultValue: boolean;
    onChange: (value: boolean) => void;
    dataTestId?: string;
  };

  export default function BooleanInput({ label, defaultValue, onChange, dataTestId }: Props) {
    const [value, setValue] = useState(defaultValue);
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={value}
          data-testid={dataTestId}
          onCheckedChange={(checked: boolean) => {
            setValue(checked);
            onChange(checked);
          }}
        />
        <Label>{label}</Label>
      </div>
    );
  }
  