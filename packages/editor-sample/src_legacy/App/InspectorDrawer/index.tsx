import { Box, Drawer, Tab, Tabs } from '@mui/material';

import {
	setSidebarTab,
	useInspectorDrawerOpen,
	useSelectedSidebarTab,
} from '../../documents/editor/EditorContext';

import BlocksPanel from './BlocksPanel';
import ConfigurationPanel from './ConfigurationPanel';
import DataPanel from './DataPanel';
import StylesPanel from './StylesPanel';

export const INSPECTOR_DRAWER_WIDTH = 320;

export default function InspectorDrawer() {
	const selectedSidebarTab = useSelectedSidebarTab();
	const inspectorDrawerOpen = useInspectorDrawerOpen();

	const renderCurrentSidebarPanel = () => {
		switch (selectedSidebarTab) {
			case 'block-configuration':
				return <ConfigurationPanel />;
			case 'styles':
				return <StylesPanel />;
			case 'data':
				return <DataPanel />;
			case 'blocks':
				return <BlocksPanel />;
		}
	};

	return (
		<Drawer
			variant="persistent"
			anchor="right"
			open={inspectorDrawerOpen}
			sx={{
				width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
				'& .MuiPaper-elevation': {
					top: 'unset',
					height: 'calc(100% - 60px)',
				},
			}}
		>
			<Box data-testid="inspector-panel" height="100%">
				<Box
					sx={{
						width: INSPECTOR_DRAWER_WIDTH,
						height: 49,
						borderBottom: 1,
						borderColor: 'divider',
					}}
				>
					<Box px={2}>
						<Tabs
							value={selectedSidebarTab}
							onChange={(_, v) => setSidebarTab(v)}
							scrollButtons={false}
							sx={{
								'& .MuiTab-root': {
									transition:
										'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										transform: 'translateY(-1px)',
										backgroundColor:
											'rgba(33, 33, 33, 0.1)',
									},
								},
								'& .MuiTabs-indicator': {
									transition:
										'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									height: 3,
									borderRadius: '2px 2px 0 0',
								},
							}}
						>
							<Tab
								value="blocks"
								label="Blocks"
								data-testid="blocks-panel-tab"
							/>
							<Tab
								value="styles"
								label="Styles"
								data-testid="styles-panel-tab"
							/>
							<Tab
								value="block-configuration"
								label="Inspect"
								data-testid="inspect-panel-tab"
							/>
							<Tab
								value="data"
								label="Data"
								data-testid="data-panel-tab"
							/>
						</Tabs>
					</Box>
				</Box>
				<Box
					sx={{
						width: INSPECTOR_DRAWER_WIDTH,
						height: 'calc(100% - 49px)',
						overflow: 'auto',
					}}
				>
					{renderCurrentSidebarPanel()}
				</Box>
			</Box>
		</Drawer>
	);
}
