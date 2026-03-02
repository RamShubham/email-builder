import React, { useState } from 'react';

import {
	VerticalAlignBottomOutlined,
	VerticalAlignCenterOutlined,
	VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { TextField, ToggleButton, Typography } from '@mui/material';

import ColumnsContainerPropsSchema, {
	ColumnsContainerProps,
} from '../../../../documents/blocks/ColumnsContainer/ColumnsContainerPropsSchema';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColumnWidthsInput from './helpers/inputs/ColumnWidthsInput';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ColumnsContainerPanelProps = {
	data: ColumnsContainerProps;
	setData: (v: ColumnsContainerProps) => void;
};

export default function ColumnsContainerPanel({
	data,
	setData,
}: ColumnsContainerPanelProps) {
	const [, setErrors] = useState<Zod.ZodError | null>(null);
	const updateData = (d: unknown) => {
		const res = ColumnsContainerPropsSchema.safeParse(d);

		if (res.success) {
			setData(res.data);
			setErrors(null);
		} else {
			setErrors(res.error);
		}
	};

	return (
		<BaseSidebarPanel title="Columns block">
			<RadioGroupInput
				label="Number of columns"
				defaultValue={data.props?.columnsCount === 2 ? '2' : '3'}
				onChange={(v) => {
					updateData({
						...data,
						props: {
							...data.props,
							columnsCount: v === '2' ? 2 : 3,
						},
					});
				}}
			>
				<ToggleButton value="2">2</ToggleButton>
				<ToggleButton value="3">3</ToggleButton>
			</RadioGroupInput>

			<TextInput
				label="Url"
				defaultValue={data.props?.url ?? ''}
				onChange={(url) => {
					updateData({
						...data,
						props: { ...data.props, url: url || undefined },
					});
				}}
			/>

			<ColumnWidthsInput
				defaultValue={data.props?.fixedWidths}
				onChange={(fixedWidths) => {
					updateData({
						...data,
						props: { ...data.props, fixedWidths },
					});
				}}
			/>

			<TextField
				fullWidth
				label="Columns gap"
				variant="outlined"
				size="small"
				defaultValue={data.props?.columnsGap ?? 0}
				onChange={(e) =>
					updateData({
						...data,
						props: {
							...data.props,
							columnsGap: Number(e.target.value),
						},
					})
				}
				InputProps={{
					endAdornment: (
						<Typography variant="body2" color="text.secondary">
							px
						</Typography>
					),
				}}
				inputProps={{
					min: 0,
					type: 'number',
				}}
			/>

			<RadioGroupInput
				label="Alignment"
				defaultValue={data.props?.contentAlignment ?? 'middle'}
				onChange={(contentAlignment) => {
					updateData({
						...data,
						props: { ...data.props, contentAlignment },
					});
				}}
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
			</RadioGroupInput>

			<MultiStylePropertyPanel
				names={['backgroundColor', 'padding']}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}
