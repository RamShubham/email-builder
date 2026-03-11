import React from 'react';

  import { HexColorPicker } from 'react-colorful';

  import Swatch from './Swatch';

  const PALETTE_COLORS = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc',
    '#d9d9d9', '#ffffff', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
    '#00ffff', '#0000ff', '#9900ff', '#ff00ff', '#f4cccc', '#fce5cd',
    '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8',
  ];

  type Props = {
    value: string;
    onChange: (value: string) => void;
  };

  export default function Picker({ value, onChange }: Props) {
    return (
      <div className="p-3 flex flex-col gap-3" style={{ width: 200 }}>
        <HexColorPicker color={value} onChange={onChange} style={{ width: '100%' }} />
        <Swatch paletteColors={PALETTE_COLORS} value={value} onChange={onChange} />
      </div>
    );
  }
  