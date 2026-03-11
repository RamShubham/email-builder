import React, { useState } from 'react';

import { TextField, Typography } from '@mui/material';

import EmailLayoutPropsSchema, {
	EmailLayoutProps,
} from '../../../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput, { NullableColorInput } from './helpers/inputs/ColorInput';
import { NullableFontFamily } from './helpers/inputs/FontFamily';

type EmailLayoutSidebarFieldsProps = {
	data: EmailLayoutProps;
	setData: (v: EmailLayoutProps) => void;
};
export default function EmailLayoutSidebarFields({
	data,
	setData,
}: EmailLayoutSidebarFieldsProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);

	const updateData = (d: unknown) => {
		const res = EmailLayoutPropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel title="Global">
			<ColorInput
				label="Backdrop color"
				defaultValue={data.backdropColor ?? '#F5F5F5'}
				onChange={(backdropColor) =>
					updateData({ ...data, backdropColor })
				}
			/>
			<ColorInput
				label="Canvas color"
				defaultValue={data.canvasColor ?? '#FFFFFF'}
				onChange={(canvasColor) => updateData({ ...data, canvasColor })}
			/>
			<NullableColorInput
				label="Canvas border color"
				defaultValue={data.borderColor ?? null}
				onChange={(borderColor) => updateData({ ...data, borderColor })}
			/>

			<TextField
				fullWidth
				label="Canvas border radius"
				variant="outlined"
				size="small"
				defaultValue={data.borderRadius ?? 0}
				onChange={(e) =>
					updateData({
						...data,
						borderRadius: Number(e.target.value),
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
					min: 0,
					max: 48,
					type: 'number',
				}}
			/>

			<NullableFontFamily
				label="Font family"
				defaultValue={data.fontFamily ?? 'MODERN_SANS'}
				onChange={(fontFamily) => updateData({ ...data, fontFamily })}
				dataTestId="styles-panel-font-family"
			/>
			<ColorInput
				label="Text color"
				defaultValue={data.textColor ?? '#262626'}
				onChange={(textColor) => updateData({ ...data, textColor })}
			/>
		</BaseSidebarPanel>
	);
}
