import { useState } from 'react';
import { z as Zod } from 'zod';

import { TextField, ToggleButton, Typography } from '@mui/material';
import {
	AvatarProps,
	AvatarPropsDefaults,
	AvatarPropsSchema,
} from '@usewaypoint/block-avatar';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type AvatarSidebarPanelProps = {
	data: AvatarProps & { template?: AvatarProps['props'] };
	setData: (v: AvatarProps) => void;
};
export default function AvatarSidebarPanel({
	data,
	setData,
}: AvatarSidebarPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);
	const updateData = (d: unknown) => {
		const res = AvatarPropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	const size = data.template?.size ?? AvatarPropsDefaults.size;
	const imageUrl = data.template?.imageUrl ?? AvatarPropsDefaults.imageUrl;
	const alt = data.template?.alt ?? AvatarPropsDefaults.alt;
	const shape = data.template?.shape ?? AvatarPropsDefaults.shape;

	return (
		<BaseSidebarPanel
			title="Avatar block"
			dataTestId="avatar-inspect-panel"
		>
			<TextField
				fullWidth
				label="Size"
				variant="outlined"
				size="small"
				defaultValue={size}
				onChange={(e) => {
					updateData({
						...data,
						props: { ...data.props, size: Number(e.target.value) },
					});
				}}
				data-testid="inspect-panel-avatar-size-field"
				InputProps={{
					// startAdornment: <AspectRatioOutlined sx={{ color: 'text.secondary' }} />,
					endAdornment: (
						<Typography variant="body2" color="text.secondary">
							px
						</Typography>
					),
				}}
				inputProps={{
					min: 32,
					max: 256,
					type: 'number',
				}}
			/>

			<RadioGroupInput
				label="Shape"
				defaultValue={shape}
				onChange={(shape) => {
					updateData({ ...data, props: { ...data.props, shape } });
				}}
			>
				<ToggleButton value="circle">Circle</ToggleButton>
				<ToggleButton value="square">Square</ToggleButton>
				<ToggleButton value="rounded">Rounded</ToggleButton>
			</RadioGroupInput>
			<TextInput
				label="Image URL"
				defaultValue={imageUrl}
				onChange={(imageUrl) => {
					updateData({ ...data, props: { ...data.props, imageUrl } });
				}}
				autoFocus={true}
				onFocus={(event) => event.target.select()}
			/>
			<TextInput
				label="Alt text"
				defaultValue={alt}
				onChange={(alt) => {
					updateData({ ...data, props: { ...data.props, alt } });
				}}
			/>

			<MultiStylePropertyPanel
				names={['textAlign', 'padding']}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
