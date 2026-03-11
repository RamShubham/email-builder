import type { ZodError } from 'zod';
import React, { useState } from 'react';

import ContainerPropsSchema, {
	ContainerProps,
} from '../../../../documents/blocks/Container/ContainerPropsSchema';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ContainerSidebarPanelProps = {
	data: ContainerProps;
	setData: (v: ContainerProps) => void;
};

export default function ContainerSidebarPanel({
	data,
	setData,
}: ContainerSidebarPanelProps) {
	const [, setErrors] = useState<unknown>(null);
	const updateData = (d: unknown) => {
		const res = ContainerPropsSchema.safeParse(d);
		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};
	return (
		<BaseSidebarPanel title="Container block">
			<TextInput
				label="Url"
				defaultValue={data.props?.url ?? ''}
				onChange={(url) =>
					updateData({
						...data,
						props: { ...data.props, url: url || undefined },
					})
				}
			/>

			<MultiStylePropertyPanel
				names={[
					'backgroundColor',
					'borderColor',
					'borderRadius',
					'padding',
				]}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
