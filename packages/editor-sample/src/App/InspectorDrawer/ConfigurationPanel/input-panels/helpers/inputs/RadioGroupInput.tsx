import React, { useEffect, useState } from 'react';

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
  useEffect(() => { setValue(defaultValue); }, [defaultValue]);
  const childArray = React.Children.toArray(children) as React.ReactElement<RadioOptionProps>[];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="bg-gray-100 rounded-lg p-1">
        <ToggleGroup
          type="single"
          value={value}
          data-testid={dataTestId}
          onValueChange={(v: string) => {
            if (!v) return;
            setValue(v);
            onChange(v);
          }}
          className="w-full gap-0.5"
        >
          {childArray.map((child) => (
            <ToggleGroupItem
              key={child.props.value}
              value={child.props.value}
              data-testid={child.props['data-testid']}
              className="flex-1 h-7 text-xs rounded-md bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=on]:font-medium transition-all duration-150"
            >
              {child.props.children}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
