import React from 'react';

import { FirstPageOutlined, MenuOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import {
	toggleSamplesDrawerOpen,
	useSamplesDrawerOpen,
} from '../../documents/editor/EditorContext';

function useIcon() {
	const samplesDrawerOpen = useSamplesDrawerOpen();
	if (samplesDrawerOpen) {
		return <FirstPageOutlined fontSize="small" />;
	}
	return <MenuOutlined fontSize="small" />;
}

export default function ToggleNavigatorPanelButton() {
	const icon = useIcon();
	return (
		<IconButton
			onClick={toggleSamplesDrawerOpen}
			data-testid="navigator-panel-button"
			sx={{
				borderRadius: '0.375rem',
				transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

				'&:hover': {
					backgroundColor: 'rgba(33, 33, 33, 0.1)',

					'& .MuiSvgIcon-root': {
						color: '#333',
					},
				},
			}}
		>
			{icon}
		</IconButton>
	);
}
