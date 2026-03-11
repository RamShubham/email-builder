import { useState } from 'react';
import { z as Zod } from 'zod';

import { TextField, Typography } from '@mui/material';
import {
	DividerProps,
	DividerPropsDefaults,
	DividerPropsSchema,
} from '@usewaypoint/block-divider';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type DividerSidebarPanelProps = {
	data: DividerProps;
	setData: (v: DividerProps) => void;
};
export default function DividerSidebarPanel({
	data,
	setData,
}: DividerSidebarPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);
	const updateData = (d: unknown) => {
		const res = DividerPropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	const lineColor = data.props?.lineColor ?? DividerPropsDefaults.lineColor;
	const lineHeight =
		data.props?.lineHeight ?? DividerPropsDefaults.lineHeight;

	return (
		<BaseSidebarPanel
			title="Divider block"
			dataTestId="divider-inspect-panel"
		>
			<ColorInput
				label="Color"
				defaultValue={lineColor}
				onChange={(lineColor) =>
					updateData({ ...data, props: { ...data.props, lineColor } })
				}
				dataTestId="inspect-panel-divider-color"
			/>

			<TextField
				fullWidth
				label="Height"
				variant="outlined"
				size="small"
				defaultValue={lineHeight ?? 0}
				onChange={(e) =>
					updateData({
						...data,
						props: {
							...data.props,
							lineHeight: Number(e.target.value),
						},
					})
				}
				InputProps={{
					endAdornment: (
						<Typography variant="body2" color="text.secondary">
							px
						</Typography>
					),
				}}
				inputProps={{
					min: 1,
					max: 24,
					type: 'number',
				}}
				data-testid="inspect-panel-divider-height-field"
			/>
			<MultiStylePropertyPanel
				names={['backgroundColor', 'padding']}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
