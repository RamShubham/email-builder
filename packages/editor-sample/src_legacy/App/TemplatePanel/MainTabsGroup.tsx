import { useState } from 'react';

import {
	CodeOutlined,
	DataObjectOutlined,
	EditOutlined,
	PreviewOutlined,
} from '@mui/icons-material';
import { Tab, Tabs, Tooltip } from '@mui/material';

import {
	setSelectedMainTab,
	useSelectedMainTab,
} from '../../documents/editor/EditorContext';

const getTabSx = (isHovered: boolean) => {
	return {
		transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
		transform: isHovered ? 'scale(1.1)' : 'scale(1)',
	};
};

export default function MainTabsGroup() {
	const selectedMainTab = useSelectedMainTab();
	const [hoveredTab, setHoveredTab] = useState<string | null>(null);

	const handleChange = (_: unknown, v: unknown) => {
		switch (v) {
			case 'json':
			case 'preview':
			case 'editor':
			case 'html':
				setSelectedMainTab(v);
				return;
			default:
				setSelectedMainTab('editor');
		}
	};

	const handleTabHover = (tabValue: string) => {
		setHoveredTab(tabValue);
	};

	const handleTabLeave = () => {
		setHoveredTab(null);
	};

	return (
		<Tabs
			value={selectedMainTab}
			scrollButtons={false}
			onChange={handleChange}
			sx={{
				'& .MuiTab-root': {
					transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

					'&:hover': {
						transform: 'scale(1.05)',
						backgroundColor: 'rgba(33, 33, 33, 0.1)',
						'& .MuiSvgIcon-root': {
							color: '#333',
							transform: 'scale(1.1)',
						},
					},
				},
				'& .MuiTabs-indicator': {
					height: 2,
					borderRadius: '2px 2px 0 0',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					boxShadow: '0 0 8px rgba(33, 150, 243, 0.3)',
				},
				// Smooth color transitions
				'& .MuiTab-root.Mui-selected': {
					color: '#333',
					transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				},
				'& .MuiTab-root:not(.Mui-selected)': {
					color: 'text.secondary',
					transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				},
			}}
		>
			<Tab
				value="editor"
				label={
					<Tooltip title="Edit" enterDelay={300} leaveDelay={0}>
						<EditOutlined
							fontSize="small"
							sx={getTabSx(hoveredTab === 'editor')}
						/>
					</Tooltip>
				}
				data-testid="editor-tab"
				onMouseEnter={() => handleTabHover('editor')}
				onMouseLeave={handleTabLeave}
			/>
			<Tab
				value="preview"
				label={
					<Tooltip title="Preview" enterDelay={300} leaveDelay={0}>
						<PreviewOutlined
							fontSize="small"
							sx={getTabSx(hoveredTab === 'preview')}
						/>
					</Tooltip>
				}
				data-testid="preview-tab"
				onMouseEnter={() => handleTabHover('preview')}
				onMouseLeave={handleTabLeave}
			/>
			<Tab
				value="html"
				label={
					<Tooltip
						title="HTML output"
						enterDelay={300}
						leaveDelay={0}
					>
						<CodeOutlined
							fontSize="small"
							sx={getTabSx(hoveredTab === 'html')}
						/>
					</Tooltip>
				}
				data-testid="html-tab"
				onMouseEnter={() => handleTabHover('html')}
				onMouseLeave={handleTabLeave}
			/>
			<Tab
				value="json"
				label={
					<Tooltip
						title="JSON output"
						enterDelay={300}
						leaveDelay={0}
					>
						<DataObjectOutlined
							fontSize="small"
							sx={getTabSx(hoveredTab === 'json')}
						/>
					</Tooltip>
				}
				data-testid="json-tab"
				onMouseEnter={() => handleTabHover('json')}
				onMouseLeave={handleTabLeave}
			/>
		</Tabs>
	);
}
