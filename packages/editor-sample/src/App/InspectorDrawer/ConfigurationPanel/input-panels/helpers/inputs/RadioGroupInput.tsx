import React, { useState } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type RadioOptionProps = {
  value: string;
  children?: React.ReactNode;
  'data-testid'?: string;
};

export function RadioOption(_props: RadioOptionProps): null {
  return null;
}

type Props = {
  label: string | JSX.Element;
  children: React.ReactElement<RadioOptionProps> | React.ReactElement<RadioOptionProps>[];
  defaultValue: string;
  onChange: (v: string) => void;
  dataTestId?: string;
};

export default function RadioGroupInput({ label, children, defaultValue, onChange, dataTestId }: Props) {
  const [value, setValue] = useState(defaultValue);
  const childArray = React.Children.toArray(children) as React.ReactElement<RadioOptionProps>[];

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <ToggleGroup
        type="single"
        value={value}
        data-testid={dataTestId}
        onValueChange={(v: string) => {
          if (!v) return;
          setValue(v);
          onChange(v);
        }}
        className="justify-start"
      >
        {childArray.map((child) => (
          <ToggleGroupItem
            key={child.props.value}
            value={child.props.value}
            data-testid={child.props['data-testid']}
            className="flex-1 h-8 text-xs"
          >
            {child.props.children}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
