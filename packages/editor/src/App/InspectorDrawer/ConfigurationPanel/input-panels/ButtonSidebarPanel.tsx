import React, { useState } from 'react';

import {
  ButtonProps,
  ButtonPropsDefaults,
  ButtonPropsSchema,
} from '@usewaypoint/block-button';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import ColorInput from './helpers/inputs/ColorInput';
import RadioGroupInput, { RadioOption } from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ButtonSidebarPanelProps = {
  data: ButtonProps & { template?: ButtonProps['props'] };
  setData: (v: ButtonProps) => void;
};

export default function ButtonSidebarPanel({ data, setData }: ButtonSidebarPanelProps) {
  const [, setErrors] = useState<unknown>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) { setData(res.data); setErrors(null); }
    else setErrors(res.error);
  };

  const text = data.template?.text ?? ButtonPropsDefaults.text;
  const url = data.template?.url ?? ButtonPropsDefaults.url;
  const fullWidth = data.template?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const size = data.template?.size ?? ButtonPropsDefaults.size;
  const buttonStyle = data.template?.buttonStyle ?? ButtonPropsDefaults.buttonStyle;
  const buttonTextColor = data.template?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor;
  const buttonBackgroundColor = data.template?.buttonBackgroundColor ?? ButtonPropsDefaults.buttonBackgroundColor;

  return (
    <BaseSidebarPanel title="Button block" dataTestId="button-inspect-panel">
      <TextInput
        label="Text"
        defaultValue={text}
        onChange={(text) => updateData({ ...data, props: { ...data.props, text } })}
        dataTestId="inspect-panel-button-text-field"
        showVariableInsert
      />
      <TextInput
        label="URL"
        defaultValue={url}
        onChange={(url) => updateData({ ...data, props: { ...data.props, url } })}
        dataTestId="inspect-panel-button-url-field"
        showVariableInsert
      />
      <BooleanInput
        label="Full width"
        defaultValue={fullWidth}
        onChange={(fullWidth) => updateData({ ...data, props: { ...data.props, fullWidth } })}
      />
      <RadioGroupInput
        label="Size"
        defaultValue={size}
        onChange={(size) => updateData({ ...data, props: { ...data.props, size } })}
      >
        <RadioOption value="x-small">XS</RadioOption>
        <RadioOption value="small">S</RadioOption>
        <RadioOption value="medium">M</RadioOption>
        <RadioOption value="large">L</RadioOption>
      </RadioGroupInput>
      <RadioGroupInput
        label="Style"
        defaultValue={buttonStyle}
        onChange={(buttonStyle) => updateData({ ...data, props: { ...data.props, buttonStyle } })}
        dataTestId="inspect-panel-style-field"
      >
        <RadioOption value="rectangle">Rectangle</RadioOption>
        <RadioOption value="rounded">Rounded</RadioOption>
        <RadioOption value="pill">Pill</RadioOption>
      </RadioGroupInput>
      <ColorInput
        label="Text color"
        defaultValue={buttonTextColor}
        onChange={(buttonTextColor) => updateData({ ...data, props: { ...data.props, buttonTextColor } })}
        dataTestId="inspect-panel-text-color"
      />
      <ColorInput
        label="Button color"
        defaultValue={buttonBackgroundColor}
        onChange={(buttonBackgroundColor) => updateData({ ...data, props: { ...data.props, buttonBackgroundColor } })}
        dataTestId="inspect-panel-button-color"
      />
      <MultiStylePropertyPanel
        names={['backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
