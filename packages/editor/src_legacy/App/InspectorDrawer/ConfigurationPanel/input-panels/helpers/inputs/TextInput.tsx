import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { InputProps, TextField } from '@mui/material';

export interface TextInputRef {
	setValue: (value: string) => void;
}

type Props = {
	label: string;
	rows?: number;
	placeholder?: string;
	helperText?: string | JSX.Element;
	InputProps?: InputProps;
	defaultValue: string;
	onChange: (v: string) => void;
	autoFocus?: boolean;
	onFocus?: (
		event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>
	) => void;
	onBlur?: (
		event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>
	) => void;
	dataTestId?: string;
};

const TextInput = forwardRef<TextInputRef, Props>(
	(
		{
			helperText,
			label,
			placeholder,
			rows,
			InputProps,
			defaultValue,
			onChange,
			autoFocus = false,
			onFocus,
			onBlur,
			dataTestId,
		},
		ref
	) => {
		const [value, setValue] = useState(defaultValue);

		useImperativeHandle(ref, () => ({
			setValue: (newValue: string) => {
				setValue(newValue);
				onChange(newValue);
			},
		}));

		const isMultiline = typeof rows === 'number' && rows > 1;

		return (
			<TextField
				fullWidth
				multiline={isMultiline}
				minRows={rows}
				variant={isMultiline ? 'outlined' : 'standard'}
				label={label}
				placeholder={placeholder}
				helperText={helperText}
				InputProps={{
					...InputProps,
					inputProps: {
						...InputProps?.inputProps,
						'data-testid': dataTestId,
					},
				}}
				value={value}
				onChange={(ev) => {
					const v = ev.target.value;
					setValue(v);
					onChange(v);
				}}
				autoFocus={autoFocus}
				onFocus={(event) => {
					onFocus && onFocus(event);
				}}
				onBlur={(event) => {
					onBlur && onBlur(event);
				}}
			/>
		);
	}
);

TextInput.displayName = 'TextInput';

export default TextInput;
