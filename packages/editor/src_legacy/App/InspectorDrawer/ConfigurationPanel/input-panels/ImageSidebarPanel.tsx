import { useRef, useState } from 'react';
import { z as Zod } from 'zod';

// import {
// 	VerticalAlignBottomOutlined,
// 	VerticalAlignCenterOutlined,
// 	VerticalAlignTopOutlined,
// } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import ImagePickerPanel from '../image-picker';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
// import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput, { TextInputRef } from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
	data: ImageProps & { template?: ImageProps['props'] };
	setData: (v: ImageProps) => void;
};
export default function ImageSidebarPanel({
	data,
	setData,
}: ImageSidebarPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);
	const urlRef = useRef<TextInputRef>(null);

	const updateData = (d: unknown) => {
		const res = ImagePropsSchema.safeParse(d);

		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel title="Image block" dataTestId="image-inspect-panel">
			<ImagePickerPanel
				onChange={(url: string) => {
					updateData({ ...data, props: { ...data.props, url } });
					urlRef.current?.setValue(url);
				}}
			/>

			<TextInput
				label="Source URL"
				defaultValue={data.template?.url ?? ''}
				onChange={(v) => {
					const url = v.trim().length === 0 ? null : v.trim();
					updateData({ ...data, props: { ...data.props, url } });
				}}
				autoFocus={true}
				onFocus={(event) => event.target.select()}
				ref={urlRef}
				dataTestId="inspect-panel-image-url-field"
			/>

			<TextInput
				label="Alt text"
				defaultValue={data.template?.alt ?? ''}
				onChange={(alt) => {
					updateData({ ...data, props: { ...data.props, alt } });
				}}
				dataTestId="inspect-panel-image-alt-text-field"
			/>
			<TextInput
				label="Click through URL"
				defaultValue={data.template?.linkHref ?? ''}
				onChange={(v) => {
					const linkHref = v.trim().length === 0 ? null : v.trim();
					updateData({ ...data, props: { ...data.props, linkHref } });
				}}
				dataTestId="inspect-panel-image-click-through-url-field"
			/>
			<Stack direction="row" spacing={2}>
				<TextDimensionInput
					label="Width"
					defaultValue={data.template?.width}
					onChange={(width) =>
						updateData({ ...data, props: { ...data.props, width } })
					}
					dataTestId="inspect-panel-image-width-field"
				/>
				<TextDimensionInput
					label="Height"
					defaultValue={data.template?.height}
					onChange={(height) =>
						updateData({
							...data,
							props: { ...data.props, height },
						})
					}
					dataTestId="inspect-panel-image-height-field"
				/>
			</Stack>

			{/* <RadioGroupInput
				label="Alignment"
				defaultValue={data.template?.contentAlignment ?? 'middle'}
				onChange={(contentAlignment) =>
					updateData({
						...data,
						props: { ...data.props, contentAlignment },
					})
				}
				dataTestId="inspect-panel-image-alignment-field"
			>
				<ToggleButton value="top">
					<VerticalAlignTopOutlined fontSize="small" />
				</ToggleButton>
				<ToggleButton value="middle">
					<VerticalAlignCenterOutlined fontSize="small" />
				</ToggleButton>
				<ToggleButton value="bottom">
					<VerticalAlignBottomOutlined fontSize="small" />
				</ToggleButton>
			</RadioGroupInput> */}

			<MultiStylePropertyPanel
				names={['backgroundColor', 'textAlign', 'padding']}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
