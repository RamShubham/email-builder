import React, { useState } from 'react';

import { Stack, TextField, Typography } from '@mui/material';

type Props = {
	label: string;
	defaultValue: number;
	onChange: (v: number) => void;
	dataTestId?: string;
};
export default function FontSizeInput({
	label,
	defaultValue,
	onChange,
	dataTestId,
}: Props) {
	const [value, setValue] = useState(defaultValue || 16);
	const handleChange = (value: number) => {
		setValue(value);
		onChange(value);
	};

	return (
		<Stack spacing={1} alignItems="flex-start">
			<TextField
				data-testid={dataTestId}
				fullWidth
				variant="outlined"
				size="small"
				value={value}
				label={label}
				onChange={(e) => handleChange(Number(e.target.value))}
				InputProps={{
					// startAdornment: <TextFieldsOutlined sx={{ fontSize: 16 }} />,
					endAdornment: (
						<Typography variant="body2" color="text.secondary">
							px
						</Typography>
					),
				}}
				inputProps={{
					min: 0,

					type: 'number',
				}}
			/>
		</Stack>
	);
}
