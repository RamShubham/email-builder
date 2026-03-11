import React, { useState } from 'react';
import { z } from 'zod';

import { TextProps, TextPropsSchema } from '@usewaypoint/block-text';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type TextSidebarPanelProps = {
	data: TextProps & { template?: TextProps['props'] & { url?: string } };
	setData: (v: TextProps) => void;
};

export default function TextSidebarPanel({
	data,
	setData,
}: TextSidebarPanelProps) {
	const [, setErrors] = useState<z.ZodError | null>(null);

	const updateData = (d: unknown) => {
		const res = TextPropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel title="Text block" dataTestId="text-inspect-panel">
			<TextInput
				label="Content"
				rows={5}
				defaultValue={data.template?.text ?? ''}
				onChange={(text) =>
					updateData({ ...data, props: { ...data.props, text } })
				}
				dataTestId="inspect-panel-content-field"
			/>
			<BooleanInput
				label="Markdown"
				defaultValue={data.template?.markdown ?? false}
				onChange={(markdown) =>
					updateData({ ...data, props: { ...data.props, markdown } })
				}
				dataTestId="inspect-panel-markdown-switch"
			/>

			<TextInput
				label="Url"
				defaultValue={data.template?.url ?? ''}
				onChange={(url) => {
					updateData({
						...data,
						props: { ...data.props, url: url || undefined },
					});
				}}
				dataTestId="inspect-panel-url-field"
			/>

			<MultiStylePropertyPanel
				names={[
					'borderRadius',
					'color',
					'backgroundColor',
					'fontFamily',
					'fontSize',
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
