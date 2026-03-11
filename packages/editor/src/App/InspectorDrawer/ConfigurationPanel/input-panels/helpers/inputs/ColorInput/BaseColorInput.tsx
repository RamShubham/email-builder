import React, { useState } from 'react';

  import { Plus, X } from 'lucide-react';

  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

  import Picker from './Picker';

  type Props =
    | {
        nullable: true;
        label: string;
        onChange: (value: string | null) => void;
        defaultValue: string | null;
        dataTestId?: string;
      }
    | {
        nullable: false;
        label: string;
        onChange: (value: string) => void;
        defaultValue: string;
        dataTestId?: string;
      };

  export default function ColorInput({ label, defaultValue, onChange, nullable, dataTestId }: Props) {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);

    const renderSwatch = () => {
      if (value) {
        return (
          <button
            onClick={() => setOpen(true)}
            data-testid={`${dataTestId}-swatch-open`}
            className="w-8 h-8 rounded border border-gray-300 flex-shrink-0 hover:ring-2 hover:ring-gray-400 transition-all"
            style={{ backgroundColor: value }}
          />
        );
      }
      return (
        <button
          onClick={() => setOpen(true)}
          data-testid={`${dataTestId}-swatch-open`}
          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-gray-500" />
        </button>
      );
    };

    const renderReset = () => {
      if (!nullable) return null;
      if (typeof value !== 'string' || value.trim().length === 0) return null;
      return (
        <button
          onClick={() => { setValue(null); (onChange as (v: null) => void)(null); }}
          data-testid={`${dataTestId}-swatch-reset`}
          className="p-0.5 hover:text-gray-700 text-gray-400 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      );
    };

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">{label}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2">
              {renderSwatch()}
              {renderReset()}
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="start">
            <Picker
              value={value || '#000000'}
              onChange={(v) => {
                setValue(v);
                (onChange as (v: string) => void)(v);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  