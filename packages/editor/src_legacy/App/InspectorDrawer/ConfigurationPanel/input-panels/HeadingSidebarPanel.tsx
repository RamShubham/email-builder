import React, { useState } from 'react';
import { z as Zod } from 'zod';

import { ToggleButton } from '@mui/material';
import {
	HeadingProps,
	HeadingPropsDefaults,
	HeadingPropsSchema,
} from '@usewaypoint/block-heading';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type HeadingSidebarPanelProps = {
	data: HeadingProps & {
		template?: HeadingProps['props'] & { url?: string };
	};
	setData: (v: HeadingProps) => void;
};

export default function HeadingSidebarPanel({
	data,
	setData,
}: HeadingSidebarPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);

	const updateData = (d: unknown) => {
		const res = HeadingPropsSchema.safeParse(d);
		console.log('res >>', res);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel
			title="Heading block"
			dataTestId="heading-inspect-panel"
		>
			<TextInput
				label="Content"
				rows={3}
				defaultValue={data.template?.text ?? HeadingPropsDefaults.text}
				onChange={(text) => {
					updateData({ ...data, props: { ...data.props, text } });
				}}
				dataTestId="inspect-panel-content-field"
			/>
			<RadioGroupInput
				label="Level"
				defaultValue={data.props?.level ?? HeadingPropsDefaults.level}
				onChange={(level) => {
					updateData({ ...data, props: { ...data.props, level } });
				}}
			>
				<ToggleButton value="h1" data-testid="inspect-panel-h1-button">
					H1
				</ToggleButton>
				<ToggleButton value="h2" data-testid="inspect-panel-h2-button">
					H2
				</ToggleButton>
				<ToggleButton value="h3" data-testid="inspect-panel-h3-button">
					H3
				</ToggleButton>
			</RadioGroupInput>

			<TextInput
				label="Url"
				defaultValue={data.template?.url ?? ''}
				onChange={(url) =>
					updateData({
						...data,
						props: { ...data.props, url: url || undefined },
					})
				}
				dataTestId="inspect-panel-url-field"
			/>

			<MultiStylePropertyPanel
				names={[
					'borderRadius',
					'color',
					'backgroundColor',
					'fontFamily',
					'fontWeight',
					'textAlign',
					'padding',
				]}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
