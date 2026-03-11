import React from 'react';

import { TextField, Typography } from '@mui/material';

type TextDimensionInputProps = {
	label: string;
	defaultValue: number | null | undefined;
	onChange: (v: number | null) => void;
	dataTestId: string;
};
export default function TextDimensionInput({
	label,
	defaultValue,
	onChange,
	dataTestId,
}: TextDimensionInputProps) {
	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		const value = parseInt(ev.target.value);
		onChange(isNaN(value) ? null : value);
	};
	return (
		<TextField
			fullWidth
			onChange={handleChange}
			defaultValue={defaultValue}
			label={label}
			variant="standard"
			placeholder="auto"
			size="small"
			InputProps={{
				endAdornment: (
					<Typography variant="body2" color="text.secondary">
						px
					</Typography>
				),
				inputProps: {
					min: 0,
					max: 500,
					type: 'number',
					'data-testid': dataTestId,
				},
			}}
		/>
	);
}
