import React from 'react';

  import { Input } from '@/components/ui/input';
  import { TStyle } from '../../../../../../documents/blocks/helpers/TStyle';
  import { NullableColorInput } from '../inputs/ColorInput';
  import { NullableFontFamily } from '../inputs/FontFamily';
  import FontSizeInput from '../inputs/FontSizeInput';
  import FontWeightInput from '../inputs/FontWeightInput';
  import PaddingInput from '../inputs/PaddingInput';
  import TextAlignInput from '../inputs/TextAlignInput';

  type StylePropertyPanelProps = {
    name: keyof TStyle;
    value: TStyle;
    onChange: (style: TStyle) => void;
  };

  export default function SingleStylePropertyPanel({ name, value, onChange }: StylePropertyPanelProps) {
    const defaultValue = value[name] ?? null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (v: any) => {
      onChange({ ...value, [name]: v });
    };

    switch (name) {
      case 'backgroundColor':
        return <NullableColorInput dataTestId="inspect-panel-background-color" label="Background color" defaultValue={defaultValue} onChange={handleChange} />;
      case 'borderColor':
        return <NullableColorInput dataTestId="inspect-panel-border-color" label="Border color" defaultValue={defaultValue} onChange={handleChange} />;
      case 'borderRadius':
        return (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Border radius</label>
            <div className="relative flex items-center">
              <Input
                type="number"
                min={0}
                max={48}
                defaultValue={Number(defaultValue)}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="pr-8 h-8 text-sm"
                data-testid="inspect-panel-border-radius"
              />
              <span className="absolute right-2 text-xs text-gray-400 pointer-events-none" data-testid="inspect-panel-border-radius-unit">px</span>
            </div>
          </div>
        );
      case 'color':
        return <NullableColorInput dataTestId="inspect-panel-text-color" label="Text color" defaultValue={defaultValue} onChange={handleChange} />;
      case 'fontFamily':
        return <NullableFontFamily dataTestId="inspect-panel-font-family" label="Font family" defaultValue={defaultValue} onChange={handleChange} />;
      case 'fontSize':
        return <FontSizeInput dataTestId="inspect-panel-font-size" label="Font size" defaultValue={defaultValue} onChange={handleChange} />;
      case 'fontWeight':
        return <FontWeightInput dataTestId="inspect-panel-font-weight" label="Font weight" defaultValue={defaultValue} onChange={handleChange} />;
      case 'textAlign':
        return <TextAlignInput dataTestId="inspect-panel-text-align" label="Alignment" defaultValue={defaultValue} onChange={handleChange} />;
      case 'padding':
        return <PaddingInput dataTestId="inspect-panel-padding" label="Padding" defaultValue={defaultValue} onChange={handleChange} />;
    }
  }
  