import React from 'react';

import { AppRegistrationOutlined, LastPageOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import {
	toggleInspectorDrawerOpen,
	useInspectorDrawerOpen,
} from '../../documents/editor/EditorContext';

const InspectIcon = () => {
	const inspectorDrawerOpen = useInspectorDrawerOpen();

	if (inspectorDrawerOpen) {
		return <LastPageOutlined fontSize="small" />;
	}

	return <AppRegistrationOutlined fontSize="small" />;
};

export default function ToggleInspectorPanelButton() {
	const handleClick = () => {
		toggleInspectorDrawerOpen();
	};

	return (
		<IconButton
			onClick={handleClick}
			data-testid="inspector-panel-button"
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
			<InspectIcon />
		</IconButton>
	);
}
