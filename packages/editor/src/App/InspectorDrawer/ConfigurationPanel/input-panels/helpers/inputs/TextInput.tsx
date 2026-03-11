import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Braces } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const COMMON_VARIABLES = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'email', label: 'Email' },
  { name: 'companyName', label: 'Company Name' },
  { name: 'unsubscribeUrl', label: 'Unsubscribe URL' },
  { name: 'previewText', label: 'Preview Text' },
];

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
  showVariableInsert?: boolean;
};

const TextInput = forwardRef<TextInputRef, Props>(
  ({ helperText, label, placeholder, rows, defaultValue, onChange, autoFocus = false, onFocus, onBlur, dataTestId, showVariableInsert }, ref) => {
    const [value, setValue] = useState(defaultValue);
    const [customVar, setCustomVar] = useState('');
    const [popoverOpen, setPopoverOpen] = useState(false);
    const inputElRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        setValue(newValue);
        onChange(newValue);
      },
    }));

    const insertVariable = (varName: string) => {
      const tag = `{{${varName}}}`;
      const el = inputElRef.current;
      if (el) {
        const start = el.selectionStart ?? value.length;
        const end = el.selectionEnd ?? value.length;
        const newValue = value.substring(0, start) + tag + value.substring(end);
        setValue(newValue);
        onChange(newValue);
        setTimeout(() => {
          el.focus();
          const cursor = start + tag.length;
          el.setSelectionRange(cursor, cursor);
        }, 0);
      } else {
        const newValue = value + tag;
        setValue(newValue);
        onChange(newValue);
      }
      setPopoverOpen(false);
      setCustomVar('');
    };

    const handleCustomInsert = () => {
      const trimmed = customVar.trim();
      if (trimmed) {
        insertVariable(trimmed);
      }
    };

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
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">{label}</label>
          {showVariableInsert && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-800 transition-colors px-1.5 py-0.5 rounded-md hover:bg-violet-50"
                  title="Insert variable"
                >
                  <Braces className="h-3 w-3" />
                  <span>Variable</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end" side="bottom">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-[11px] font-medium text-gray-500 px-1">Common Variables</p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {COMMON_VARIABLES.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => insertVariable(v.name)}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-violet-50 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-gray-700 group-hover:text-violet-700">{v.label}</span>
                      <code className="text-[10px] text-gray-400 font-mono group-hover:text-violet-500">{`{{${v.name}}}`}</code>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-2">
                  <p className="text-[11px] font-medium text-gray-500 px-1 mb-1.5">Custom Variable</p>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customVar}
                      onChange={(e) => setCustomVar(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCustomInsert(); }}
                      placeholder="variableName"
                      className="flex-1 min-w-0 h-7 px-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-300 focus:border-violet-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCustomInsert}
                      disabled={!customVar.trim()}
                      className="h-7 px-2.5 text-xs font-medium bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {isMultiline ? (
          <Textarea
            {...commonProps}
            rows={rows}
            className="text-sm resize-none"
            ref={(el) => { inputElRef.current = el; }}
          />
        ) : (
          <Input
            {...commonProps}
            className="h-8 text-sm"
            ref={(el) => { inputElRef.current = el; }}
          />
        )}
        {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
