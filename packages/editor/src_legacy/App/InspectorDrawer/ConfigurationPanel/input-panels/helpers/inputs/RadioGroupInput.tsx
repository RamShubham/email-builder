import React, { useState } from 'react';

import { InputLabel, Stack, ToggleButtonGroup } from '@mui/material';

type Props = {
	label: string | JSX.Element;
	children: JSX.Element | JSX.Element[];
	defaultValue: string;
	onChange: (v: string) => void;
	dataTestId?: string;
};
export default function RadioGroupInput({
	label,
	children,
	defaultValue,
	onChange,
	dataTestId,
}: Props) {
	const [value, setValue] = useState(defaultValue);
	return (
		<Stack alignItems="flex-start">
			<InputLabel shrink>{label}</InputLabel>
			<ToggleButtonGroup
				data-testid={dataTestId}
				exclusive
				fullWidth
				value={value}
				size="small"
				onChange={(_, v: unknown) => {
					if (typeof v !== 'string') {
						throw new Error(
							'RadioGroupInput can only receive string values'
						);
					}
					setValue(v);
					onChange(v);
				}}
			>
				{children}
			</ToggleButtonGroup>
		</Stack>
	);
}
