import React from 'react';

  import BaseColorInput from './BaseColorInput';

  type ColorInputProps = {
    label: string;
    onChange: (value: string) => void;
    defaultValue: string;
    dataTestId?: string;
  };

  export default function ColorInput({ label, onChange, defaultValue, dataTestId }: ColorInputProps) {
    return (
      <BaseColorInput
        nullable={false}
        label={label}
        defaultValue={defaultValue}
        onChange={onChange}
        dataTestId={dataTestId}
      />
    );
  }

  type NullableColorInputProps = {
    label: string;
    onChange: (value: string | null) => void;
    defaultValue: string | null;
    dataTestId?: string;
  };

  export function NullableColorInput({ label, onChange, defaultValue, dataTestId }: NullableColorInputProps) {
    return (
      <BaseColorInput
        nullable={true}
        label={label}
        defaultValue={defaultValue}
        onChange={onChange}
        dataTestId={dataTestId}
      />
    );
  }
  