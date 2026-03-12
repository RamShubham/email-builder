import React, { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FONT_FAMILIES } from '../../../../../../documents/blocks/helpers/fontFamily';

type NullableProps = {
  label: string;
  onChange: (value: null | string) => void;
  defaultValue: null | string;
  dataTestId?: string;
  isRoot?: boolean;
};

export function NullableFontFamily({ label, onChange, defaultValue, dataTestId, isRoot = false }: NullableProps) {
  const [value, setValue] = useState(
    defaultValue ?? (isRoot ? 'MODERN_SANS' : 'inherit')
  );

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          if (isRoot) {
            onChange(v);
          } else {
            onChange(v === 'inherit' ? null : v);
          }
        }}
      >
        <SelectTrigger className="h-8 text-sm" id={dataTestId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {!isRoot && (
            <SelectItem value="inherit">Match email settings</SelectItem>
          )}
          {FONT_FAMILIES.map((option) => (
            <SelectItem
              key={option.key}
              value={option.key}
              data-testid={`font-family-option-${option.key}`}
              style={{ fontFamily: option.value }}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

