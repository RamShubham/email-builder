import React, { useState } from 'react';

import { FormControlLabel, Switch } from '@mui/material';

type Props = {
	label: string;
	defaultValue: boolean;
	onChange: (value: boolean) => void;
	dataTestId?: string;
};

export default function BooleanInput({
	label,
	defaultValue,
	onChange,
	dataTestId,
}: Props) {
	const [value, setValue] = useState(defaultValue);
	return (
		<FormControlLabel
			label={label}
			control={
				<Switch
					checked={value}
					data-testid={dataTestId}
					onChange={(_, checked: boolean) => {
						setValue(checked);
						onChange(checked);
					}}
				/>
			}
		/>
	);
}
