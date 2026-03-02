import React, { forwardRef, useImperativeHandle, useState } from 'react';

  import { Input } from '@/components/ui/input';
  import { Textarea } from '@/components/ui/textarea';

  export interface TextInputRef {
    setValue: (value: string) => void;
  }

  type Props = {
    label: string;
    rows?: number;
    placeholder?: string;
    helperText?: string | JSX.Element;
    defaultValue: string;
    onChange: (v: string) => void;
    autoFocus?: boolean;
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    dataTestId?: string;
  };

  const TextInput = forwardRef<TextInputRef, Props>(
    ({ helperText, label, placeholder, rows, defaultValue, onChange, autoFocus = false, onFocus, onBlur, dataTestId }, ref) => {
      const [value, setValue] = useState(defaultValue);

      useImperativeHandle(ref, () => ({
        setValue: (newValue: string) => {
          setValue(newValue);
          onChange(newValue);
        },
      }));

      const isMultiline = typeof rows === 'number' && rows > 1;

      const commonProps = {
        value,
        placeholder,
        autoFocus,
        'data-testid': dataTestId,
        onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const v = ev.target.value;
          setValue(v);
          onChange(v);
        },
        onFocus: (event: React.FocusEvent<any>) => onFocus && onFocus(event),
        onBlur: (event: React.FocusEvent<any>) => onBlur && onBlur(event),
      };

      return (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">{label}</label>
          {isMultiline ? (
            <Textarea {...commonProps} rows={rows} className="text-sm resize-none" />
          ) : (
            <Input {...commonProps} className="h-8 text-sm" />
          )}
          {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
        </div>
      );
    }
  );

  TextInput.displayName = 'TextInput';

  export default TextInput;
  