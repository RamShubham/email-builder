import React from 'react';

import BaseColorInput from './BaseColorInput';

type Props = {
	label: string;
	onChange: (value: string) => void;
	defaultValue: string;
	dataTestId?: string;
};
export default function ColorInput(props: Props) {
	return <BaseColorInput {...props} nullable={false} />;
}

type NullableProps = {
	label: string;
	onChange: (value: null | string) => void;
	defaultValue: null | string;
	dataTestId?: string;
};
export function NullableColorInput(props: NullableProps) {
	return <BaseColorInput {...props} nullable />;
}
