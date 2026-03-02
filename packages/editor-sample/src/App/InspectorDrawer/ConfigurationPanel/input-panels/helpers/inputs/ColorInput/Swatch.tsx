import React from 'react';

  type Props = {
    paletteColors: string[];
    value: string;
    onChange: (value: string) => void;
  };

  export default function Swatch({ paletteColors, value, onChange }: Props) {
    return (
      <div className="grid grid-cols-6 gap-1 w-full">
        {paletteColors.map((colorValue) => (
          <button
            key={colorValue}
            data-testid={`inspect-panel-color-swatch-${colorValue}`}
            onClick={() => onChange(colorValue)}
            className="w-6 h-6 rounded border transition-all hover:scale-110"
            style={{
              backgroundColor: colorValue,
              borderColor: value === colorValue ? '#000' : '#e5e7eb',
            }}
          />
        ))}
      </div>
    );
  }
  