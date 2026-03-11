import React, { useState } from 'react';

import { MenuItem, TextField } from '@mui/material';

import { FONT_FAMILIES } from '../../../../../../documents/blocks/helpers/fontFamily';

const OPTIONS = FONT_FAMILIES.map((option) => (
	<MenuItem
		key={option.key}
		value={option.key}
		sx={{ fontFamily: option.value }}
		data-testid={`font-family-option-${option.key}`}
	>
		{option.label}
	</MenuItem>
));

type NullableProps = {
	label: string;
	onChange: (value: null | string) => void;
	defaultValue: null | string;
	dataTestId?: string;
};
export function NullableFontFamily({
	label,
	onChange,
	defaultValue,
	dataTestId,
}: NullableProps) {
	const [value, setValue] = useState(defaultValue ?? 'inherit');
	return (
		<TextField
			select
			variant="standard"
			label={label}
			value={value}
			onChange={(ev) => {
				const v = ev.target.value;
				setValue(v);
				onChange(v === null ? null : v);
			}}
			id={dataTestId}
		>
			<MenuItem value="inherit">Match email settings</MenuItem>
			{OPTIONS}
		</TextField>
	);
}
