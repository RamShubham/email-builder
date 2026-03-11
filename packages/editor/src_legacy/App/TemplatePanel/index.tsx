import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import {
	Box,
	Stack,
	SxProps,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
} from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';

import {
	setSelectedScreenSize,
	useDocument,
	useSelectedMainTab,
	useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleNavigatorPanelButton from '../NavigatorDrawer/ToggleNavigatorPanelButton';

import CustomEditorBlock from './CustomEditorBlock';
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
// import ShareButton from './ShareButton';

export default function TemplatePanel() {
	const document = useDocument();
	const selectedMainTab = useSelectedMainTab();
	const selectedScreenSize = useSelectedScreenSize();

	let mainBoxSx: SxProps = {
		height: '100%',
	};

	if (selectedScreenSize === 'mobile') {
		mainBoxSx = {
			...mainBoxSx,
			margin: '32px auto',
			width: 370,
			height: 800,
			boxShadow:
				'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
		};
	}

	const handleScreenSizeChange = (_: unknown, value: unknown) => {
		switch (value) {
			case 'mobile':
			case 'desktop':
				setSelectedScreenSize(value);
				return;
			default:
				setSelectedScreenSize(
					selectedScreenSize === 'desktop' ? 'desktop' : 'mobile'
				);
		}
	};

	const renderMainPanel = () => {
		switch (selectedMainTab) {
			case 'editor':
				return <CustomEditorBlock mainBoxSx={mainBoxSx} />;
			case 'preview':
				return (
					<Box sx={mainBoxSx} data-testid="preview-tab-content">
						<Reader document={document as any} rootBlockId="root" />
					</Box>
				);
			case 'html':
				return <HtmlPanel />;
			case 'json':
				return <JsonPanel />;
		}
	};

	return (
		<>
			<Stack
				sx={{
					height: 49,
					borderBottom: 1,
					borderColor: 'divider',
					backgroundColor: 'white',
					position: 'sticky',
					top: 0,
					zIndex: 'appBar',
					px: 1,
				}}
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				data-testid="toolbar"
			>
				<ToggleNavigatorPanelButton />

				<Stack
					px={2}
					direction="row"
					gap={2}
					width="100%"
					justifyContent="space-between"
					alignItems="center"
				>
					<Stack direction="row" spacing={2}>
						<MainTabsGroup />
					</Stack>

					<Stack direction="row" spacing={2}>
						<DownloadJson />
						<ImportJson />

						<ToggleButtonGroup
							value={selectedScreenSize}
							exclusive
							size="small"
							onChange={handleScreenSizeChange}
							sx={{
								'& .MuiToggleButton-root': {
									transition:
										'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										transform: 'scale(1.05)',
										backgroundColor:
											'rgba(33, 33, 33, 0.2)',
									},
								},
							}}
						>
							<ToggleButton value="desktop">
								<Tooltip title="Desktop view">
									<MonitorOutlined
										fontSize="small"
										data-testid="desktop-view-button"
									/>
								</Tooltip>
							</ToggleButton>

							<ToggleButton value="mobile">
								<Tooltip title="Mobile view">
									<PhoneIphoneOutlined
										fontSize="small"
										data-testid="mobile-view-button"
									/>
								</Tooltip>
							</ToggleButton>
						</ToggleButtonGroup>

						{/* <ShareButton /> */}
					</Stack>
				</Stack>

				<ToggleInspectorPanelButton />
			</Stack>

			{/* Main content area with transition animations */}
			{/* 
				This container uses position: relative to create a positioning context
				for the absolutely positioned transition elements. This enables smooth
				fade transitions between editor/preview/HTML/JSON modes without layout shifts.
				
				The TransitionGroup and CSSTransition components handle the animation
				logic, while the CSS classes define the actual transition effects.
			*/}
			<Box
				sx={{
					height: 'calc(100vh - 49px - 60px)',
					overflow: 'auto',
					minWidth: 370,

					position: 'relative',
					'& .tab-content-wrapper': {
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					},
					// CSS classes for React Transition Group animations
					// These define the enter/exit states for smooth tab switching
					'& .fade-enter': {
						opacity: 0,
						transform: 'translateX(20px)',
					},
					'& .fade-enter-active': {
						opacity: 1,
						transform: 'translateX(0)',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					},
					'& .fade-exit': {
						opacity: 1,
						transform: 'translateX(0)',
					},
					'& .fade-exit-active': {
						opacity: 0,
						transform: 'translateX(-20px)',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					},
				}}
			>
				{/* React Transition Group for smooth tab switching */}
				{/* 
					This manages the animation lifecycle for switching between
					editor/preview/HTML/JSON modes. Each tab change triggers
					a smooth fade transition with slide effects.
				*/}
				<TransitionGroup>
					<CSSTransition
						key={selectedMainTab}
						timeout={300}
						classNames={{
							enter: 'fade-enter',
							enterActive: 'fade-enter-active',
							exit: 'fade-exit',
							exitActive: 'fade-exit-active',
						}}
						unmountOnExit
					>
						<div className="tab-content-wrapper">
							{renderMainPanel()}
						</div>
					</CSSTransition>
				</TransitionGroup>
			</Box>
		</>
	);
}
