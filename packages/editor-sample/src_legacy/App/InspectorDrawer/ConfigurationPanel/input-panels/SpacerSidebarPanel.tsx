import { useState } from 'react';
import { z as Zod } from 'zod';

import { TextField, Typography } from '@mui/material';
import {
	SpacerProps,
	SpacerPropsDefaults,
	SpacerPropsSchema,
} from '@usewaypoint/block-spacer';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';

type SpacerSidebarPanelProps = {
	data: SpacerProps;
	setData: (v: SpacerProps) => void;
};
export default function SpacerSidebarPanel({
	data,
	setData,
}: SpacerSidebarPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);

	const updateData = (d: unknown) => {
		const res = SpacerPropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel
			title="Spacer block"
			dataTestId="spacer-inspect-panel"
		>
			<TextField
				fullWidth
				label="Height"
				variant="outlined"
				size="small"
				defaultValue={data?.props?.height ?? SpacerPropsDefaults.height}
				onChange={(e) =>
					updateData({
						...data,
						props: {
							...data.props,
							height: Number(e.target.value),
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
					min: 4,
					max: 128,
					type: 'number',
				}}
				data-testid="inspect-panel-spacer-height-field"
			/>
		</BaseSidebarPanel>
	);
}
