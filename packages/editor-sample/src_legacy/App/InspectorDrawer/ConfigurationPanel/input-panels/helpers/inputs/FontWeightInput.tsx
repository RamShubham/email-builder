import React, { useState } from 'react';

import { ToggleButton } from '@mui/material';

import RadioGroupInput from './RadioGroupInput';

type Props = {
	label: string;
	defaultValue: string;
	onChange: (value: string) => void;
	dataTestId?: string;
};
export default function FontWeightInput({
	label,
	defaultValue,
	onChange,
	dataTestId,
}: Props) {
	const [value, setValue] = useState(defaultValue);
	return (
		<RadioGroupInput
			dataTestId={dataTestId}
			label={label}
			defaultValue={value}
			onChange={(fontWeight) => {
				setValue(fontWeight);
				onChange(fontWeight);
			}}
		>
			<ToggleButton value="normal">Regular</ToggleButton>
			<ToggleButton value="bold">Bold</ToggleButton>
		</RadioGroupInput>
	);
}
