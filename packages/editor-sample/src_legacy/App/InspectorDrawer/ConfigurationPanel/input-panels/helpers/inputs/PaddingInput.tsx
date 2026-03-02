import React, { useState } from 'react';

import {
	AlignHorizontalLeftOutlined,
	AlignHorizontalRightOutlined,
	AlignVerticalBottomOutlined,
	AlignVerticalTopOutlined,
} from '@mui/icons-material';
import { Box, InputLabel, Stack, TextField, Typography } from '@mui/material';

type TPaddingValue = {
	top: number;
	bottom: number;
	right: number;
	left: number;
};
type Props = {
	label: string;
	defaultValue: TPaddingValue | null;
	onChange: (value: TPaddingValue) => void;
	dataTestId?: string;
};
export default function PaddingInput({
	label,
	defaultValue,
	onChange,
	dataTestId,
}: Props) {
	const [value, setValue] = useState(() => {
		if (defaultValue) {
			return defaultValue;
		}
		return {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		};
	});

	function handleChange(internalName: keyof TPaddingValue, nValue: number) {
		const v = {
			...value,
			[internalName]: nValue,
		};
		setValue(v);
		onChange(v);
	}

	return (
		<Stack spacing={2} alignItems="flex-start" pb={1}>
			<InputLabel shrink>{label}</InputLabel>

			<Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
					<AlignVerticalTopOutlined sx={{ fontSize: 16, mr: 1 }} />
					<TextField
						data-testid={`${dataTestId}-top`}
						fullWidth
						variant="outlined"
						size="small"
						value={value.top}
						onChange={(e) =>
							handleChange('top', Number(e.target.value))
						}
						InputProps={{
							endAdornment: (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									px
								</Typography>
							),
						}}
						inputProps={{
							min: 0,
							type: 'number',
							style: { textAlign: 'right' },
						}}
					/>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
					<AlignVerticalBottomOutlined sx={{ fontSize: 16, mr: 1 }} />
					<TextField
						data-testid={`${dataTestId}-bottom`}
						fullWidth
						variant="outlined"
						size="small"
						value={value.bottom}
						onChange={(e) =>
							handleChange('bottom', Number(e.target.value))
						}
						InputProps={{
							endAdornment: (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									px
								</Typography>
							),
						}}
						inputProps={{
							min: 0,
							type: 'number',
							style: { textAlign: 'right' },
						}}
					/>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
					<AlignHorizontalLeftOutlined sx={{ fontSize: 16, mr: 1 }} />
					<TextField
						data-testid={`${dataTestId}-left`}
						fullWidth
						variant="outlined"
						size="small"
						value={value.left}
						onChange={(e) =>
							handleChange('left', Number(e.target.value))
						}
						InputProps={{
							endAdornment: (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									px
								</Typography>
							),
						}}
						inputProps={{
							min: 0,
							type: 'number',
							style: { textAlign: 'right' },
						}}
					/>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
					<AlignHorizontalRightOutlined
						sx={{ fontSize: 16, mr: 1 }}
					/>
					<TextField
						data-testid={`${dataTestId}-right`}
						fullWidth
						variant="outlined"
						size="small"
						value={value.right}
						onChange={(e) =>
							handleChange('right', Number(e.target.value))
						}
						InputProps={{
							endAdornment: (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									px
								</Typography>
							),
						}}
						inputProps={{
							min: 0,
							type: 'number',
							style: { textAlign: 'right' },
						}}
					/>
				</Box>
			</Box>
		</Stack>
	);
}
