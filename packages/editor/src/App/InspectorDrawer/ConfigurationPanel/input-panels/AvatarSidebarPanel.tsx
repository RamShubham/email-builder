import React, { useState } from 'react';

  import {
    AvatarProps,
    AvatarPropsDefaults,
    AvatarPropsSchema,
  } from '@usewaypoint/block-avatar';

  import { Input } from '@/components/ui/input';
  import BaseSidebarPanel from './helpers/BaseSidebarPanel';
  import RadioGroupInput, { RadioOption } from './helpers/inputs/RadioGroupInput';
  import TextInput from './helpers/inputs/TextInput';
  import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

  type AvatarSidebarPanelProps = {
    data: AvatarProps & { template?: AvatarProps['props'] };
    setData: (v: AvatarProps) => void;
  };

  export default function AvatarSidebarPanel({ data, setData }: AvatarSidebarPanelProps) {
    const [, setErrors] = useState<unknown>(null);

    const updateData = (d: unknown) => {
      const res = AvatarPropsSchema.safeParse(d);
      if (res.success) { setData(res.data); setErrors(null); }
      else setErrors(res.error);
    };

    const size = data.template?.size ?? AvatarPropsDefaults.size;
    const imageUrl = data.template?.imageUrl ?? AvatarPropsDefaults.imageUrl;
    const alt = data.template?.alt ?? AvatarPropsDefaults.alt;
    const shape = data.template?.shape ?? AvatarPropsDefaults.shape;

    return (
      <BaseSidebarPanel title="Avatar block" dataTestId="avatar-inspect-panel">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Size</label>
          <div className="relative flex items-center">
            <Input
              type="number"
              min={32}
              max={256}
              defaultValue={size}
              onChange={(e) => updateData({ ...data, props: { ...data.props, size: Number(e.target.value) } })}
              className="pr-8 h-8 text-sm"
              data-testid="inspect-panel-avatar-size-field"
            />
            <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">px</span>
          </div>
        </div>

        <RadioGroupInput
          label="Shape"
          defaultValue={shape}
          onChange={(shape) => updateData({ ...data, props: { ...data.props, shape } })}
        >
          <RadioOption value="circle">Circle</RadioOption>
          <RadioOption value="square">Square</RadioOption>
          <RadioOption value="rounded">Rounded</RadioOption>
        </RadioGroupInput>

        <TextInput
          label="Image URL"
          defaultValue={imageUrl}
          onChange={(imageUrl) => updateData({ ...data, props: { ...data.props, imageUrl } })}
          autoFocus
          onFocus={(event) => event.target.select()}
        />

        <TextInput
          label="Alt text"
          defaultValue={alt}
          onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
        />

        <MultiStylePropertyPanel
          names={['textAlign', 'padding']}
          value={data.style}
          onChange={(style) => updateData({ ...data, style })}
        />
      </BaseSidebarPanel>
    );
  }
  